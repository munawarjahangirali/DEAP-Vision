import React from 'react';
import Table, { TableColumn } from '@/components/common/Table';

interface ViolationHistoryTableProps {
    data: any[];
    isLoading: boolean;
}

const ViolationHistoryTable: React.FC<ViolationHistoryTableProps> = ({ data, isLoading }) => {
    const columns: TableColumn<any>[] = [
        {
            text: "Violation Type", dataField: "violationType",
            formatter: (_, row): string => {
                return row.violationType;
            },
            width: '60px',
        },
        {
            text: "Category", dataField: "categoryName",
            formatter: (_, row): string => {
                return row.categoryName || row.categoryId;
            },
            width: '60px',
        },
        {
            text: "Time", dataField: "time",
            formatter: (_, row): string => {
                return row.time;
            },
            // width: '100px',
        },
        {
            text: "Severity", dataField: "severity",
            formatter: (_, row): string => {
                return row.severity;
            },
            width: '110px',
        },
        {
            text: "Site", dataField: "siteName",
            formatter: (_, row): string => {
                return row.siteName || row.siteId;
            },
            width: '60px',
        },
        {
            text: "Zone", dataField: "zoneId",
            formatter: (_, row): string => {
                return row.zoneId;
            },
            width: '60px',
        },
        {
            text: "Status", dataField: "violationStatus", formatter: (value) =>
                value && (<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${value === "PENDING" ? "bg-yellow-50 text-yellow-700" :
                    "bg-green-50 text-green-700"
                }`}>
                {value}
                </span>),
            width: '110px',
        },
        {
            text: "Created At", dataField: "createdAt",
            formatter: (_, row): string => {
                return row.createdAt
            },
            // width: '60px',
        },
    ];

    return (
        <Table
            indexed
            columns={columns}
            data={data || []}
            noHeader
            noActions
            loading={isLoading}
            
        />
    );
};

export default ViolationHistoryTable;