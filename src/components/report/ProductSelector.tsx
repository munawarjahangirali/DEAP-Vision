import React, { useEffect, useState } from 'react';
import MultiSelect, { Option } from '../common/MultiSelect';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Button from '../common/Button';
import { useCommon } from '@/context/CommonContext';
import Select from '../common/Select'; // Assuming a Select component exists

interface ProductSelectorProps {
    onSubmit: (submitFn: () => void) => void;
    setFilters: (filters: any) => void;
    setPage: (page: number) => void;
}

// const fetchZones = async () => {
//     const response = await axios.get('/api/zones');
//     return response.data.data.map((zone: any) => ({
//         value: zone.id,
//         label: zone.name,
//     }));
// };

// const fetchSites = async () => {
//     const response = await axios.get('/api/sites');
//     return response.data.data.map((site: any) => ({
//         value: site.id,
//         label: site.name,
//     }));
// };

// const fetchTypes = async () => {
//     const response = await axios.get('/api/types');
//     return response.data.data.map((type: any) => ({
//         value: type.type,
//         label: type.type,
//     }));
// };

// Fetch activities
const fetchActivities = async () => {
    const response = await axios.get('/api/activities');
    return response.data.data.map((activity: any) => ({
        value: activity.activity,
        label: activity.activity,
    }));
};

const ProductSelector: React.FC<ProductSelectorProps> = ({ onSubmit,setFilters,setPage }) => {
    const [selectedSites, setSelectedSites] = useState<Option[]>([]);
    const [selectedZones, setSelectedZones] = useState<Option[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<Option[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<Option[]>([]);
    const [selectedShift, setSelectedShift] = useState<string>(''); // Default to empty string

    const { categories, types, sites, zones, isLoading } = useCommon();


    const siteOptions = sites.map((site:any) => ({ value: site.id, label: site.name }));
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

    const hasSelections = selectedSites.length > 0 || 
                         selectedZones.length > 0 || 
                         selectedTypes.length > 0 || 
                         selectedActivities.length > 0;

    const handleClearAll = () => {
        setSelectedSites([]);
        setSelectedZones([]);
        setSelectedTypes([]);
        setSelectedActivities([]);
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
            sites: selectedSites.map(site => site.value),
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

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
                <MultiSelect
                    options={siteOptions}
                    value={selectedSites}
                    onChange={setSelectedSites}
                    placeholder="Sites"
                    closeMenuOnSelect={false}
                />
                <MultiSelect
                    options={zoneOptions}
                    value={selectedZones}
                    onChange={setSelectedZones}
                    placeholder="Zones"
                    closeMenuOnSelect={false}
                />
                <MultiSelect
                    options={typeOptions}
                    value={selectedTypes}
                    onChange={setSelectedTypes}
                    placeholder="Types"
                    closeMenuOnSelect={false}
                />
                <MultiSelect
                    options={activityOptions}
                    value={selectedActivities}
                    onChange={setSelectedActivities}
                    placeholder="Activity"
                    closeMenuOnSelect={false}
                />
                <Select
                    options={[
                        { value: 'All', label: 'All' },
                        { value: 'Day Shift', label: 'Day Shift' },
                        { value: 'Night Shift', label: 'Night Shift' },
                    ]}
                    value={selectedShift}
                    onChange={(value) => setSelectedShift(value)} // Update selectedShift state
                    placeholder="Select Shift"
                />
                {hasSelections && (
                    <Button
                        variant='delete'
                        className="px-3 py-2 text-xs font-medium rounded-lg w-20"
                        onClick={handleClearAll}
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ProductSelector;