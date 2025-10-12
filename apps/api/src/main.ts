import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
  console.log('Working directory:', process.cwd());
  const app = await NestFactory.create(AppModule);

  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

  if (isDevelopment) {
    // Local development CORS
    console.log('Running in DEVELOPMENT mode');
    app.enableCors({
      origin: 'http://localhost:3001', // Your local frontend
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  } else {
    // Production CORS
    console.log('Running in PRODUCTION mode');
    app.enableCors({
      origin: process.env.VITE_FRONTEND_URL, // Your deployed frontend
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || undefined;
  console.log(`Starting server on port ${port}`);
  
  await app.listen(port, host);
}

void bootstrap();
