import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Team } from '../teams/teams/team.entity';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contact } from './entities/contact.entity';
import { TeamContactAccount } from './entities/team-contact-account.entity';
import { UserContactAccount } from './entities/user-contact-account.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Contact, UserContactAccount, TeamContactAccount, Team]),
  ],
  controllers: [ContactsController],
  providers: [CaslAbilityFactory, ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
