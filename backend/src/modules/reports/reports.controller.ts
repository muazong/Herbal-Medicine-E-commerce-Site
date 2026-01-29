import {
  Get,
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../../common/decorators';
import { Role } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../common/guards';

@Controller('reports')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  getOverview() {
    return this.reportsService.getOverview();
  }

  @Get('monthly-sales')
  @HttpCode(HttpStatus.OK)
  getMonthlySales() {
    return this.reportsService.getMonthlySalesReport();
  }
}
