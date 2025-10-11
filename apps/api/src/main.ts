import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
  console.log('Working directory:', process.cwd());
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.VITE_FRONTEND_URL,
    process.env.VITE_FRONTEND_URL_localhost,
  ].filter(Boolean), 
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
  })
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || undefined;
  console.log(`Starting server on port ${port}`);
  
  await app.listen(port, host);
}

void bootstrap();
