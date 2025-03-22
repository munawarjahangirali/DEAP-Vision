'use client';
import Button from '@/components/common/Button';
import Table, { TableColumn } from '@/components/common/Table';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';

const SettingsPage = () => {
    const { push } = useRouter();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, isLoading } = useQuery({
        queryKey: ['settings', page, limit],
        queryFn: async () => {
            const response = await axiosInstance.get(`/settings`, {
                params: { page, limit }
            });
            return response.data;
        },
    });

    const handleReload = ({ page: newPage, limit: newLimit }: { page?: number; limit?: number }) => {
        if (newPage) setPage(newPage);
        if (newLimit) setLimit(newLimit);
    };

    const paginatedData = {
        docs: data?.data || [],
        page: data?.pagination?.page || 1,
        limit: data?.pagination?.limit || 10,
        totalDocs: data?.pagination?.total_count || 0,
        totalPages: data?.pagination?.total_pages || 1,
    };

    const columns: any = [
        {
            text: 'Priority',
            dataField: 'priority',
            width: '60px',
        },
        {
            text: 'Object Observation',
            dataField: 'objectObservation',
            width: '100px',
        },
        {
            text: 'Camera',
            dataField: 'camera',
            width: '100px',
        },
        {
            text: 'Primary Category',
            dataField: 'primaryCategory',
        },
        {
            text: 'Zone',
            dataField: 'zone',
            width: '80px',
        },
        {
            text: 'Secondary Category',
            dataField: 'secondaryCategory',
        },
        {
            text: 'Time From',
            dataField: 'timeFrom',
            width: '80px',
        },
        {
            text: 'Time Until',
            dataField: 'timeUntil',
            width: '80px'
        },
        {
            text: 'Event Threshold',
            dataField: 'eventThreshold',
            width: '80px',
        },
        {
            text: 'Solution',
            dataField: 'solution',
            width: '80px',
        },
    ];

    return (
        <div className="py-6">
            <div className="flex justify-between items-center mb-4">
                <Button 
                    variant="outline" 
                    className="flex items-center gap-2 text-sm"
                    onClick={() => push('/settings/create')}
                >
                    Create Setting
                </Button>   
            </div>
            <Table
                indexed
                columns={columns}
                data={paginatedData}
                loading={isLoading}
                noActions
                // noHeader={true}
                pagination={true}
                onReload={handleReload}
                onRowClick={(row:any) => push(`/settings/edit/${row?.id}`)}
                showExport
                exportFileName="settings_data"
            />
        </div>
    );
};

export default SettingsPage;