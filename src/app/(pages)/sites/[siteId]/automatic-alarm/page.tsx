'use client';
// import DashboardWidget from '@/components/report/ReportWidget';
import DashboardTable from '@/components/live-incident/DashboardTable';
import React from 'react';
import { useCommon, Site } from '@/context/CommonContext';

export default function SiteAutomaticAlarm({ params }: { params: any }) {
    const siteId = Number(params.siteId);
    const { sites } = useCommon();

    const site = sites?.find((site: Site) => +site.id === siteId);
    const boardId = site?.boardID || '';

    return (
        <>
            <div className=' mx-auto'>
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
