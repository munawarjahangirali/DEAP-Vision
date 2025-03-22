'use client';
import React, { useState, useEffect } from 'react';
import Dialog from '@/components/common/Dialog';
import Table, { TableColumn } from '@/components/common/Table';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axios';
import MasterDetailsForm from './MasterDetailsForm';
import { useCommon } from '@/context/CommonContext';
import SearchInput from '@/components/common/Search';
import ImageRenderer from '../common/ImageRenderer';

interface DashboardData {
    id: number;
    dataId: string;
    violation_id: string;
    mediaName: string;
    image?: string;
    videoFile?: string;
    mediaUrl?: string;
    summary: string;
    taskSession: string;
    time: string;
    alarmType: string;
    type: string;
    status: string;
    region: string;
    regType: string;
    description: string;
    boardIp: string;
    violationType?: string;
    activity?: string;
    siteId?: string;
    zoneId?: string;
    categoryId?: string;
    severity?: string;
    assignedTo?: string;
    violationsStatus?: string;
    comment?: string;
    _id?: string;
    disableEdit?: number;
    disableDelete?: number;
}

const fetchMasterData = async (page: number, limit: number, search: string, boardId?: string) => {
    const params: any = { page, limit, search };
    if (boardId) params.board_id = boardId;

    const { data } = await axiosInstance.get(`/master-data`, { params });
    return data;
};

interface props {
    title?: string;
    boardId?: string;
}

const DashboardTable = (
    { title, boardId }: props
) => {
    const { categories, types, sites, zones, isLoading: commonLoading } = useCommon();
    const [selectedData, setSelectedData] = useState<DashboardData | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['masterData', page, limit, search, boardId],
        queryFn: () => fetchMasterData(page, limit, search, boardId)
    });

    const handleUserClick = (user: DashboardData) => {
        setSelectedData(user);
        setIsDialogOpen(true);
    };

    const handleReload = ({ page: newPage, limit: newLimit, search: newSearch }: { page?: number; limit?: number; search?: string }) => {
        if (newPage) setPage(newPage);
        if (newLimit) setLimit(newLimit);
        if (newSearch !== undefined) setSearch(newSearch);
    };

    const paginatedData = {
        docs: data?.data || [],
        page: data?.pagination?.page || 1,
        limit: data?.pagination?.limit || 10,
        totalDocs: data?.pagination?.total_count || 0,
        totalPages: data?.pagination?.total_pages || 1,
    };

    const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

    const columns: TableColumn<DashboardData>[] = [
        {
            text: "AI Violation ID",
            dataField: "id",
            width: '80px'
        },
        {
            text: "Data ID",
            dataField: "dataId",
            width: '60px',
        },
        {
            text: "AI Violation Type",
            dataField: "summary",
            width: '60px',
            formatter: (value) => (
                value === "CurrentPeopleNum" ? "Line of Fire" : value
            ),
        },
        {
            text: "Ai Algorithm",
            dataField: "taskSession",
            width: '60px',
        },
        {
            text: "Activity",
            dataField: "activity",
            width: '60px',
            formatter: (value) => value || 'Drilling'
        },
        {
            text: "Zone",
            dataField: "activity",
            width: '60px',
            formatter: (value) => value || 'Drilling Floor'
        },
        {
            text: "Time",
            dataField: "time",
            width: '120px',
        },
        {
            text: "Snapshot",
            dataField: "image",
            width: '150px',
            formatter: (value) => (
                <ImageRenderer src={`${NEXT_PUBLIC_CDN_URL}${value}`} style={{ width: '150px', height: 'auto' }} />
            ),
        },
        // {
        //     text: "Alarm Type",
        //     dataField: "alarmType",
        //     width: '60px',
        // },
        // {
        //     text: "Type",
        //     dataField: "type",
        //     width: '60px',
        // },
        // {
        //     text: "Status",
        //     dataField: "status",
        //     width: '60px',
        // },
        // {
        //     text: "Region",
        //     dataField: "region",
        //     width: '60px',
        // },
        // {
        //     text: "Reg Type",
        //     dataField: "regType",
        //     width: '60px',
        // },
        // {
        //     text: "Description",
        //     dataField: "description",
        //     width: '200px'
        // },
    ];

    return (
        <>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden table-to-print">
                <Table<DashboardData>
                    columns={columns}
                    data={paginatedData || []}
                    title={title || "AI Violations"}
                    noActions
                    pagination
                    onReload={handleReload}
                    loading={isLoading}
                    onRowClick={(row: any) => handleUserClick(row)}
                    showExport
                    exportFileName="live_incident_data"
                />
            </div>

            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={String(selectedData?.id) || ''}
            >
                {selectedData && (
                    <MasterDetailsForm
                        master={selectedData}
                        categories={categories.map((category: any) => ({ id: category.id, name: category.name }))}
                        // types={types.map((type: any) => ({ type: type.type}))} 
                        setIsDialogOpen={setIsDialogOpen}
                        zones={zones.map((zone: any) => ({ id: zone.id, name: zone.name }))}
                        sites={sites.map((site: any) => ({ id: site.id, name: site.name }))}
                    />
                )}
            </Dialog>
        </>
    );
};

export default DashboardTable;