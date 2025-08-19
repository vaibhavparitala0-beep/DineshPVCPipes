export type StaffRole =
  | "admin"
  | "manager"
  | "supervisor"
  | "production_lead"
  | "machine_operator"
  | "quality_inspector"
  | "warehouse_staff"
  | "maintenance"
  | "shipping_clerk"
  | "sales_rep"
  | "hr"
  | "accountant";

export type Department =
  | "administration"
  | "production"
  | "quality_control"
  | "warehouse"
  | "maintenance"
  | "shipping"
  | "sales"
  | "hr"
  | "finance";

export type EmploymentStatus =
  | "active"
  | "inactive"
  | "on_leave"
  | "terminated";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "early_leave"
  | "half_day"
  | "overtime";

export type ShiftType = "day" | "night" | "rotating" | "flexible";

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: "orders" | "items" | "staff" | "reports" | "settings";
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  level: number; // 1-10, higher = more access
  canManageStaff: boolean;
  canViewReports: boolean;
  canModifyInventory: boolean;
  canProcessOrders: boolean;
}

export interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;

  // Employment Details
  role: StaffRole;
  department: Department;
  jobTitle: string;
  hireDate: string;
  salary: number;
  status: EmploymentStatus;

  // Contact Information
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Work Details
  manager?: string; // Staff ID of manager
  shift: ShiftType;
  workingHours: {
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    breakDuration: number; // minutes
  };

  // System Access
  roles: Role[];
  lastLogin?: string;
  isActive: boolean;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD format
  clockIn?: string; // ISO timestamp
  clockOut?: string; // ISO timestamp
  breakStart?: string;
  breakEnd?: string;
  status: AttendanceStatus;
  totalHours: number;
  overtimeHours: number;
  notes?: string;
  approvedBy?: string;
  isManualEntry: boolean;
  location?: string; // For remote work tracking
}

export interface TimeSheet {
  id: string;
  staffId: string;
  weekStartDate: string; // YYYY-MM-DD format
  weekEndDate: string;
  attendanceRecords: AttendanceRecord[];
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalBreakHours: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  status: "draft" | "submitted" | "approved" | "rejected";
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  comments?: string;
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: File | string;
  role: StaffRole;
  department: Department;
  jobTitle: string;
  hireDate: string;
  salary: number;
  status: EmploymentStatus;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  manager?: string;
  shift: ShiftType;
  workingHours: {
    startTime: string;
    endTime: string;
    breakDuration: number;
  };
  roles: string[]; // Role IDs
  notes?: string;
}

export interface StaffFilters {
  role?: StaffRole[];
  department?: Department[];
  status?: EmploymentStatus[];
  manager?: string;
  searchTerm?: string;
  hiredAfter?: string;
  hiredBefore?: string;
  salaryMin?: number;
  salaryMax?: number;
}

export interface AttendanceFilters {
  staffIds?: string[];
  dateFrom?: string;
  dateTo?: string;
  status?: AttendanceStatus[];
  department?: Department[];
}

export interface StaffStats {
  totalStaff: number;
  activeStaff: number;
  onLeave: number;
  newHires: number; // This month
  avgAttendance: number; // Percentage
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
}

export interface BulkStaffAction {
  type:
    | "update_status"
    | "change_department"
    | "assign_role"
    | "update_manager"
    | "export";
  value?: string;
  staffIds: string[];
}

export interface LoginSession {
  id: string;
  staffId: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  device: string;
  browser: string;
  location?: string;
  duration?: number; // in minutes
  isActive: boolean;
}

export interface ShiftSchedule {
  id: string;
  staffId: string;
  date: string;
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  notes?: string;
}
