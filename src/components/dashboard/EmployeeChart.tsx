import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';
import { ChartOptions } from 'chart.js';

interface EmployeeData {
    label: string;
    value: number;
    color: string;
}

const colors = ['#f9063b', '#36A2EB', '#fffb0c', '#06f9f9', '#C20094'];

export const getCategoryStats = async (board_id?: string) => {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    const params: any = { date: process.env.NODE_ENV === 'development' ? '2024-10-24' : date.toISOString().split('T')[0] };
    if (board_id) params.board_id = board_id;

    const { data } = await axiosInstance.get('/dashboard/categories', { params });
    return Object.entries(data.data).map(([label, value], index) => ({
        label,
        value: value as number,
        color: colors[index % colors.length],
    }));
};

const ChartSkeleton = () => (
    <div className="animate-pulse bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Circular loader for doughnut */}
            <div className="relative w-48 h-48 mx-auto md:mx-0">
                <div className="absolute inset-0 rounded-full bg-gray-200"></div>
                <div className="absolute inset-[15%] rounded-full bg-white"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Legend loader */}
            <div className="flex-1 md:ml-8">
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-b-[#F0F2F4] py-1 last:border-b-0">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const EmployeeChart = ({ board_id }: { board_id?: string }) => {
    const { data: employeeData, isLoading, error } = useQuery<EmployeeData[]>({
        queryKey: ['employeeData', board_id],
        queryFn: () => getCategoryStats(board_id),
    });

    if(isLoading) return <ChartSkeleton />;

    const total = employeeData?.reduce((acc, item) => acc + item.value, 0) || 0;

    const chartData = {
        labels: employeeData?.map((item) => item.label) || [],
        datasets: [
            {
                data: employeeData?.map((item) => item.value) || [],
                backgroundColor: employeeData?.map((item) => item.color) || [],
                borderColor: employeeData?.map((item) => item.color) || [],
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
                    weight: 'bold',
                },
                bodyFont: {
                    size: 13,
                },
                titleColor: 'white',
                bodyColor: 'white',
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw as number;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 3,
                borderColor: '#ffffff',
                spacing: 3,
            },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="relative w-48 h-48 mx-auto md:mx-0">
                    <Doughnut data={chartData} options={options} />
                    <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                        <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                            <CountUp end={total} duration={2} />
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">Violations</p>
                    </div>
                </div>
                <div className="flex-1 md:ml-8">
                    <div className="space-y-3">
                        {chartData.labels.map((label, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center border-b border-b-[#F0F2F4] py-1 last:border-b-0"
                            >
                                <span
                                    style={{ color: chartData.datasets[0].backgroundColor[index] }}
                                    className="text-xs font-semibold"
                                >
                                    {label}
                                </span>
                                <span className="text-xs text-secondary">
                                    <CountUp end={chartData.datasets[0].data[index] as number} duration={2} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeChart;