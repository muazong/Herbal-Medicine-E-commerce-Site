import {
  Res,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { Response } from 'express';

import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { Order } from './entities/order.entity';
import { RolesGuard } from '../../common/guards';
import { OrdersService } from './orders.service';
import { RequestUser } from '../../common/interfaces';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CurrentUser, Roles } from '../../common/decorators';

@Roles(Role.ADMIN)
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ======================GET============================
  @Get()
  @HttpCode(HttpStatus.OK)
  // Get all orders
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':orderId')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.CLIENT, Role.ADMIN)
  // Get order by id
  findOne(@Param('orderId') orderId: string) {
    return this.ordersService.findOne(orderId);
  }

  @Get('user/products')
  @Roles(Role.CLIENT, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  findUserProductsIsOrdered(
    @CurrentUser() user: RequestUser,
    @Query('orderBy') orderBy: keyof Order,
  ) {
    return this.ordersService.findUserProductsIsOrdered(user.id, orderBy);
  }

  // ======================POST============================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Create order
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ) {
    const order = await this.ordersService.create(createOrderDto, user.id);
    return res.location(`/orders/${order.id}`).json(order);
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN, Role.CLIENT)
  // Order products
  async orderProducts(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: RequestUser,
  ) {
    return await this.ordersService.orderProducts(createOrderDto, user.id);
  }

  // ======================PATCH============================
  @Patch()
  @Roles(Role.ADMIN, Role.CLIENT)
  update(
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.ordersService.update(updateOrderDto, user.id);
  }

  @Patch(':orderId/status')
  @Roles(Role.ADMIN, Role.CLIENT)
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderStatus(
      orderId,
      updateOrderDto.status!,
    );
  }

  // ======================DELETE============================
  @Delete(':orderId')
  remove(@Param('orderId') orderId: string) {
    return this.ordersService.remove(orderId);
  }
}
