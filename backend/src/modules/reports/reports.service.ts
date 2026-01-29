import { Injectable } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { OrderStatus } from '../../common/enums';

@Injectable()
export class ReportsService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
  ) {}

  async getOverview() {
    const [soldProducts, cancelledProducts, shippingProducts, totalUsers] =
      await Promise.all([
        this.ordersService.countProductsByStatus(OrderStatus.DELIVERED),
        this.ordersService.countProductsByStatus(OrderStatus.CANCELLED),
        this.ordersService.countProductsByStatus(OrderStatus.SHIPPING),

        this.usersService.countActiveUsers(),
      ]);

    return {
      soldProducts,
      cancelledProducts,
      shippingProducts,
      totalUsers,
    };
  }

  async getMonthlySalesReport() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const revenue = await this.ordersService.getMonthlyRevenue(year, month);

    return {
      year,
      month,
      revenue,
    };
  }
}
