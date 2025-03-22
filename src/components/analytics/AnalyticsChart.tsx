
'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = () => {
  const data = {
    labels: ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'],
    datasets: [
      {
        label: 'Unexpected Downtime',
        data: [60, 80, 100, 120, 110, 100, 90, 70, 50, 30],
        backgroundColor: '#00AEEF',
        borderRadius: 4,
        barThickness: 15,
      },
      {
        label: 'Access Violation',
        data: [20, 30, 40, 50, 45, 40, 35, 25, 20, 15],
        backgroundColor: '#66CC33',
        borderRadius: 4,
        barThickness: 15,
      },
      {
        label: 'Safe Distance',
        data: [10, 15, 20, 25, 22, 20, 18, 12, 10, 5],
        backgroundColor: '#FFFF66',
        borderRadius: 4,
        barThickness: 15,
      },
      {
        label: 'Gas Exposures',
        data: [8, 12, 15, 18, 16, 15, 12, 8, 6, 3],
        backgroundColor: '#FF9933',
        borderRadius: 4,
        barThickness: 15,
      },
      {
        label: 'Leakages',
        data: [5, 10, 12, 15, 14, 12, 10, 7, 5, 2],
        backgroundColor: '#FFC0CB',
        borderRadius: 4,
        barThickness: 15,
      },
      {
        label: 'Environmental Protection',
        data: [2, 5, 8, 10, 9, 8, 6, 4, 3, 1],
        backgroundColor: '#CC0000',
        borderRadius: 4,
        barThickness: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        },
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      },
      y: {
        stacked: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default AnalyticsChart;