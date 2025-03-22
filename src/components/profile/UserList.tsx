import { useQuery } from '@tanstack/react-query';
import Table from '@/components/common/Table';
import { useState } from 'react';
import axiosInstance from '@/services/axios';


const columns: any = [
    {
        text: 'ID',
        dataField: 'id',
    },
    {
        text: 'Username',
        dataField: 'username',
    },
    {
        text: 'Email',
        dataField: 'email',
    },
    {
        text: 'Role',
        dataField: 'role',
    },
    {
        text: 'Client',
        dataField: 'clientName',
    },
];

export default function UserList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { data, error, isLoading } = useQuery({
        queryKey: ['userList', page, limit],
        queryFn: async () => {
            const response = await axiosInstance.get(`/users/list`, {
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
        limit: data?.pagination?.limit || 5,
        totalDocs: data?.pagination?.total_count || 0,
        totalPages: data?.pagination?.total_pages || 1,
    };

    return (
        <Table
            loading={isLoading}
            noHeader
            indexed={false}
            columns={columns}
            data={paginatedData}
            pagination={true}
            onReload={handleReload}
            noActions
        />
    );
}
