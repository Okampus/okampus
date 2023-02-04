import { FinancesResolver } from './finances.resolver';
import { CreateFinanceHandler } from './commands/create-finance/create-finance.handler';
import { GetFinanceByIdHandler } from './queries/get-finance-by-id/get-finance-by-id.handler';
import { GetFinancesByTeamHandler } from './queries/get-finances-by-team/get-finances-by-team.handler';
import { DeleteFinanceHandler } from './commands/delete-finance/delete-finance.handler';
import { GetFinancesHandler } from './queries/get-finances/get-finances.handler';
import { UpdateFinanceHandler } from './commands/update-finance/update-finance.handler';
import { FinancesService } from './finances.service';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

const commandHandlers = [CreateFinanceHandler, UpdateFinanceHandler, DeleteFinanceHandler];
const queryHandlers = [GetFinanceByIdHandler, GetFinancesByTeamHandler, GetFinancesHandler];

@Module({
  imports: [CqrsModule],
  providers: [FinancesResolver, FinancesService, ...commandHandlers, ...queryHandlers],
  exports: [FinancesService],
})
export class FinancesModule {}
