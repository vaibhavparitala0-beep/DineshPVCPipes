import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";
import { Staff, AttendanceRecord, EmploymentStatus } from "@shared/staff";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Clock,
  UserCheck,
  UserX,
  Coffee,
  Shield,
  Edit,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffDetailDialogProps {
  staff: Staff;
  open: boolean;
  onClose: () => void;
}

const StaffDetailDialog = ({
  staff,
  open,
  onClose,
}: StaffDetailDialogProps) => {
  const {
    getAttendanceByStaff,
    updateStaffStatus,
    clockIn,
    clockOut,
    getTodayAttendance,
  } = useStaff();

  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("30"); // Last 30 days

  const attendanceRecords = getAttendanceByStaff(staff.id);
  const todayAttendance = getTodayAttendance();
  const todayRecord = todayAttendance.find((r) => r.staffId === staff.id);
  const isClockedIn =
    todayRecord && todayRecord.clockIn && !todayRecord.clockOut;

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const daysBack = parseInt(selectedPeriod);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    const cutoffString = cutoffDate.toISOString().split("T")[0];

    const periodRecords = attendanceRecords.filter(
      (r) => r.date >= cutoffString,
    );
    const totalDays = periodRecords.length;
    const presentDays = periodRecords.filter(
      (r) => r.status === "present",
    ).length;
    const lateDays = periodRecords.filter((r) => r.status === "late").length;
    const absentDays = periodRecords.filter(
      (r) => r.status === "absent",
    ).length;
    const overtimeDays = periodRecords.filter(
      (r) => r.overtimeHours > 0,
    ).length;

    const totalHours = periodRecords.reduce((sum, r) => sum + r.totalHours, 0);
    const totalOvertimeHours = periodRecords.reduce(
      (sum, r) => sum + r.overtimeHours,
      0,
    );
    const avgHours = totalDays > 0 ? totalHours / totalDays : 0;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    const punctualityRate =
      totalDays > 0 ? ((presentDays - lateDays) / totalDays) * 100 : 0;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      overtimeDays,
      totalHours,
      totalOvertimeHours,
      avgHours,
      attendanceRate,
      punctualityRate,
    };
  }, [attendanceRecords, selectedPeriod]);

  const recentAttendance = useMemo(() => {
    return attendanceRecords
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [attendanceRecords]);

  const handleStatusUpdate = async (newStatus: EmploymentStatus) => {
    try {
      await updateStaffStatus(staff.id, newStatus);
      toast({
        title: "Success",
        description: `Status updated to ${newStatus.replace("_", " ")}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleClockAction = async () => {
    try {
      if (isClockedIn) {
        await clockOut(staff.id);
        toast({
          title: "Success",
          description: "Clock out recorded successfully.",
        });
      } else {
        await clockIn(staff.id, "Admin Panel");
        toast({
          title: "Success",
          description: "Clock in recorded successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update attendance.",
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

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "early_leave":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Staff Details - {staff.firstName} {staff.lastName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(staff.status)}>
                {staff.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    {staff.avatar && typeof staff.avatar === "string" ? (
                      <img
                        src={staff.avatar}
                        alt={`${staff.firstName} ${staff.lastName}`}
                        className="w-20 h-20 object-cover rounded-full border border-gray-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {staff.firstName} {staff.lastName}
                      </h3>
                      <p className="text-gray-600">{staff.jobTitle}</p>
                      <p className="text-sm text-gray-500">
                        ID: {staff.employeeId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{staff.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{staff.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                          <div className="text-gray-600">
                            <p>{staff.address.street}</p>
                            <p>
                              {staff.address.city}, {staff.address.state}{" "}
                              {staff.address.zipCode}
                            </p>
                            <p>{staff.address.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Emergency Contact
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {staff.emergencyContact.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            Relationship:
                          </span>
                          <span className="text-gray-600">
                            {staff.emergencyContact.relationship}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {staff.emergencyContact.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Employment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">
                      {staff.department.replace("_", " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="font-medium">
                      {staff.role.replace("_", " ")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Hire Date</p>
                    <p className="font-medium">{formatDate(staff.hireDate)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Annual Salary</p>
                    <p className="font-medium">
                      {formatCurrency(staff.salary)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Work Schedule</p>
                    <p className="font-medium">
                      {staff.workingHours.startTime} -{" "}
                      {staff.workingHours.endTime}
                    </p>
                    <p className="text-sm text-gray-500">{staff.shift} shift</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Roles & Permissions</p>
                    <div className="space-y-1 mt-1">
                      {staff.roles.map((role) => (
                        <Badge
                          key={role.id}
                          variant="outline"
                          className="text-xs"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="space-y-6">
              {/* Today's Status & Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Today's Status
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleClockAction}
                        className={cn(
                          isClockedIn
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700",
                        )}
                      >
                        {isClockedIn ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Clock Out
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Clock In
                          </>
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayRecord ? (
                    <div className="flex items-center gap-6">
                      <Badge
                        className={getAttendanceStatusColor(todayRecord.status)}
                      >
                        {todayRecord.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      {todayRecord.clockIn && (
                        <div>
                          <p className="text-sm text-gray-600">Clock In</p>
                          <p className="font-medium">
                            {formatTime(todayRecord.clockIn)}
                          </p>
                        </div>
                      )}
                      {todayRecord.clockOut && (
                        <div>
                          <p className="text-sm text-gray-600">Clock Out</p>
                          <p className="font-medium">
                            {formatTime(todayRecord.clockOut)}
                          </p>
                        </div>
                      )}
                      {todayRecord.totalHours > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Total Hours</p>
                          <p className="font-medium">
                            {todayRecord.totalHours.toFixed(1)}h
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <UserX className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">
                        No attendance recorded today
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Attendance Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Attendance Rate
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {attendanceStats.attendanceRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Present Days</p>
                        <p className="text-xl font-bold text-gray-900">
                          {attendanceStats.presentDays}
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
                        <p className="text-sm text-gray-600">Avg Hours/Day</p>
                        <p className="text-xl font-bold text-gray-900">
                          {attendanceStats.avgHours.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Overtime Days</p>
                        <p className="text-xl font-bold text-gray-900">
                          {attendanceStats.overtimeDays}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Period Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Attendance History</span>
                    <Select
                      value={selectedPeriod}
                      onValueChange={setSelectedPeriod}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAttendance.length > 0 ? (
                      recentAttendance.map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatDate(record.date)}
                              </p>
                              {record.notes && (
                                <p className="text-sm text-gray-600">
                                  {record.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge
                              className={getAttendanceStatusColor(
                                record.status,
                              )}
                            >
                              {record.status.replace("_", " ").toUpperCase()}
                            </Badge>

                            <div className="text-sm text-gray-600 text-right">
                              {record.clockIn && (
                                <p>In: {formatTime(record.clockIn)}</p>
                              )}
                              {record.clockOut && (
                                <p>Out: {formatTime(record.clockOut)}</p>
                              )}
                            </div>

                            <div className="text-sm font-medium min-w-[60px] text-right">
                              {record.totalHours.toFixed(1)}h
                              {record.overtimeHours > 0 && (
                                <p className="text-purple-600">
                                  +{record.overtimeHours.toFixed(1)}h OT
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">
                          No attendance records found
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Performance tracking coming soon
                  </p>
                  <p className="text-sm text-gray-400">
                    Goals, reviews, and performance analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents & Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Document management coming soon
                  </p>
                  <p className="text-sm text-gray-400">
                    Contracts, certifications, and other documents
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailDialog;
