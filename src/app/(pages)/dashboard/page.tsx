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

const DashboardPage = () => {
  // const violationsData = {
  //   labels: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Today'],
  //   datasets: [
  //     {
  //       label: 'Site 1',
  //       data: [5, 15, 12, 10, 8, 18, 18],
  //       borderColor: '#8cec0e',
  //       backgroundColor: 'rgba(0, 73, 144, 0.1)',
  //       tension: 0.4,
  //     },
  //     {
  //       label: 'Site 2',
  //       data: [10, 12, 6, 22, 18, 14, 15],
  //       borderColor: '#C20094',
  //       backgroundColor: 'rgba(30, 170, 229, 0.1)',
  //       tension: 0.4,
  //     },
  //     {
  //       label: 'Site 3',
  //       data: [10, 18, 15, 12, 10, 22, 8],
  //       borderColor: '#21D4FD',
  //       backgroundColor: 'rgba(15, 122, 188, 0.1)',
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  //   scales: {
  //     x: {
  //       grid: {
  //         display: false,
  //       },
  //       border: {
  //         display: true,
  //         color: '#344767',
  //       },
  //     },
  //     y: {
  //       grid: {
  //         display: false,
  //       },
  //       border: {
  //         display: true,
  //         color: '#344767',
  //       },
  //       ticks: {
  //         display: true,
  //       },
  //     },
  //   },
  // };


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
        max: 1000,
        ticks: {
          stepSize: 100,
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

  return (
    <div className="mx-auto ">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 gap-6 grid">
          <ViolationsChart />
          <div className='p-6 bg-white rounded-xl shadow-md'>
            <div>
              <h2 className="text-base font-semibold text-primary">OVERALL SEVERITY</h2>
            </div>
            <PyramidChart />
          </div>
        </div>
        <div className="space-y-6 xl:col-span-5">
          <EmployeeChart  />
          <ActionTakenChart options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;