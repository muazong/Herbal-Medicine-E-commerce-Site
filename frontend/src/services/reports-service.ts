import { ReportOverview } from '@/common/interfaces/report-overview';
import { apiWithAuth } from './axios-instance-client';
import { MonthlySalesReport } from '@/common/interfaces/monthly-report';

export const getReportOverview = async (): Promise<ReportOverview> => {
  const res = await apiWithAuth.get('/reports/overview');
  return res.data;
};

export const getMonthlySalesReport = async (): Promise<MonthlySalesReport> => {
  const res = await apiWithAuth.get('/reports/monthly-sales');
  return res.data;
};
