import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Club } from '../clubs/entities/club.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { User } from '../users/user.entity';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ClubContactAccount } from './entities/club-contact-account.entity';
import { ContactAccount } from './entities/contact-account.entity';
import { Contact } from './entities/contact.entity';
import { UserContactAccount } from './entities/user-contact-account.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Contact, ContactAccount, UserContactAccount, ClubContactAccount, User, Club]),
  ],
  controllers: [ContactsController],
  providers: [CaslAbilityFactory, ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
