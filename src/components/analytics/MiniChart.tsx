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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const MiniBarChart = ({ data, color }: { data: number[]; color: string }) => {
  const chartData = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY'],
    datasets: [
      {
        data,
        backgroundColor: color,
        borderRadius: 4,
        barThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: true,
          color: '#94a3b8',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

const AnalyticsCards = () => {
  const cardData = [
    {
      title: 'Unexpected Downtime 2023',
      subtitle: '≤ 2% than Prediction',
      color: '#00AEEF',
      chartData: [2, 8, 6, 7, 3],
    },
    {
      title: 'Access Violation 2023',
      subtitle: '+ 4% than Prediction',
      color: '#66CC33',
      chartData: [6, 4, 8, 3, 2],
    },
    {
      title: 'Gas Exposures 2023',
      subtitle: '≤ 5% than Prediction',
      color: '#FF9933',
      chartData: [3, 2, 6, 5, 2],
    },
    {
      title: 'Leakages 2023',
      subtitle: '+ 1% than Prediction',
      color: '#FFC0CB',
      chartData: [4, 2, 3, 4, 1],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 bg-blue-50">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col "
        >
          <h3 className="text-sm font-semibold text-primary mb-1">
            {card.title}
          </h3>
          <p className="text-xs text-secondary mb-4">{card.subtitle}</p>
          <div className="w-full h-24">
            <MiniBarChart data={card.chartData} color={card.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
