import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston'
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

    logger = app.get(WINSTON_MODULE_PROVIDER)
    testService = app.get(TestService)
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/contacts", () => {

    beforeEach(async ()=>{
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser()
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: 'salah',
          phone: ''
        })

        logger.info(response.body)
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it("should be abble to create contact", async () => {
        const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
            first_name: 'test',
            last_name: 'test',
            email: 'test@mail.com',
            phone: '9999'
        })

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe('test');
        expect(response.body.data.last_name).toBe('test');
        expect(response.body.data.email).toBe('test@mail.com');
        expect(response.body.data.phone).toBe('9999');
    })
  })

  describe("GET /api/contacts/:contactId", () => {

    beforeEach(async ()=>{
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser()
        await testService.createContact()
    })

    it("should be rejected if contac is not found", async () => {
        const contact = await testService.getContact();
        const response = await request(app.getHttpServer())
            .get(`/api/contacts/${contact.id + 1}`)
            .set('Authorization', 'test')

        logger.info(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should be abble to get contact", async () => {
        const contact = await testService.getContact();
        const response = await request(app.getHttpServer())
            .get(`/api/contacts/${contact.id}`)
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe('test');
        expect(response.body.data.last_name).toBe('test');
        expect(response.body.data.email).toBe('test@mail.com');
        expect(response.body.data.phone).toBe('9999');
    });
  })
});
