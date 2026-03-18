import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetsModule } from './modules/pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
