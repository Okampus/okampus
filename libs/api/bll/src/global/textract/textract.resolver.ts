import { TextractService } from './textract.service';
import { Args, Query, Resolver } from '@nestjs/graphql';

import type { ProcessedReceipt } from '@okampus/shared/types';

@Resolver()
export class TextractResolver {
  constructor(private readonly textractService: TextractService) {}

  @Query()
  public async processReceipt(@Args('key') key: string): Promise<ProcessedReceipt | null> {
    return await this.textractService.processReceipt(key);
  }
}
