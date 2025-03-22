import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Search, ArrowLeft } from 'lucide-react';

interface TimeRangeSelectorProps {
    setFilters: (filters: any) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ setFilters }) => {
    const [selectedRange, setSelectedRange] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');

    const ranges = [
        { id: 'last-hour', label: 'Last Hour', primary: true },
        { id: 'day', label: 'Day', primary: false },
        { id: 'week', label: 'Week', primary: false },
        { id: 'month', label: 'Month', primary: false },
        { id: 'date-range', label: 'Date Range', primary: false },
    ];

    useEffect(() => {
        if (selectedRange && selectedRange !== 'date-range') {
            const now = new Date();
            let start = new Date();
            const end = now;

            switch (selectedRange) {
                case 'last-hour':
                    start = new Date(now.getTime() - (60 * 60 * 1000));
                    break;
                case 'day':
                    start = new Date(now.getTime() - (24 * 60 * 60 * 1000));
                    break;
                case 'week':
                    start = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
                    break;
                case 'month':
                    start = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
                    break;
            }

            setFilters((prev: any) => ({
                ...prev,
                startDate: start.toISOString(),
                endDate: end.toISOString()
            }));
        } else {
            setFilters((prev: any) => ({
                ...prev,
                startDate: '',
                endDate: ''
            }));
        }
    }, [selectedRange]);

    const handleSearch = () => {
        if (selectedRange === 'date-range' && tempStartDate && tempEndDate) {
            const start = new Date(tempStartDate);
            const end = new Date(tempEndDate);
            end.setHours(23, 59, 59, 999); // Set end date to end of day

            setStartDate(tempStartDate);
            setEndDate(tempEndDate);
            setFilters((prev: any) => ({
                ...prev,
                startDate: start.toISOString(),
                endDate: end.toISOString()
            }));
        }
    };

    return (
        <div className="space-y-4">
            {selectedRange !== 'date-range' ? (
                <div className="flex flex-wrap items-center">
                    <div className="flex flex-wrap gap-2">
                        {ranges.map((range) => (
                            <button
                                key={range.id}
                                onClick={() => setSelectedRange(range.id)}
                                className={`
                                    px-3 py-2 rounded-lg text-xs font-medium transition-all
                                    border shadow-sm
                                    ${selectedRange === range.id
                                        ? 'bg-[#003C34] text-white border-[#003C34]'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSelectedRange('last-hour')}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft size={14} className="text-primary" />
                    </button>
                    <div className="flex-1 flex items-center gap-3">
                        <input
                            type="date"
                            value={tempStartDate}
                            onChange={(e) => setTempStartDate(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg text-xs"
                            placeholder="Start Date"
                        />
                        <input
                            type="date"
                            value={tempEndDate}
                            onChange={(e) => setTempEndDate(e.target.value)}
                            className="flex-1 px-3 py-2 border rounded-lg text-xs"
                            placeholder="End Date"
                        />
                        <Button
                            onClick={handleSearch}
                            size="sm"
                            variant="primary"
                            className="h-8 w-8 rounded-full flex items-center justify-center"
                        >
                            <Search size={20} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeRangeSelector;