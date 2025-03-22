'use client'
import { Bar } from 'react-chartjs-2';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';

// import dynamic from 'next/dynamic';

// const Map = dynamic(() => import('@/components/common/Map'), {
//     ssr: false
// });


import dynamic from 'next/dynamic';

let Map;

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Map = require('@/components/common/Map').default;
} else {
  // In production mode, dynamically import the component
  Map = dynamic(() => import('@/components/common/Map'), { ssr: false });
}

// import Map from '@/components/common/Map';


// Add color mapping utility
const getColorByIndex = (index: number) => {
    const colors = [
        '#36A2EB', '#C20094', '#06f9f9', '#f9063b', '#f59e0b', '#84cc16'
    ];
    return colors[index % colors.length];
};

const fetchViolationsData = async (type: string, duration: string, board_id?: string) => {
    const params: any = {};
    if (board_id) params.board_id = board_id;

    const endpoint = type === 'severity' 
        ? `/dashboard/violations-list/severity-based?duration=${duration}${board_id ? `&board_id=${board_id}` : ''}`
        : `/dashboard/violations-list/action-taken?duration=${duration}${board_id ? `&board_id=${board_id}` : ''}`;
    const {data} = await axiosInstance.get(endpoint);
    return data;
};

const ChartSkeleton = () => (
    <div className="animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4 md:mb-0"></div>
            <div className="flex gap-2">
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
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

const ViolationsChart = ({
    board_id
}: {
    board_id?: string;
}) => {
    const [chartType, setChartType] = useState('site');
    const [duration, setDuration] = useState('yearly');

    const { data: violationsData, isLoading } = useQuery({
        queryKey: ['violations', chartType, duration, board_id],
        queryFn: () => fetchViolationsData(chartType, duration, board_id),
    });

    const transformDataToChartFormat = (data: any[]) => {
        if (!data) return { labels: [], datasets: [] };

        if (chartType === 'severity') {
            // Existing severity-based transformation
            const categories = Array.from(new Set(data.map(item => 
                item.severity || 'Unspecified'
            )));

            return {
                labels: categories,
                datasets: [{
                    data: categories.map(category => 
                        data.find(item => 
                            (item.severity || 'Unspecified') === category
                        )?.total || 0
                    ),
                    backgroundColor: categories.map((_, index) => getColorByIndex(index)),
                    barThickness: 20,
                    maxBarThickness: 50,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                }]
            };
        } else {
            // Action taken transformation
            const labels = Array.from(new Set(data.map(item =>
                item.status || 'Unspecified'
            )));
            return {
                labels: labels,
                datasets: [{
                    data: labels.map(label =>
                        data.find(item =>
                            (item.status || 'Unspecified') === label
                        )?.count || 0  // Changed from total to count
                    ),
                    backgroundColor: labels.map((_, index) => getColorByIndex(index)),
                    barThickness: 20,
                    maxBarThickness: 50,
                    categoryPercentage: 0.8,
                    barPercentage: 0.9
                }]
            };
        }
    };

    const chartData = transformDataToChartFormat(violationsData);

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
                <div className="flex flex-wrap gap-2">
                    <select 
                        className="min-w-[140px] px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg 
                        text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:border-teal-500 transition-colors duration-200"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        <option value="site">Site Based</option>
                        <option value="severity">Severity Based</option>
                        <option value="action">Action Taken</option>
                    </select>
                    {chartType !== 'site' && (
                        <select 
                            className="min-w-[140px] px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg 
                            text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none  focus:border-teal-500 transition-colors duration-200"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    )}
                </div>
            </div>
            {chartType === 'site' ? (
                <div className="h-64"> 
                    {
                        process.env.NODE_ENV === 'production' && <Map />
                    }
                </div>
            ) : (
                <div className="h-64 overflow-x-auto">
                    <div className="relative h-full w-full overflow-x-auto">
                        <Bar 
                            data={chartData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: {
                                            color: '#f0f0f0'
                                        }
                                    },
                                    x: {
                                        grid: {
                                            display: false
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    tooltip: {
                                        enabled: true,
                                    },
                                    // datalabels: {
                                    //     anchor: 'end',
                                    //     align: 'top',
                                    //     formatter: (value) => value,
                                    //     font: {
                                    //         weight: 'bold',
                                    //         size: 11
                                    //     }
                                    // }
                                },
                                
                            }} 
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViolationsChart;