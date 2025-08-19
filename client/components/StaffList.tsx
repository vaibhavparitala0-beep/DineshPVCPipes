import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useStaff } from "@/hooks/useStaff";
import { Staff, StaffRole, Department, EmploymentStatus } from "@shared/staff";
import StaffForm from "./StaffForm";
import StaffDetailDialog from "./StaffDetailDialog";
import {
  Search,
  Filter,
  Users,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Clock,
  Calendar,
  Shield,
  Building,
  Phone,
  Mail,
  UserCheck,
  UserX,
  Coffee,
  FileText,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportStaffReport } from "@/lib/pdfExport";
import { useToast } from "@/hooks/use-toast";

const StaffList = () => {
  const {
    filteredStaff,
    filters,
    setFilters,
    selectedStaff,
    selectStaff,
    selectAllStaff,
    clearSelection,
    stats,
    deleteStaff,
    updateStaffStatus,
    clockIn,
    clockOut,
    getTodayAttendance,
  } = useStaff();

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaffMember, setSelectedStaffMember] = useState<Staff | null>(
    null,
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ ...filters, searchTerm: term });
  };

  const handleFilterChange = (key: string, value: string) => {
    if (key === "role" || key === "department" || key === "status") {
      setFilters({
        ...filters,
        [key]: value === "all" ? undefined : [value],
      });
    } else {
      setFilters({
        ...filters,
        [key]: value === "all" ? undefined : value,
      });
    }
  };

  const handleDelete = async (staffMember: Staff) => {
    try {
      await deleteStaff(staffMember.id);
      toast({
        title: "Success",
        description: `${staffMember.firstName} ${staffMember.lastName} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (
    staffId: string,
    newStatus: EmploymentStatus,
  ) => {
    try {
      await updateStaffStatus(staffId, newStatus);
      toast({
        title: "Success",
        description: "Staff status updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClockIn = async (staffId: string) => {
    try {
      await clockIn(staffId, "Factory Floor");
      toast({
        title: "Success",
        description: "Clock in recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record clock in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClockOut = async (staffId: string) => {
    try {
      await clockOut(staffId);
      toast({
        title: "Success",
        description: "Clock out recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record clock out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: EmploymentStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "on_leave":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "terminated":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: StaffRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "supervisor":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "quality_inspector":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDepartmentIcon = (department: Department) => {
    switch (department) {
      case "production":
        return <Building className="h-4 w-4" />;
      case "quality_control":
        return <Shield className="h-4 w-4" />;
      case "administration":
        return <Users className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const todayAttendance = getTodayAttendance();
  const isStaffClockedIn = (staffId: string) => {
    const record = todayAttendance.find((r) => r.staffId === staffId);
    return record && record.clockIn && !record.clockOut;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalStaff}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.activeStaff}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Present Today</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.presentToday}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.onLeave}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.role?.[0] || "all"}
              onValueChange={(value) => handleFilterChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="production_lead">Production Lead</SelectItem>
                <SelectItem value="machine_operator">
                  Machine Operator
                </SelectItem>
                <SelectItem value="quality_inspector">
                  Quality Inspector
                </SelectItem>
                <SelectItem value="warehouse_staff">Warehouse Staff</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.department?.[0] || "all"}
              onValueChange={(value) => handleFilterChange("department", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="quality_control">Quality Control</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status?.[0] || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilters({});
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedStaff.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedStaff.length} staff member
                  {selectedStaff.length !== 1 ? "s" : ""} selected
                </span>
                <Button size="sm" variant="outline" onClick={clearSelection}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  Export Selected
                </Button>
                <Button size="sm" variant="outline">
                  Bulk Update Status
                </Button>
                <Button size="sm" variant="outline">
                  Assign Roles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-600">
            {filteredStaff.length} staff member
            {filteredStaff.length !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4">
                    <Checkbox
                      checked={
                        selectedStaff.length === filteredStaff.length &&
                        filteredStaff.length > 0
                      }
                      onCheckedChange={selectAllStaff}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Staff Member
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Role & Department
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Employment
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Attendance
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaff.map((staffMember) => {
                  const isClockedIn = isStaffClockedIn(staffMember.id);

                  return (
                    <tr key={staffMember.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <Checkbox
                          checked={selectedStaff.includes(staffMember.id)}
                          onCheckedChange={() => selectStaff(staffMember.id)}
                        />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {staffMember.avatar && typeof staffMember.avatar === 'string' ? (
                            <img
                              src={staffMember.avatar}
                              alt={`${staffMember.firstName} ${staffMember.lastName}`}
                              className="w-10 h-10 object-cover rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {staffMember.firstName} {staffMember.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {staffMember.employeeId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {staffMember.jobTitle}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <Badge className={getRoleColor(staffMember.role)}>
                            {staffMember.role.replace("_", " ").toUpperCase()}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            {getDepartmentIcon(staffMember.department)}
                            <span>
                              {staffMember.department.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-xs">
                              {staffMember.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{staffMember.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {formatSalary(staffMember.salary)}
                          </p>
                          <p className="text-gray-600">
                            Hired: {formatDate(staffMember.hireDate)}
                          </p>
                          <p className="text-gray-500">
                            {staffMember.shift} shift
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {isClockedIn ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClockOut(staffMember.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              Clock Out
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleClockIn(staffMember.id)}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              disabled={staffMember.status !== "active"}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Clock In
                            </Button>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(staffMember.status)}>
                          {staffMember.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedStaffMember(staffMember)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <StaffForm
                            staff={staffMember}
                            trigger={
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            }
                          />

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove Staff Member
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove "
                                  {staffMember.firstName} {staffMember.lastName}
                                  " from the staff? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(staffMember)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remove Staff
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500">No staff members found</p>
                        {searchTerm && (
                          <p className="text-sm text-gray-400">
                            Try adjusting your search or filters
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Staff Detail Dialog */}
      {selectedStaffMember && (
        <StaffDetailDialog
          staff={selectedStaffMember}
          open={!!selectedStaffMember}
          onClose={() => setSelectedStaffMember(null)}
        />
      )}
    </div>
  );
};

export default StaffList;
