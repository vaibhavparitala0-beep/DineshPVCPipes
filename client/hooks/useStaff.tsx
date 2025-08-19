import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { 
  Staff, 
  StaffFormData, 
  StaffFilters, 
  StaffStats, 
  BulkStaffAction, 
  AttendanceRecord, 
  AttendanceFilters,
  TimeSheet,
  LoginSession,
  Role,
  StaffRole,
  Department,
  EmploymentStatus,
  AttendanceStatus
} from '@shared/staff';

interface StaffContextType {
  staff: Staff[];
  filteredStaff: Staff[];
  filters: StaffFilters;
  selectedStaff: string[];
  isLoading: boolean;
  stats: StaffStats;
  roles: Role[];
  attendanceRecords: AttendanceRecord[];
  timeSheets: TimeSheet[];
  loginSessions: LoginSession[];
  
  // Staff Management
  setFilters: (filters: StaffFilters) => void;
  searchStaff: (term: string) => void;
  addStaff: (staffData: StaffFormData) => Promise<void>;
  updateStaff: (staffId: string, staffData: StaffFormData) => Promise<void>;
  deleteStaff: (staffId: string) => Promise<void>;
  updateStaffStatus: (staffId: string, status: EmploymentStatus) => Promise<void>;
  assignRole: (staffId: string, roleIds: string[]) => Promise<void>;
  
  // Selection & Bulk Actions
  selectStaff: (staffId: string) => void;
  selectAllStaff: () => void;
  clearSelection: () => void;
  performBulkAction: (action: BulkStaffAction) => Promise<void>;
  
  // Attendance Management
  clockIn: (staffId: string, location?: string) => Promise<void>;
  clockOut: (staffId: string) => Promise<void>;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  updateAttendanceRecord: (recordId: string, updates: Partial<AttendanceRecord>) => Promise<void>;
  getAttendanceByStaff: (staffId: string, dateFrom?: string, dateTo?: string) => AttendanceRecord[];
  
  // Time Sheet Management
  generateTimeSheet: (staffId: string, weekStart: string) => Promise<void>;
  approveTimeSheet: (timeSheetId: string) => Promise<void>;
  rejectTimeSheet: (timeSheetId: string, reason: string) => Promise<void>;
  
  // Utility Functions
  getStaff: (staffId: string) => Staff | undefined;
  getStaffByRole: (role: StaffRole) => Staff[];
  getStaffByDepartment: (department: Department) => Staff[];
  getTodayAttendance: () => AttendanceRecord[];
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

// Mock roles data
const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Administrator',
    description: 'Full system access',
    permissions: [],
    level: 10,
    canManageStaff: true,
    canViewReports: true,
    canModifyInventory: true,
    canProcessOrders: true
  },
  {
    id: 'role-2',
    name: 'Production Manager',
    description: 'Manages production operations',
    permissions: [],
    level: 8,
    canManageStaff: true,
    canViewReports: true,
    canModifyInventory: true,
    canProcessOrders: true
  },
  {
    id: 'role-3',
    name: 'Quality Inspector',
    description: 'Quality control and inspection',
    permissions: [],
    level: 6,
    canManageStaff: false,
    canViewReports: true,
    canModifyInventory: false,
    canProcessOrders: false
  },
  {
    id: 'role-4',
    name: 'Machine Operator',
    description: 'Operates manufacturing equipment',
    permissions: [],
    level: 4,
    canManageStaff: false,
    canViewReports: false,
    canModifyInventory: false,
    canProcessOrders: false
  }
];

// Mock staff data
const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Wilson',
    email: 'john.wilson@company.com',
    phone: '+1-555-0101',
    role: 'manager',
    department: 'production',
    jobTitle: 'Production Manager',
    hireDate: '2022-03-15',
    salary: 75000,
    status: 'active',
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Jane Wilson',
      relationship: 'Spouse',
      phone: '+1-555-0102'
    },
    shift: 'day',
    workingHours: {
      startTime: '08:00',
      endTime: '17:00',
      breakDuration: 60
    },
    roles: [mockRoles[1]],
    lastLogin: '2024-01-16T08:30:00Z',
    isActive: true,
    createdAt: '2022-03-15',
    updatedAt: '2024-01-16',
    createdBy: 'admin'
  },
  {
    id: 'staff-2',
    employeeId: 'EMP002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0201',
    role: 'quality_inspector',
    department: 'quality_control',
    jobTitle: 'Senior Quality Inspector',
    hireDate: '2021-08-20',
    salary: 55000,
    status: 'active',
    address: {
      street: '456 Oak Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Brother',
      phone: '+1-555-0202'
    },
    manager: 'staff-1',
    shift: 'day',
    workingHours: {
      startTime: '07:30',
      endTime: '16:30',
      breakDuration: 45
    },
    roles: [mockRoles[2]],
    lastLogin: '2024-01-16T07:45:00Z',
    isActive: true,
    createdAt: '2021-08-20',
    updatedAt: '2024-01-16',
    createdBy: 'admin'
  },
  {
    id: 'staff-3',
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@company.com',
    phone: '+1-555-0301',
    role: 'machine_operator',
    department: 'production',
    jobTitle: 'Machine Operator',
    hireDate: '2023-01-10',
    salary: 45000,
    status: 'active',
    address: {
      street: '789 Pine St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62703',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Lisa Chen',
      relationship: 'Wife',
      phone: '+1-555-0302'
    },
    manager: 'staff-1',
    shift: 'day',
    workingHours: {
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: 30
    },
    roles: [mockRoles[3]],
    lastLogin: '2024-01-16T08:00:00Z',
    isActive: true,
    createdAt: '2023-01-10',
    updatedAt: '2024-01-16',
    createdBy: 'staff-1'
  },
  {
    id: 'staff-4',
    employeeId: 'EMP004',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@company.com',
    phone: '+1-555-0401',
    role: 'warehouse_staff',
    department: 'warehouse',
    jobTitle: 'Warehouse Coordinator',
    hireDate: '2022-11-05',
    salary: 42000,
    status: 'on_leave',
    address: {
      street: '321 Elm St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'USA'
    },
    emergencyContact: {
      name: 'Robert Davis',
      relationship: 'Father',
      phone: '+1-555-0402'
    },
    shift: 'day',
    workingHours: {
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60
    },
    roles: [],
    lastLogin: '2024-01-10T09:15:00Z',
    isActive: false,
    createdAt: '2022-11-05',
    updatedAt: '2024-01-10',
    createdBy: 'admin'
  }
];

