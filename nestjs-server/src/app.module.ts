import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesGuard } from './common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/EXAMPLE', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql-schema.ts'),
      },
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
