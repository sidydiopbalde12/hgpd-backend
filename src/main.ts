import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Préfixe global API
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  const corsOrigin = configService.get<string>('CORS_ORIGIN') || 'http://localhost:3001';
  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('HGPD API')
    .setDescription('API de mise en relation événementielle')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification prestataires')
    .addTag('providers', 'Gestion prestataires')
    .addTag('events', 'Gestion événements')
    .addTag('payments', 'Paiements Wave')
    .addTag('notifications', 'Notifications WhatsApp/Email')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = parseInt(configService.get<string>('PORT') || '3000', 10);
  await app.listen(port);

  console.log(`
  🚀 Application HGPD démarrée avec succès !
  🌍 Environnement: ${configService.get('NODE_ENV') || 'development'}
  🔗 API: http://localhost:${port}/${apiPrefix}
  📚 Swagger: http://localhost:${port}/api/docs
  `);
}
bootstrap();