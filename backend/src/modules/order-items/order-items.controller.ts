import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  UseGuards,
} from '@nestjs/common';

import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Roles(Role.ADMIN)
@Controller('order-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }
}
