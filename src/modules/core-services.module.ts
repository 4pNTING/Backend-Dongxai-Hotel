import { Module, Global } from '@nestjs/common';
import { QueryBuilderService } from '../infrastructure//services/query-builder.service';

@Global()
@Module({
  providers: [QueryBuilderService],
  exports: [QueryBuilderService],
})
export class CoreServicesModule {}