// Mock attendance data
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-1',
    staffId: 'staff-1',
    date: '2024-01-16',
    clockIn: '2024-01-16T08:00:00Z',
    clockOut: '2024-01-16T17:00:00Z',
    breakStart: '2024-01-16T12:00:00Z',
    breakEnd: '2024-01-16T13:00:00Z',
    status: 'present',
    totalHours: 8,
    overtimeHours: 0,
    isManualEntry: false,
    location: 'Factory Floor'
  },
  {
    id: 'att-2',
    staffId: 'staff-2',
    date: '2024-01-16',
    clockIn: '2024-01-16T07:45:00Z',
    clockOut: '2024-01-16T16:30:00Z',
    status: 'present',
    totalHours: 8,
    overtimeHours: 0,
    isManualEntry: false,
    location: 'Quality Lab'
  },
  {
    id: 'att-3',
    staffId: 'staff-3',
    date: '2024-01-16',
    clockIn: '2024-01-16T08:15:00Z',
    status: 'late',
    totalHours: 0,
    overtimeHours: 0,
    isManualEntry: false,
    location: 'Production Line A',
    notes: 'Traffic delay'
  }
];

export const StaffProvider = ({ children }: { children: ReactNode }) => {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [filters, setFilters] = useState<StaffFilters>({});
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]);
  const [loginSessions, setLoginSessions] = useState<LoginSession[]>([]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      if (filters.role && filters.role.length > 0 && !filters.role.includes(member.role)) return false;
      if (filters.department && filters.department.length > 0 && !filters.department.includes(member.department)) return false;
      if (filters.status && filters.status.length > 0 && !filters.status.includes(member.status)) return false;
      if (filters.manager && member.manager !== filters.manager) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          member.firstName.toLowerCase().includes(searchLower) ||
          member.lastName.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          member.employeeId.toLowerCase().includes(searchLower) ||
          member.jobTitle.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [staff, filters]);

  const stats = useMemo(() => {
    const totalStaff = staff.length;
    const activeStaff = staff.filter(s => s.status === 'active').length;
    const onLeave = staff.filter(s => s.status === 'on_leave').length;
    const thisMonth = new Date().toISOString().slice(0, 7);
    const newHires = staff.filter(s => s.hireDate.startsWith(thisMonth)).length;
    
    const today = new Date().toISOString().slice(0, 10);
    const todayAttendance = attendanceRecords.filter(r => r.date === today);
    const presentToday = todayAttendance.filter(r => r.status === 'present').length;
    const absentToday = activeStaff - todayAttendance.length;
    const lateToday = todayAttendance.filter(r => r.status === 'late').length;
    
    const avgAttendance = activeStaff > 0 ? (presentToday / activeStaff) * 100 : 0;
    const totalDepartments = new Set(staff.map(s => s.department)).size;

    return {
      totalStaff,
      activeStaff,
      onLeave,
      newHires,
      avgAttendance,
      totalDepartments,
      presentToday,
      absentToday,
      lateToday
    };
  }, [staff, attendanceRecords]);

  const searchStaff = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  const addStaff = async (staffData: StaffFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const employeeId = `EMP${String(staff.length + 1).padStart(3, '0')}`;
      const selectedRoles = mockRoles.filter(role => staffData.roles.includes(role.id));
      
      const newStaff: Staff = {
        id: Date.now().toString(),
        employeeId,
        ...staffData,
        roles: selectedRoles,
        isActive: staffData.status === 'active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdBy: 'current_user'
      };
      
      setStaff(prev => [...prev, newStaff]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaff = async (staffId: string, staffData: StaffFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const selectedRoles = mockRoles.filter(role => staffData.roles.includes(role.id));
      
      setStaff(prev => prev.map(member => 
        member.id === staffId 
          ? { 
              ...member, 
              ...staffData,
              roles: selectedRoles,
              isActive: staffData.status === 'active',
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : member
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStaff = async (staffId: string): Promise<void> => {
    setIsLoading(true);
    try {
      setStaff(prev => prev.filter(member => member.id !== staffId));
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffStatus = async (staffId: string, status: EmploymentStatus): Promise<void> => {
    setIsLoading(true);
    try {
      setStaff(prev => prev.map(member => 
        member.id === staffId 
          ? { ...member, status, isActive: status === 'active', updatedAt: new Date().toISOString().split('T')[0] }
          : member
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const assignRole = async (staffId: string, roleIds: string[]): Promise<void> => {
    setIsLoading(true);
    try {
      const selectedRoles = mockRoles.filter(role => roleIds.includes(role.id));
      setStaff(prev => prev.map(member => 
        member.id === staffId 
          ? { ...member, roles: selectedRoles, updatedAt: new Date().toISOString().split('T')[0] }
          : member
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const selectStaff = (staffId: string) => {
    setSelectedStaff(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const selectAllStaff = () => {
    setSelectedStaff(filteredStaff.map(member => member.id));
  };

  const clearSelection = () => {
    setSelectedStaff([]);
  };

  const performBulkAction = async (action: BulkStaffAction): Promise<void> => {
    setIsLoading(true);
    try {
      switch (action.type) {
        case 'update_status':
          if (action.value) {
            for (const staffId of action.staffIds) {
              await updateStaffStatus(staffId, action.value as EmploymentStatus);
            }
          }
          break;
        case 'assign_role':
          if (action.value) {
            for (const staffId of action.staffIds) {
              await assignRole(staffId, [action.value]);
            }
          }
          break;
      }
      clearSelection();
    } finally {
      setIsLoading(false);
    }
  };

  const clockIn = async (staffId: string, location?: string): Promise<void> => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      staffId,
      date: today,
      clockIn: now,
      status: 'present',
      totalHours: 0,
      overtimeHours: 0,
      isManualEntry: false,
      location
    };
    
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const clockOut = async (staffId: string): Promise<void> => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();
    
    setAttendanceRecords(prev => prev.map(record => {
      if (record.staffId === staffId && record.date === today && !record.clockOut) {
        const clockInTime = new Date(record.clockIn!);
        const clockOutTime = new Date(now);
        const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...record,
          clockOut: now,
          totalHours: Math.round(totalHours * 100) / 100
        };
      }
      return record;
    }));
  };

  const addAttendanceRecord = async (record: Omit<AttendanceRecord, 'id'>): Promise<void> => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString()
    };
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const updateAttendanceRecord = async (recordId: string, updates: Partial<AttendanceRecord>): Promise<void> => {
    setAttendanceRecords(prev => prev.map(record => 
      record.id === recordId ? { ...record, ...updates } : record
    ));
  };

  const getAttendanceByStaff = (staffId: string, dateFrom?: string, dateTo?: string): AttendanceRecord[] => {
    return attendanceRecords.filter(record => {
      if (record.staffId !== staffId) return false;
      if (dateFrom && record.date < dateFrom) return false;
      if (dateTo && record.date > dateTo) return false;
      return true;
    });
  };

  const generateTimeSheet = async (staffId: string, weekStart: string): Promise<void> => {
    // Implementation for generating time sheets
  };

  const approveTimeSheet = async (timeSheetId: string): Promise<void> => {
    setTimeSheets(prev => prev.map(ts => 
      ts.id === timeSheetId 
        ? { ...ts, status: 'approved', approvedAt: new Date().toISOString() }
        : ts
    ));
  };

  const rejectTimeSheet = async (timeSheetId: string, reason: string): Promise<void> => {
    setTimeSheets(prev => prev.map(ts => 
      ts.id === timeSheetId 
        ? { ...ts, status: 'rejected', comments: reason }
        : ts
    ));
  };

  const getStaff = (staffId: string) => {
    return staff.find(member => member.id === staffId);
  };

  const getStaffByRole = (role: StaffRole) => {
    return staff.filter(member => member.role === role);
  };

  const getStaffByDepartment = (department: Department) => {
    return staff.filter(member => member.department === department);
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().slice(0, 10);
    return attendanceRecords.filter(record => record.date === today);
  };

  return (
    <StaffContext.Provider value={{
      staff,
      filteredStaff,
      filters,
      selectedStaff,
      isLoading,
      stats,
      roles: mockRoles,
      attendanceRecords,
      timeSheets,
      loginSessions,
      setFilters,
      searchStaff,
      addStaff,
      updateStaff,
      deleteStaff,
      updateStaffStatus,
      assignRole,
      selectStaff,
      selectAllStaff,
      clearSelection,
      performBulkAction,
      clockIn,
      clockOut,
      addAttendanceRecord,
      updateAttendanceRecord,
      getAttendanceByStaff,
      generateTimeSheet,
      approveTimeSheet,
      rejectTimeSheet,
      getStaff,
      getStaffByRole,
      getStaffByDepartment,
      getTodayAttendance
    }}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
