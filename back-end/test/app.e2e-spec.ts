import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import axios from 'axios';
import { Server } from 'http';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let baseURL: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    await new Promise<void>((resolve) => server.listen(0, resolve));

    const address = server.address();
    if (address === null || typeof address === 'string') {
      throw new Error(
        'Server is not listening or returned an unexpected address type.',
      );
    }

    const port = address.port;
    baseURL = `http://localhost:${port}`;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/profile (GET)', async () => {
    try {
      const response = await axios.get(`${baseURL}/profile`);
      expect(response.status).toBe(401);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(401);
      } else {
        throw error;
      }
    }
  });
});
