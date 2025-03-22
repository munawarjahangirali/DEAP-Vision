'use client'
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const ChartSkeleton = () => (
    <div className="animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4 md:mb-0"></div>
        </div>
        <div className="h-64 w-full bg-gray-50 rounded-lg flex items-end p-4 gap-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                    <div
                        className="bg-gray-200 rounded-t w-full animate-pulse"
                        style={{
                            height: `${Math.random() * 70 + 20}%`,
                            animationDelay: `${i * 100}ms`
                        }}
                    ></div>
                    <div className="h-4 w-full bg-gray-200 mt-2 rounded"></div>
                </div>
            ))}
        </div>
    </div>
);

const ChartComponent = ({ data, isLoading }: { data: any, isLoading: boolean }) => {
    const chartData = {
        labels: data?.map((item: any) => item.day) || [],
        datasets: [
            {
                label: 'Violations',
                data: data?.map((item: any) => item.count) || [],
                borderColor: '#ff6600',
                backgroundColor: (context: any) => {
                    const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(255, 99, 132, 0.5)');
                    gradient.addColorStop(1, 'rgba(54, 162, 235, 0.5)');
                    return gradient;
                },
                borderWidth: 2,
                fill: true,
                pointBackgroundColor: '#ff6600',
                pointBorderColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointRadius: 4,
                tension: 0.4, // Smooth curves
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: true,
            },
            legend: {
                display: false, // Hide the legend
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Violations',
                },
                beginAtZero: true,
                max: 70,
            },
        },
    };

    if (isLoading) {
        return (
            <div className="p-2 md:p-6 bg-white rounded-xl shadow-md">
                <ChartSkeleton />
            </div>
        );
    }

    return (
        <div className="p-2 md:p-6 bg-white rounded-xl shadow-md relative" style={{ zIndex: 0 }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-base font-semibold text-primary">VIOLATIONS LIST</h2>
                </div>
            </div>
            <div className="h-64 overflow-x-auto">
                <div className="relative h-full w-full overflow-x-auto">
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default ChartComponent;
