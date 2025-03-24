'use client';
// import DashboardWidget from '@/components/report/ReportWidget';
import DashboardTable from '@/components/live-incident/DashboardTable';
import React, { useState, use } from 'react';
import { useCommon, Site } from '@/context/CommonContext';
import TimeRangeSelector from "@/components/report/TimeRange";
import Button from "@/components/common/Button";
import ProductSelectorForAiViolation from '@/components/report/ProductSelectorForAiViolation';

export default function SiteAutomaticAlarm({ params }: { params: any }) {
    const unwrappedParams = use(params) as { siteId: string };
    const siteId = Number(unwrappedParams.siteId);
    const { sites } = useCommon();
    const [filters, setFilters] = useState({
        sites: [siteId.toString()],
        zones: [] as string[],
        types: [] as string[],
        activities: [] as string[],
        startDate: '',
        endDate: '',
        shift: '',
    });
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [formSubmit, setFormSubmit] = useState<(() => void) | null>(null);

    const handleFilterSubmit = (submitFn: () => void) => {
        setFormSubmit(() => submitFn);
    };

    const handleSearch = () => {
        if (formSubmit) {
            formSubmit();
        }
    };

    const site = sites?.find((site: Site) => +site.id === siteId);
    const boardId = site?.boardID || '';

    return (
        <>
            <div className='mx-auto'>
                {
                    boardId && (
                        <div className="grid grid-cols-12 gap-4 mb-4">
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-5">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                    <TimeRangeSelector setFilters={setFilters} />
                                </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                    <ProductSelectorForAiViolation
                                        onSubmit={handleFilterSubmit}
                                        setFilters={setFilters}
                                        setPage={setPage}
                                        hideSiteSelector={true}
                                        setSortBy={setSortBy}
                                        setSortOrder={setSortOrder}
                                        sortBy={sortBy}
                                        sortOrder={sortOrder}
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
                    )
                }

                {/* <div className="mb-8">
                    <DashboardWidget
                        accidentCount={0}
                        missCount={2}
                        hazardousCount={2}
                        observationCount={6}
                    />
                </div> */}

                {boardId ? (
                    <DashboardTable 
                        title="Alarm"
                        boardId={boardId}
                        filters={filters}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                    />
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative">
                        No data available.
                    </div>
                )}
            </div>
        </>
    );
};
