import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactsController', () => {
    let app: INestApplication;
    let logger: Logger;
    let testService: TestService;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        logger = app.get(WINSTON_MODULE_PROVIDER);
        testService = app.get(TestService);
    });

    afterAll(async () => {
        await app.close();
        // await testService.deleteContact()
    });

    describe('POST /api/contacts/:contactId/addresses', () => {
        beforeEach(async () => {
            await testService.deleteAddress();
            await testService.deleteContact();
            await testService.deleteUser();

            await testService.createUser();
            await testService.createContact();
        });

        it('should be rejected if request is invalid', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .post(`/api/contacts/${contact.id}/addresses`)
                .set('Authorization', 'test')
                .send({
                    street: '',
                    city: '',
                    province: '',
                    country: '',
                    postal_code: '',
                });

            logger.info(response.body);
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be abble to create address', async () => {
            const contact = await testService.getContact();
            const response = await request(app.getHttpServer())
                .post(`/api/contacts/${contact.id}/addresses`)
                .set('Authorization', 'test')
                .send({
                    street: 'jalan test',
                    city: 'kota test',
                    province: 'province test',
                    country: 'country test',
                    postal_code: '1111',
                });

            logger.info(response.body);
            expect(response.status).toBe(200);
            expect(response.body.data.id).toBeDefined();
            expect(response.body.data.street).toBe('jalan test');
            expect(response.body.data.city).toBe('kota test');
            expect(response.body.data.province).toBe('province test');
            expect(response.body.data.country).toBe('country test');
            expect(response.body.data.postal_code).toBe('1111');
        });
    });
});
