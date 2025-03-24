'use client';
import DashboardTable from '@/components/live-incident/DashboardTable';
import React, { useState } from 'react';
import TimeRangeSelector from "@/components/report/TimeRange";
import Button from "@/components/common/Button";
import ProductSelectorForAiViolation from '@/components/report/ProductSelectorForAiViolation';

const DashboardPage = () => {
    const [filters, setFilters] = useState({
        sites: [] as string[],
        zones: [] as string[],
        types: [] as string[],
        activities: [] as string[],
        startDate: '',
        endDate: '',
        shift: '',
    });
    const [sortBy, setSortBy] = useState('id');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [formSubmit, setFormSubmit] = useState<(() => void) | null>(null);

    const handleFilterSubmit = (submitFn: () => void) => {
        setFormSubmit(() => submitFn);
    };

    const handleSearch = () => {
        if (formSubmit) {
            formSubmit();
        }
    };

    return (
        <>
            <div className='mx-auto'>
                <div className="grid grid-cols-12 gap-4">
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

                <DashboardTable 
                    filters={filters} 
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                />
            </div>
        </>
    );
};

export default DashboardPage;