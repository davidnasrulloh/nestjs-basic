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
    // await testService.deleteContact()
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

    it("should be rejected if contact is not found", async () => {
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

  describe("PUT /api/contacts/:contactId", () => {

    beforeEach(async ()=>{
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser()
        await testService.createContact()
    })

    it("should be rejected if request is invalid", async () => {
        const contact = await testService.getContact()
        const response = await request(app.getHttpServer())
            .put(`/api/contacts/${contact.id}`)
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

    it("should be rejected if request is not found", async () => {
        const contact = await testService.getContact()
        const response = await request(app.getHttpServer())
            .put(`/api/contacts/${contact.id + 1}`)
            .set('Authorization', 'test')
            .send({
                first_name: 'test',
                last_name: 'test',
                email: 'test@mail.com',
                phone: '9999'
            })

        logger.info(response.body)
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    })

    it("should be abble to update contact", async () => {
        const contact = await testService.getContact()
        const response = await request(app.getHttpServer())
            .put(`/api/contacts/${contact.id}`)
            .set('Authorization', 'test')
            .send({
                first_name: 'test updated',
                last_name: 'test updated',
                email: 'testupdated@mail.com',
                phone: '8888'
            })

        logger.info(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe('test updated');
        expect(response.body.data.last_name).toBe('test updated');
        expect(response.body.data.email).toBe('testupdated@mail.com');
        expect(response.body.data.phone).toBe('8888');
    })

    
  })

  describe("DELETE /api/contacts/:contactId", () => {

    beforeEach(async ()=>{
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser()
        await testService.createContact()
    })

    it("should be rejected if contact is not found", async () => {
        const contact = await testService.getContact();
        const response = await request(app.getHttpServer())
            .delete(`/api/contacts/${contact.id + 1}`)
            .set('Authorization', 'test')

        logger.info(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should be abble to remove contact", async () => {
        const contact = await testService.getContact();
        const response = await request(app.getHttpServer())
            .delete(`/api/contacts/${contact.id}`)
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data).toBe(true);
    });
  })

  describe("GET /api/contacts", () => {

    beforeEach(async ()=>{
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser()
        await testService.createContact()
    })

    it("should be abble to search contact", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1)
    });

    it("should be abble to search contact by name", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .query({
                name: 'es',
            })
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1)
    });

    it("should be abble to search contact by name not found", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .query({
                name: 'wrong',
            })
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0)
    });

    it("should be abble to search contact by email", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .query({
                email: 'es',
            })
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1)
    });

    it("should be abble to search contact by email not found", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .query({
                email: 'wrong',
            })
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0)
    });

    it("should be abble to search contact by phone", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .query({
                phone: '99',
            })
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1)
    });

    it("should be abble to search contact by phone not found", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .query({
                phone: '00',
            })
            .set('Authorization', 'test')

        logger.info(response.body)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0)
    });

    it("should be abble to search contact with page", async () => {
        const response = await request(app.getHttpServer())
            .get(`/api/contacts`)
            .query({
                size: 1,
                page: 2
            })
            .set('Authorization', 'test')

        logger.info(response.body)
        console.log('itemku response', response)
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(2);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    });

  })
  
});
