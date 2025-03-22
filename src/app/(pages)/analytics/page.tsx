'use client';
import React from 'react';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import AnalyticsCards from '@/components/analytics/MiniChart';

const AnalyticsPage = () => {
  return (
    <div className="mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6">
        <AnalyticsChart />
      </div>

      <hr className="my-10" />

      <AnalyticsCards />
    </div>
  );
};

export default AnalyticsPage;
