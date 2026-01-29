'use client';

import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTruck,
  FaUsers,
  FaMoneyBillWave,
} from 'react-icons/fa';

import StatCard from '@/components/stat-card/stat-card';
import { DashboardTitle } from '@/components/admin-page';
import {
  getReportOverview,
  getMonthlySalesReport,
} from '@/services/reports-service';
import { MonthlySalesReport } from '@/common/interfaces/monthly-report';
import { ReportOverview } from '@/common/interfaces/report-overview';
import styles from './page.module.css';

const DashboardPage = () => {
  const [overview, setOverview] = useState<ReportOverview | null>(null);
  const [monthlySales, setMonthlySales] = useState<MonthlySalesReport | null>(
    null,
  );

  useEffect(() => {
    getReportOverview().then(setOverview);
    getMonthlySalesReport().then(setMonthlySales);
  }, []);

  if (!overview || !monthlySales) {
    return <div>Loading dashboard...</div>;
  }

  const chartData = [
    { name: 'Đã bán', value: overview.soldProducts },
    { name: 'Đã huỷ', value: overview.cancelledProducts },
    { name: 'Đang giao', value: overview.shippingProducts },
  ];

  return (
    <div className={styles.dashboard}>
      <DashboardTitle title="Tổng quan" />

      {/* SUMMARY CARDS */}
      <div className={styles.cards}>
        <StatCard
          title="Sản phẩm đã bán"
          value={overview.soldProducts}
          icon={<FaCheckCircle color="#22c55e" size={22} />}
        />
        <StatCard
          title="Sản phẩm đã huỷ"
          value={overview.cancelledProducts}
          icon={<FaTimesCircle color="#ef4444" size={22} />}
        />
        <StatCard
          title="Đang giao"
          value={overview.shippingProducts}
          icon={<FaTruck color="#3b82f6" size={22} />}
        />
        <StatCard
          title="Người dùng"
          value={overview.totalUsers}
          icon={<FaUsers color="#a855f7" size={22} />}
        />
        <StatCard
          title={`Doanh thu T${monthlySales.month}/${monthlySales.year}`}
          value={monthlySales.revenue}
          icon={<FaMoneyBillWave color="#d4af37" size={22} />}
          suffix="₫"
        />
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#ffffff"
              tick={{ fill: '#ffffff', fontSize: 14 }}
            />
            <YAxis stroke="#ffffff" tick={{ fill: '#ffffff', fontSize: 14 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2a44',
                borderRadius: 8,
                border: 'none',
                color: '#fff',
              }}
              cursor={{ fill: 'rgba(255,255,255,0.08)' }}
            />
            <Bar
              dataKey="value"
              fill="var(--accent-color)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
