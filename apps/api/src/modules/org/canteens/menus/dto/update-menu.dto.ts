import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from '@modules/org/canteens/menus/dto/create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
