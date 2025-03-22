import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';

const ChartSkeleton = () => (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
        <div className="h-64 w-full bg-gray-50 rounded-lg flex items-end p-4 gap-8">
            {[...Array(2)].map((_, i) => (
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

interface ActionTakenChartProps {
    options: any;
    board_id?: string;
}

interface ActionTakenData {
    status: string;
    count: number;
}

export const getActionTakenStats = async (board_id?: string) => {
    const params: any = {};
    if (board_id) params.board_id = board_id;

    const response = await axiosInstance.get('/dashboard/action-taken', {params});
    return response.data;
};

const ActionTakenChart = ({ options, board_id }: ActionTakenChartProps) => {
    const { data: actionData, isLoading } = useQuery({
        queryKey: ['actionTakenStats', board_id],
        queryFn: () => getActionTakenStats(board_id),
    });

    if (isLoading) {
        return <ChartSkeleton />;
    }

    const getStatusLabel = (status: boolean) => status;

    const data = {
        labels: actionData?.data?.map((item: any) => getStatusLabel(item.status)) ?? [],
        datasets: [
            {
                data: actionData?.data?.map((item: any) => item.count) ?? [],
                backgroundColor: [
                    '#f59e0b',
                    '#84cc16',
                ],
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    const maxDataValue = Math.max(...data.datasets[0].data);
    const roundedMaxValue = Math.ceil(maxDataValue / 1000) * 1000;

    const dynamicOptions = {
        ...options,
        scales: {
            ...options.scales,
            x: {
                ...options.scales.x,
                max: roundedMaxValue,
                ticks: {
                    ...options.scales.x.ticks,
                    stepSize: Math.ceil(roundedMaxValue / 10),
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-base font-semibold text-primary">ACTION TAKEN</h2>
            <div className="">
                <Bar data={data} options={dynamicOptions} />
            </div>
        </div>
    );
};

export default ActionTakenChart;