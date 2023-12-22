import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {AppModule} from '../src/AppModule';
import {INestApplication} from '@nestjs/common';

describe('general', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            // .overrideProvider(GeneralService)
            // .useValue(generalService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    it(`/POST something`, () => {
        return request(app.getHttpServer())
            .post('/api')
            .send({
                type: "string",
                contents: JSON.stringify({
                })
            })
            .expect(200)
            .expect({data: ['hello'], statusCode: 200});
    });

    it(`/GET details`, () => {
        return request(app.getHttpServer())
            .post('/api')
            .send({
                type: "string",
                contents: JSON.stringify({
                })
            })
            .expect(200)
            .expect({data: ['hello'], statusCode: 200});
    });

    afterAll(async () => {
        await app.close();
    });
});
