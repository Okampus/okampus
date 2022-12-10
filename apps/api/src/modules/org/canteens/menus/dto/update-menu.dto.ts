import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from '@canteens/menus/dto/create-menu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
