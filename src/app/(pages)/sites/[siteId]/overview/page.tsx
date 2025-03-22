'use client';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions
} from 'chart.js';
import ViolationsChart from '@/components/dashboard/ViolationsChart';
import EmployeeChart from '@/components/dashboard/EmployeeChart';
import ActionTakenChart from '@/components/dashboard/ActionTakenChart';
import PyramidChart from '@/components/dashboard/Pyramid';
import { useCommon, Site } from '@/context/CommonContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const OverviewPage = ({ params }: { params: any }) => {

  const siteId = Number(params.siteId);
  const { sites } = useCommon();

  const site = sites?.find((site: Site) => +site.id === siteId);
  const boardId = site?.boardID || '';

  const barChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        min: 0,
        max: 20,
        ticks: {
          stepSize: 5,
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  if(!boardId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative">
        No data available.
      </div>
    );
  }

  return (
    <div className="mx-auto ">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 gap-6 grid">
          <ViolationsChart board_id={boardId} />
          <div className='p-6 bg-white rounded-xl shadow-md'>
            <div>
              <h2 className="text-base font-semibold text-primary">OVERALL SEVERITY</h2>
            </div>
            <PyramidChart board_id={boardId} />
          </div>
        </div>
        <div className="space-y-6 xl:col-span-5">
          <EmployeeChart board_id={boardId} />
          <ActionTakenChart options={barChartOptions} board_id={boardId} />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;