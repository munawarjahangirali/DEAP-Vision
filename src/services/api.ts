import axiosInstance from "./axios";
import axios from 'axios';

export const fetchViolations = async (
    page: number, 
    limit: number, 
    filters: {
        sites: string[];
        zones: string[];
        types: string[];
        activities: string[];
        startDate?: string;
        endDate?: string;
        shift?: string; // Add shift to filters
    }
) => {
    const params = new URLSearchParams();
    
    // Add pagination parameters
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    // Add filter parameters as multiple entries instead of comma-separated
    filters.sites.forEach(site => params.append('sites', site));
    filters.zones.forEach(zone => params.append('zones', zone));
    filters.types.forEach(type => params.append('violation_type', type));
    filters.activities.forEach(activity => params.append('activities', activity));
    
    // Add date filters in ISO format
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.shift) params.append('shift', filters.shift); // Add shift to query params

    const { data } = await axiosInstance.get(`/violations?${params.toString()}`);
    return data;
};

export const fetchViolationStats = async (filters: {
  startDate?: string;
  endDate?: string;
  sites?: string[];
  zones?: string[];
  types?: string[];
  activities?: string[];
}) => {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('start_date', filters.startDate);
  if (filters.endDate) params.append('end_date', filters.endDate);
  filters.zones?.forEach(zone => params.append('zones', zone));
  filters.sites?.forEach(site => params.append('sites', site));
  filters.types?.forEach(type => params.append('violation_type', type));
  filters.activities?.forEach(activity => params.append('activities', activity));

  const response = await axios.get(`/api/violations/stats?${params.toString()}`);
  return response.data;
};