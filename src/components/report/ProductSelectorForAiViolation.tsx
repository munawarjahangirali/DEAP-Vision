import React, { useEffect, useState } from 'react';
import MultiSelect, { Option } from '../common/MultiSelect';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Button from '../common/Button';
import { useCommon } from '@/context/CommonContext';
import Select from '../common/Select'; // Assuming a Select component exists

interface ProductSelectorForAiViolationProps {
    onSubmit: (submitFn: () => void) => void;
    setFilters: any;
    setPage: any;
    hideSiteSelector?: boolean;
    setSortBy?: (value: string) => void;
    setSortOrder?: (value: string) => void;
    sortBy?: string;
    sortOrder?: string;
}

// Fetch activities
const fetchActivities = async () => {
    const response = await axios.get('/api/activities');
    return response.data.data.map((activity: any) => ({
        value: activity.activity,
        label: activity.activity,
    }));
};

const ProductSelectorForAiViolation: React.FC<ProductSelectorForAiViolationProps> = ({
    onSubmit,
    setFilters,
    setPage,
    hideSiteSelector = false,
    setSortBy,
    setSortOrder,
    sortBy = '',
    sortOrder = ''
}) => {
    const [selectedSites, setSelectedSites] = useState<string>('');
    const [selectedZones, setSelectedZones] = useState<Option[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<Option[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<Option[]>([]);
    const [selectedShift, setSelectedShift] = useState<string>(''); 

    const { categories, types, sites, zones, isLoading } = useCommon();

    const siteOptions = sites.map((site:any) => ({ value: site.boardID, label: site.name }));
    const zoneOptions = zones.map((zone:any) => ({ value: zone.id, label: zone.name }));
    // const typeOptions = types.map((type:any) => ({ value: type.type, label: type.type }));
    const typeOptions = [
        "Glove (PPE)",
        "Helmet (PPE)",
        "Cap (PPE)",
        "Hood (PPE)",
        "Sheld (PPE)",
        "Glass (PPE)",
        "Vest (PPE)",
        "Pents (PPE)",
        "Dropped Object",
        "Injury/illness",
        "Line of Fire Intrusion",
    ].map(type => ({ value: type, label: type }));

    const { data: activityOptions = [], error: activityError } = useQuery({ queryKey: ['activities'], queryFn: fetchActivities });

    if (activityError) {
        console.error('Failed to fetch activities:', activityError);
    }

    const hasSelections = !!selectedSites || 
                         selectedZones.length > 0 || 
                         selectedTypes.length > 0 || 
                         selectedActivities.length > 0 ||
                            !!selectedShift ||
                            sortBy !== 'id' ||
                            sortOrder !== 'desc';

    const handleClearAll = () => {
        setSelectedSites('');
        setSelectedZones([]);
        setSelectedTypes([]);
        setSelectedActivities([]);
        setSelectedShift(''); 
        if (setSortBy) setSortBy('id');
        if (setSortOrder) setSortOrder('desc');
        setFilters((prev: any) => ({
            ...prev,
            sites: [],
            zones: [],
            types: [],
            activities: [],
            shift: 'None'
        }));
        setPage(1);
    };

    const handleSubmit = () => {
        const filters = {
            sites: selectedSites,
            zones: selectedZones.map(zone => zone.value),
            types: selectedTypes.map(type => type.value),
            activities: selectedActivities.map(activity => activity.value),
            shift: selectedShift, // Ensure selectedShift is included here
        };
        setFilters((prev: any) => ({
            ...prev,
            ...filters,
        }));
        setPage(1);
    };

    // Register the submit function with parent component
    useEffect(() => {
        onSubmit(handleSubmit);
    }, [selectedSites, selectedZones, selectedTypes, selectedActivities, selectedShift]); // Add selectedShift as a dependency

    const sortOptions = [
        { value: 'id_desc', label: 'Default' },
        { value: 'time_asc', label: 'Date (Oldest First)' },
        { value: 'time_desc', label: 'Date (Newest First)' },
        { value: 'summary_asc', label: 'Violation Type (A-Z)' },
        { value: 'summary_desc', label: 'Violation Type (Z-A)' },
    ];

    const handleSortChange = (value: string) => {
        if (setSortBy && setSortOrder) {
            const [field, order] = value.split('_');
            setSortBy(field);
            setSortOrder(order);
        }
    };

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2">
                {/* Conditionally render the site selector based on hideSiteSelector prop */}
                {!hideSiteSelector && (
                    <div className="col-span-3">
                        <Select
                            options={siteOptions}
                            value={selectedSites}
                            onChange={setSelectedSites}
                            placeholder="Sites"
                        />
                    </div>
                )}
                <div className="col-span-3">
                    <Select
                        options={[
                            { value: 'All', label: 'All' },
                            { value: 'Day Shift', label: 'Day Shift' },
                            { value: 'Night Shift', label: 'Night Shift' },
                        ]}
                        value={selectedShift}
                        onChange={(value) => setSelectedShift(value)}
                        placeholder="Select Shift"
                    />
                </div>
                {/* {setSortBy && setSortOrder && ( */}
                    <div className="col-span-3">
                        <Select
                            options={sortOptions}
                            value={`${sortBy}_${sortOrder}`}
                            onChange={handleSortChange}
                            placeholder="Sort by"
                        />
                    </div>
                {/* )} */}
                {hasSelections && (
                    <div className="col-span-3">
                        <Button
                            variant='delete'
                            className="px-3 py-2 text-xs font-medium rounded-lg w-20"
                            onClick={handleClearAll}
                        >
                            Clear
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSelectorForAiViolation;