import { SetMetadata } from '@nestjs/common';
import { METADATA_KEY } from '../constants/metadata.constant';

export const Public = () => SetMetadata(METADATA_KEY.IS_PUBLIC, true);