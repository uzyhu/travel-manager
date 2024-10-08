import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthModule } from './auth/auth.module';

import { UsersModule } from './modules/users/users.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { UploadModule } from './modules/upload/upload.module';
import { CostModule } from './modules/cost/cost.module';
import { PlanModule } from './modules/plan/plan.module';
import { DayModule } from './modules/day/day.module';
import { ActivityModule } from './modules/activity/activity.module';

import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CountryModule } from './modules/country/country.module';
import { CityModule } from './modules/city/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      charset: 'utf8mb4_general_ci',
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      },
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    AuthModule,
    UsersModule,
    CurrencyModule,
    UploadModule,
    CostModule,
    PlanModule,
    DayModule,
    ActivityModule,
    CountryModule,
    CityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
