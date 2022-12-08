import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { FileUploadsModule } from '@modules/upload/file-uploads/file-uploads.module';
import { User } from '../users/user.entity';
import { UserImage } from './user-image.entity';
import { UserImagesController } from './user-images.controller';
import { UserImagesService } from './user-images.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserImage, User]),
    FileUploadsModule,
  ],
  controllers: [UserImagesController],
  providers: [CaslAbilityFactory, UserImagesService],
  exports: [UserImagesService],
})
export class UserImagesModule {}