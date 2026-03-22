import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './modules/pets/pets.module';
import { ClientsModule } from './modules/clients/clients.module';

@Module({
  imports: [PetsModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
