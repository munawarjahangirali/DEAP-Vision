'use client';
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Printer, FileSpreadsheet, Download } from "lucide-react";
import { Loader } from "./Loader";
import { exportToPDF, exportToExcel } from '@/lib/utils';

export interface TableColumn<T> {
  text: string;
  dataField: keyof T;
  className?: string;
  width?: string;
  formatter?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
}

interface PaginatedData<T> {
  docs: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[] | PaginatedData<T>;
  indexed?: boolean;
  loading?: boolean;
  noActions?: boolean;
  actions?: (row: T) => React.ReactNode;
  action?: React.ReactNode;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onReload?: (params: { page?: number; limit?: number; search?: string }) => void;
  pagination?: boolean;
  shadow?: boolean;
  title?: string | React.ReactNode;
  noHeader?: boolean;
  containerClassName?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  showExport?: boolean;
  exportFileName?: string;
  filters?: any;
  siteOptions?: { value: string, label: string }[];
  zoneOptions?: { value: string, label: string }[];
}

const LIMIT_OPTIONS = [10, 20, 50, 100];

const Table = <T extends { _id?: string; disableEdit?: number; disableDelete?: number }>({
  columns,
  data,
  indexed,
  loading = false,
  noActions,
  actions,
  action,
  onView,
  onEdit,
  onDelete,
  onReload,
  pagination = false,
  shadow = true,
  title,
  noHeader = false,
  containerClassName,
  onRowClick,
  emptyMessage = "No data available",
  showExport = false,
  exportFileName = 'exported_data',
  filters,
  siteOptions,
  zoneOptions
}: TableProps<T>) => {
  const cols = noActions
    ? columns
    : [
        ...columns,
        {
          text: "Action",
          dataField: "no_actions" as keyof T,
          className: "w-44 text-right",
          width: "180px",
          formatter: (_: unknown, row: T) => (
            <div className="flex justify-end gap-2">
              {actions && actions(row)}
              {onView && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-600 hover:bg-green-600 hover:text-white h-8 w-8"
                  title="View"
                  onClick={() => onView(row)}
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              {row.disableEdit === 1 && !onView && row.disableDelete === 1 && !actions && "-"}
              {onEdit && row?.disableEdit !== 1 && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-indigo-600 hover:bg-indigo-600 hover:text-white h-8 w-8"
                  title="Edit"
                  onClick={() => onEdit(row)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {onDelete && row?.disableDelete !== 1 && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-red-600 hover:bg-red-600 hover:text-white h-8 w-8"
                  title="Delete"
                  onClick={() => onDelete(row)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ),
        },
      ];

  const handleExcelExport = () => {
    exportToExcel(
      columns.map(column => ({ ...column, dataField: column.dataField as string, formatter: column.formatter as ((value: any) => React.ReactNode) })),
      pagination ? (data as PaginatedData<T>).docs : (data as T[]),
      exportFileName
    );
  };

  const handlePrint = () => {
    exportToPDF(
      columns.map(column => ({ ...column, dataField: column.dataField as string, formatter: column.formatter ? (value: any) => column.formatter!(value, {} as T) : undefined })),
      pagination ? (data as PaginatedData<T>).docs : (data as T[]),
      title as string,
      filters,
      siteOptions,
      zoneOptions
    );
  };

  return (
    <div className={`w-full bg-white rounded-lg ${shadow ? 'shadow-md border' : ''} overflow-hidden ${containerClassName || ''}`}>
      {!noHeader && (
        <header className={`px-6 py-4 border-b border-gray-100 flex ${title?'justify-between ':'justify-end'} items-center sticky left-0 bg-white`}>
          <div className="flex items-center justify-between gap-4 w-full">
            {title ? (
              typeof title === "string" ? (
                <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
              ) : (
                title
              )
            ) : (
              <></>
            )}
            
          </div>
          <div className="flex items-center gap-4">
            {action}
            {showExport && !loading && (pagination ? (data as PaginatedData<T>).docs : (data as T[]))?.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleExcelExport}
                  className="flex items-center gap-2 px-2 py-1.5 border border-secondary text-secondary rounded-md hover:bg-secondary hover:text-white transition-colors duration-200 text-sm"
                >
                  <Download size={16} />Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-1.5 border border-secondary text-secondary rounded-md hover:bg-secondary hover:text-white transition-colors duration-200 text-sm"
                >
                  <Printer size={16} />Print
                </button>
              </div>
            )}
          </div>
        </header>
      )}
      
      <div className="relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b border-gray-200">
                {indexed && (
                  <th className="px-6 py-3 text-left whitespace-nowrap sticky left-0 bg-gray-50" style={{ width: '40px', minWidth: '40px' }}>
                    <span className="text-xs font-semibold text-primary">#</span>
                  </th>
                )}
                {cols?.map((column, index) => (
                  <th 
                    key={index} 
                    className="px-6 py-3 text-left whitespace-nowrap text-primary"
                    style={{ width: column.width || 'auto', minWidth: column.width || '150px' }}
                  >
                    <span className={`text-xs font-semibold text-primary ${column?.className || ""}`}>
                      {column.text}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={(cols?.length || 0) + (indexed ? 1 : 0)} className="h-96">
                    <div className="flex items-center justify-center h-full">
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : (
                (pagination ? (data as PaginatedData<T>).docs : (data as T[]))?.length > 0 ? (
                  (pagination ? (data as PaginatedData<T>).docs : (data as T[]))?.map((row, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => onRowClick?.(row)}
                    >
                      {indexed && (
                        <td className="px-6 py-4 text-[10px] text-secondary whitespace-nowrap sticky left-0 bg-white" style={{ width: '60px', minWidth: '60px' }}>
                          {(pagination
                            ? ((data as PaginatedData<T>).page - 1) * (data as PaginatedData<T>).limit
                            : 0) +
                            index +
                            1}
                        </td>
                      )}
                      {cols?.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-6 py-4 text-[10px] text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis ${column?.className || ""}`}
                          style={{ 
                            width: column.width || 'auto', 
                            minWidth: column.width || '150px',
                            maxWidth: column.width || '300px'
                          }}
                          title={row[column.dataField]?.toString()}
                        >
                          {column.formatter
                            ? column.formatter(row[column.dataField], row)
                            : (row[column.dataField] as React.ReactNode) || "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={(cols?.length || 0) + (indexed ? 1 : 0)} className="px-6 py-4 text-center text-sm text-red-500">
                      {emptyMessage}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        
        {pagination && (
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-2">
            <div className="flex items-center gap-4">
              <div className="text-xs text-secondary">
                Showing {((data as PaginatedData<T>).page - 1) * (data as PaginatedData<T>).limit + 1} to{' '}
                {Math.min(
                  (data as PaginatedData<T>).page * (data as PaginatedData<T>).limit,
                  (data as PaginatedData<T>).totalDocs
                )}{' '}
                of {(data as PaginatedData<T>).totalDocs} results
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary">Show:</span>
                <select
                  className="border rounded px-2 py-1 text-[10px]"
                  value={(data as PaginatedData<T>).limit}
                  onChange={(e) => onReload?.({ limit: Number(e.target.value), page: 1 })}
                >
                  {LIMIT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="text-[10px]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="h-6 w-6 md:w-8 md:h-8 text-xs md:text-sm border rounded-full  flex items-center justify-center"
                disabled={(data as PaginatedData<T>).page === 1}
                onClick={() => onReload?.({ page: (data as PaginatedData<T>).page - 1 })}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: (data as PaginatedData<T>).totalPages }, (_, i) => i + 1).map((page, index, array) => {
                if (
                  page === 1 ||
                  page === (data as PaginatedData<T>).totalPages ||
                  (page >= (data as PaginatedData<T>).page - 1 && page <= (data as PaginatedData<T>).page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`h-6 w-6 md:w-8 md:h-8 text-xs md:text-sm border rounded-full ${page === (data as PaginatedData<T>).page ? 'gredient-background text-white' : ''}`}
                      disabled={page === (data as PaginatedData<T>).page}
                      onClick={() => onReload?.({ page })}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  (page === (data as PaginatedData<T>).page - 2 && page > 1) ||
                  (page === (data as PaginatedData<T>).page + 2 && page < (data as PaginatedData<T>).totalPages)
                ) {
                  return <span key={page}>...</span>;
                }
                return null;
              })}
              <button
                className="h-6 w-6 md:w-8 md:h-8 text-xs md:text-sm border rounded-full flex items-center justify-center"
                disabled={(data as PaginatedData<T>).page === (data as PaginatedData<T>).totalPages}
                onClick={() => onReload?.({ page: (data as PaginatedData<T>).page + 1 })}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;