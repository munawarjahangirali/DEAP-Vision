'use client';
import React, { useState } from "react";
import Table, { TableColumn } from "@/components/common/Table";
// import DashboardWidget from "@/components/report/ReportWidget";
import Dialog from "@/components/common/Dialog";
import Tabs from "@/components/common/Tabs";
import TimeRangeSelector from "@/components/report/TimeRange";
import Button from "@/components/common/Button";
import ProductSelector from "@/components/report/ProductSelector";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchViolations } from "@/services/api";
import ViolationDetailsForm from "@/components/report/ViolationDetailsForm";
import ViolationHistoryTable from '@/components/report/ViolationHistoryTable';
import axios from 'axios';
import MediaRenderer from "@/components/common/MediaRenderer";
import { useCommon } from "@/context/CommonContext";
import axiosInstance from "@/services/axios";

interface ReportData {
  id: number;
  masterDataId: string;
  summary: string;
  violationType?: string;
  categoryName?: string;
  time: string;
  imageFile?: string;
  videoFile?: string;
  severity?: string;
  siteName?: string;
  zoneName?: string;
  violationStatus?: string;
  _id?: string;
  disableEdit?: number;
  disableDelete?: number;
  assignedTo?: string;
  comment?: string;
}

// const fetchChartData = async (filters: any) => {
//   const response = await axiosInstance.get('/violations/count', {
//     params: {
//       start_time: filters.startDate,
//       end_time: filters.endDate,
//       zones: filters.zones,
//       sites: filters.sites,
//       violation_type: filters.types,
//       activities: filters.activities,
//     },
//   });
//   return response?.data;
// };

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedData, setSelectedData] = useState<ReportData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    sites: [] as string[],
    zones: [] as string[],
    types: [] as string[],
    activities: [] as string[],
    startDate: '',
    endDate: '',
    shift: '', 
  });

  const [formSubmit, setFormSubmit] = useState<(() => void) | null>(null);

  const { data: violationsData, isLoading: isViolationsLoading, error: violationsError } = useQuery({
    queryKey: ['violations', page, limit, filters],
    queryFn: () => fetchViolations(page, limit, filters),
  });
  console.log("🚀 ~ violationsData:", violationsData)

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['violationHistory', selectedData?.id],
    queryFn: async () => {
      if (!selectedData?.id) return null;
      const response = await axios.get(`/api/history`, {
        params: {
          type: 'violation',
          type_id: selectedData.id
        }
      });
      return response.data;
    },
    enabled: !!selectedData?.id,
  });  const handleRowClick = async (user: ReportData) => {
    setSelectedData(user);
    setIsDialogOpen(true);
    
    try {
      await axiosInstance.patch(`/violations?id=${user.id}`, {
        reviewedAt: new Date().toISOString()
      });
      // Invalidate and refetch queries to update the table
      await queryClient.invalidateQueries({ queryKey: ['violations'] });
    } catch (error) {
      console.error('Error updating review timestamp:', error);
    }
  };

  const handleReload = ({ page: newPage, limit: newLimit, search: newSearch }: { page?: number; limit?: number; search?: string }) => {
    if (newPage) setPage(newPage);
    if (newLimit) setLimit(newLimit);
  };

  const handleFilterSubmit = (submitFn: () => void) => {
    setFormSubmit(() => submitFn);
  };

  const handleSearch = () => {
    if (formSubmit) {
      formSubmit();
    }
  };

  const paginatedData = {
    docs: violationsData?.data || [],
    page: violationsData?.pagination?.page || 1,
    limit: violationsData?.pagination?.limit || 10,
    totalDocs: violationsData?.pagination?.total_count || 0,
    totalPages: violationsData?.pagination?.total_pages || 1,
  };

  const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
  const violationColumns: TableColumn<any>[] = [
    { 
      text: "Reviewed At", 
      dataField: "reviewedAt", 
      width: '150px',
      formatter: (value) => {
        if (!value) return "Not reviewed";
        return new Date(value).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
      }
    },
    { text: "AI Violation ID", dataField: "masterDataId", width: '100px' },
    { text: "Violation Type", dataField: "violationType" },
    {
      text: "Category",
      dataField: "categoryName",
      formatter: (value) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${value === "Accident" ? "bg-red-50 text-red-700" :
          value === "Miss" ? "bg-yellow-50 text-yellow-700" :
            value === "Hazardous" ? "bg-orange-50 text-orange-700" :
              value === "Observation" ? "bg-blue-50 text-blue-700" :
                "bg-gray-50 text-gray-700"
          }`}>
          {value}
        </span>
      )
    },
    {
      text: "Activity",
      dataField: "activity",
      formatter: (value) => value || 'Drilling'
    },
    {
      text: "Time", dataField: "time", formatter: (cell) => {
        if (!cell) return "";
        return new Date(cell).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
      }
    },    {
      text: "Snapshot",
      dataField: "imageFile",
      width: '150px',
      formatter: (value, row) => (
        <MediaRenderer 
          imageFile={row.imageFile}
          videoFile={row.videoFile}
          style={{ width: '120px', height: 'auto', borderRadius: '8px', overflow: 'hidden' }}
          cdnUrl={NEXT_PUBLIC_CDN_URL}
        />
      ),
    },
    {
      text: "Severity",
      dataField: "severity",
      formatter: (value) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${value === "CRITICAL" ? "bg-red-50 text-red-700" :
          value === "MODERATE" ? "bg-yellow-50 text-yellow-700" :
            "bg-green-50 text-green-700"
          }`}>
          {value?.toLowerCase()}
        </span>
      )
    },
    { text: "Site", dataField: "siteName" },
    { text: "Zone", dataField: "zoneName", formatter: (value) => value || 'Drilling Floor' },
    {
      text: "Status", dataField: "violationStatus", formatter: (value) =>
        value && (<span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${value === "PENDING" ? "bg-yellow-50 text-yellow-700" :
          "bg-green-50 text-green-700"
          }`}>
          {value.toLowerCase()}
        </span>)
    },
  ];

  const { sites, zones } = useCommon();

  const siteOptions = sites.map((site: any) => ({ value: site.id, label: site.name }));
  const zoneOptions = zones.map((zone: any) => ({ value: zone.id, label: zone.name }));


  return (
    <div className=" mx-auto">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <TimeRangeSelector setFilters={setFilters} />
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <ProductSelector
              onSubmit={handleFilterSubmit}
              setFilters={setFilters}
              setPage={setPage}
            />
          </div>
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-1 order-last md:order-none">
          <div className="flex h-full items-center justify-center w-full">
            <Button onClick={handleSearch} size="sm" variant="primary" className="w-full">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-5">
        <Table
          columns={violationColumns}
          data={paginatedData}
          noActions
          pagination
          title="Report"
          onReload={handleReload}
          loading={isViolationsLoading}
          onRowClick={(row: any) => handleRowClick(row)}
          showExport
          exportFileName="report_data"
          filters={filters}
          siteOptions={siteOptions}
          zoneOptions={zoneOptions}
        />
      </div>

      {/* User Details Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={String(selectedData?.masterDataId) || ''}
      >
        {selectedData && (
          <Tabs
            items={[
              {
                key: 'details',
                title: 'Details',
                content: <ViolationDetailsForm
                  data={selectedData}
                  setIsDialogOpen={setIsDialogOpen}
                />
              },
              {
                key: 'history',
                title: 'History',
                content: <ViolationHistoryTable
                  data={historyData?.data || []}
                  isLoading={isHistoryLoading}
                />
              }
            ]}
          />
        )}
      </Dialog>
    </div>
  );
};

export default DashboardPage;