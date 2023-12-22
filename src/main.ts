import {NestFactory} from "@nestjs/core";
import {AppModule} from "./AppModule";
import {Logger, ValidationPipe} from "@nestjs/common";
import {DownStreamExceptionFilter} from "./filters/ExceptionFilter";
import {ResponseInterceptor} from "./filters/ResponseInterceptor";

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true
    })
  );
  const port = process.env.API_PROXY_PORT || 2000;
  Logger.log(`api-gateway running on port ${port}`);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new DownStreamExceptionFilter());

  await app.listen(port);
}
bootstrap();


// async function bootstrap() {
//   const app = await NestFactory.create(AppModule,{
//     cors: {
//       origin: "http://localhost:8080",
//       // methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
//       // allowedHeaders:
//       //     "X-Requested-With,x-api-key, X-HTTP-Method-Override, Authorization, Content-Type, Accept, Observe",
//       credentials: true
//     }
//   });
//
//   const port = process.env.API_PROXY_PORT || 2000;
//   Logger.log(`api-gateway running on port ${port}`);
//
//   app.useGlobalPipes(new ValidationPipe());
//   app.useGlobalInterceptors(new ResponseInterceptor());
//   app.useGlobalFilters(new DownStreamExceptionFilter());
//   // app.useGlobalGuards(new AuthGuard());
//   await app.listen(port);
// }

// bootstrap();
