import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
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

  describe("POST /api/users", () => {

    beforeEach(async ()=>{
      await testService.deleteUser()
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: ''
        })

      logger.info(response.body)
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    })

    it("should be abble to register", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test'
        })

      logger.info(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    })

    it("should be rejected if username already exists", async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test'
        })

      logger.info(response.body)
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined()
    })
  })

  describe("POST /api/users/login", () => {

    beforeEach(async ()=>{
      await testService.deleteUser()
      await testService.createUser()
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: ''
        })

      logger.info(response.body)
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    })

    it("should be abble to login", async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        })

      logger.info(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined()
    })
  })

  describe("GET /api/users/current", () => {

    beforeEach(async ()=>{
      await testService.deleteUser()
      await testService.createUser()
    })

    it("should be rejected if token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'wrong')

      logger.info(response.body)
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    })

    it("should be abble to get user", async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'test')

      logger.info(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    })
  })

  describe("PATCH /api/users/current", () => {

    beforeEach(async ()=>{
      await testService.deleteUser()
      await testService.createUser()
    })

    it("should be rejected if request is invalid", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
          password: '',
          name: ''
        })

      logger.info(response.body)
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    })

    it("should be abble to update name", async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
          name: 'david updated'
        })

      logger.info(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('david updated');
    })


    it("should be abble to update password", async () => {
      let response = await request(app.getHttpServer())
        .patch('/api/users/current')
        .set('Authorization', 'test')
        .send({
          password: 'updated'
        })

      logger.info(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');

      response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'updated'
        })

      logger.info(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
    })

  })

  describe("DELETE /api/users/current", () => {

    beforeEach(async ()=>{
      await testService.deleteUser()
      await testService.createUser()
    })

    it("should be rejected if token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'wrong')

      logger.info(response.body)
      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    })

    it("should be abble to logout", async () => {
      const response = await request(app.getHttpServer())
        .delete('/api/users/current')
        .set('Authorization', 'test')

      logger.info(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const user = await testService.getUser()
      expect(user.token).toBeNull()
    })
  })
});
