// DashboardWidget.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import CountUp from 'react-countup';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardWidgetProps {
  accidentCount: number;
  missCount: number;
  hazardousCount: number;
  observationCount: number;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  accidentCount,
  missCount,
  hazardousCount,
  observationCount,
}) => {
  const total = accidentCount + missCount + hazardousCount + observationCount;

  const data = {
    labels: ['Accident', 'Near Miss', 'Hazardous', 'Observation'],
    datasets: [
      {
        data: [accidentCount, missCount, hazardousCount, observationCount],
        backgroundColor: ['#CC0000', '#CC7B00', '#C2AB00', '#00D7AF'],
        borderColor: ['#CC0000', '#CC7B00', '#C2AB00', '#00D7AF'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '95%',
    radius: '80%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 3,
        borderColor: '#ffffff',
        spacing: 3,
      }
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 ">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl bg-white shadow-lg h-fit">
            <h2 className="text-[#CC0000] font-semibold text-sm sm:text-base">ACCIDENT</h2>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              <CountUp end={accidentCount} duration={2} />
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white h-fit shadow-lg">
            <h2 className="text-[#CC7B00] font-semibold text-sm sm:text-base">NEAR MISS</h2>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              <CountUp end={missCount} duration={2} />
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white  h-fit shadow-lg">
            <h2 className="text-[#C2AB00] font-semibold text-sm sm:text-base">HAZARDOUS</h2>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              <CountUp end={hazardousCount} duration={2} />
            </p>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white h-fit shadow-lg">
            <h2 className="text-[#00D7AF] font-semibold text-sm sm:text-base">OBSERVATION</h2>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">
              <CountUp end={observationCount} duration={2} />
            </p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-2/3 md:w-2/5 max-w-[500px] bg-white rounded-xl shadow-lg h-52 flex justify-center items-center">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              <CountUp end={total} duration={2} />
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Total Alarms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidget;
