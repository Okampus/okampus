import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Team } from '../teams/entities/team.entity';
import { User } from '../users/user.entity';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactAccount } from './entities/contact-account.entity';
import { Contact } from './entities/contact.entity';
import { TeamContactAccount } from './entities/team-contact-account.entity';
import { UserContactAccount } from './entities/user-contact-account.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Contact, ContactAccount, UserContactAccount, TeamContactAccount, User, Team]),
  ],
  controllers: [ContactsController],
  providers: [CaslAbilityFactory, ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
