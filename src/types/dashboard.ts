export interface DashboardData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  phone?: string;
  address?: string;
  department?: string;
  _id?: string;
  disableEdit?: number;
  disableDelete?: number;
}

export interface UserHistory {
  date: string;
  action: string;
  description: string;
}

export interface EmployeeData {
  label: string;
  value: number;
  color: string;
}
