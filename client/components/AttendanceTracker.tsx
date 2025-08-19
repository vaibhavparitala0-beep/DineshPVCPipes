import { useState, useMemo } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStaff } from "@/hooks/useStaff";
import { AttendanceRecord, AttendanceStatus, Staff } from "@shared/staff";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  Coffee,
  Plus,
  Download,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AttendanceTracker = () => {
  const {
    staff,
    attendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    clockIn,
    clockOut,
    getTodayAttendance,
    getAttendanceByStaff,
  } = useStaff();

  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newRecord, setNewRecord] = useState({
    staffId: "",
    date: new Date().toISOString().split("T")[0],
    clockIn: "",
    clockOut: "",
    status: "present" as AttendanceStatus,
    notes: "",
    isManualEntry: true,
  });

  const todayAttendance = getTodayAttendance();

  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const selectedDateAttendance = attendanceRecords.filter(
    (record) => record.date === selectedDateString,
  );

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      if (filterDepartment !== "all" && member.department !== filterDepartment)
        return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          member.firstName.toLowerCase().includes(searchLower) ||
          member.lastName.toLowerCase().includes(searchLower) ||
          member.employeeId.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [staff, filterDepartment, searchTerm]);

  const attendanceStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = attendanceRecords.filter((r) => r.date === today);
    const activeStaff = staff.filter((s) => s.status === "active").length;

    const present = todayRecords.filter((r) => r.status === "present").length;
    const absent = activeStaff - todayRecords.length;
    const late = todayRecords.filter((r) => r.status === "late").length;
    const onBreak = todayRecords.filter(
      (r) => r.breakStart && !r.breakEnd,
    ).length;

    const attendanceRate = activeStaff > 0 ? (present / activeStaff) * 100 : 0;

    return { present, absent, late, onBreak, attendanceRate, activeStaff };
  }, [staff, attendanceRecords]);

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "early_leave":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "half_day":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "overtime":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <UserCheck className="h-4 w-4" />;
      case "absent":
        return <UserX className="h-4 w-4" />;
      case "late":
        return <Clock className="h-4 w-4" />;
      case "early_leave":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotalHours = (clockIn: string, clockOut?: string) => {
    if (!clockOut) return 0;
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    return (
      Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 100) /
      100
    );
  };

  const handleQuickClockIn = async (staffId: string) => {
    try {
      await clockIn(staffId, "Factory Floor");
      toast({
        title: "Success",
        description: "Clock in recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record clock in.",
        variant: "destructive",
      });
    }
  };

  const handleQuickClockOut = async (staffId: string) => {
    try {
      await clockOut(staffId);
      toast({
        title: "Success",
        description: "Clock out recorded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record clock out.",
        variant: "destructive",
      });
    }
  };

  const handleAddManualRecord = async () => {
    try {
      const clockInTime = newRecord.clockIn
        ? `${newRecord.date}T${newRecord.clockIn}:00Z`
        : undefined;
      const clockOutTime = newRecord.clockOut
        ? `${newRecord.date}T${newRecord.clockOut}:00Z`
        : undefined;

      const totalHours =
        clockInTime && clockOutTime
          ? calculateTotalHours(clockInTime, clockOutTime)
          : 0;

      await addAttendanceRecord({
        staffId: newRecord.staffId,
        date: newRecord.date,
        clockIn: clockInTime,
        clockOut: clockOutTime,
        status: newRecord.status,
        totalHours,
        overtimeHours: Math.max(0, totalHours - 8),
        notes: newRecord.notes,
        isManualEntry: true,
      });

      toast({
        title: "Success",
        description: "Attendance record added successfully.",
      });

      setShowAddRecord(false);
      setNewRecord({
        staffId: "",
        date: new Date().toISOString().split("T")[0],
        clockIn: "",
        clockOut: "",
        status: "present",
        notes: "",
        isManualEntry: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add attendance record.",
        variant: "destructive",
      });
    }
  };

  const isStaffClockedIn = (staffId: string) => {
    const record = todayAttendance.find((r) => r.staffId === staffId);
    return record && record.clockIn && !record.clockOut;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-xl font-bold text-gray-900">
                  {attendanceStats.present}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-xl font-bold text-gray-900">
                  {attendanceStats.absent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-xl font-bold text-gray-900">
                  {attendanceStats.late}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">On Break</p>
                <p className="text-xl font-bold text-gray-900">
                  {attendanceStats.onBreak}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {attendanceStats.attendanceRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Dialog open={showAddRecord} onOpenChange={setShowAddRecord}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Manual Attendance Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="staffSelect">Staff Member</Label>
                    <Select
                      value={newRecord.staffId}
                      onValueChange={(value) =>
                        setNewRecord((prev) => ({ ...prev, staffId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member..." />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName} (
                            {member.employeeId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="recordDate">Date</Label>
                    <Input
                      id="recordDate"
                      type="date"
                      value={newRecord.date}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clockInTime">Clock In</Label>
                      <Input
                        id="clockInTime"
                        type="time"
                        value={newRecord.clockIn}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            clockIn: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="clockOutTime">Clock Out</Label>
                      <Input
                        id="clockOutTime"
                        type="time"
                        value={newRecord.clockOut}
                        onChange={(e) =>
                          setNewRecord((prev) => ({
                            ...prev,
                            clockOut: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newRecord.status}
                      onValueChange={(value) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          status: value as AttendanceStatus,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="early_leave">Early Leave</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="overtime">Overtime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newRecord.notes}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Optional notes..."
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddRecord(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddManualRecord}>Add Record</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="today">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Quick Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select
                  value={filterDepartment}
                  onValueChange={setFilterDepartment}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="quality_control">
                      Quality Control
                    </SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="administration">
                      Administration
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Today's Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>
                Today's Attendance - {formatDate(new Date().toISOString())}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStaff.map((member) => {
                  const attendance = todayAttendance.find(
                    (r) => r.staffId === member.id,
                  );
                  const isClockedIn = isStaffClockedIn(member.id);

                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {member.employeeId} •{" "}
                            {member.department.replace("_", " ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {attendance ? (
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getStatusColor(attendance.status)}
                            >
                              {getStatusIcon(attendance.status)}
                              {attendance.status
                                .replace("_", " ")
                                .toUpperCase()}
                            </Badge>

                            <div className="text-sm text-gray-600">
                              {attendance.clockIn && (
                                <span>
                                  In: {formatTime(attendance.clockIn)}
                                </span>
                              )}
                              {attendance.clockOut && (
                                <span className="ml-2">
                                  Out: {formatTime(attendance.clockOut)}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">
                            <UserX className="h-4 w-4 mr-1" />
                            NOT RECORDED
                          </Badge>
                        )}

                        <div className="flex items-center gap-2">
                          {isClockedIn ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickClockOut(member.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <UserX className="h-3 w-3 mr-1" />
                              Clock Out
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuickClockIn(member.id)}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              disabled={member.status !== "active"}
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Clock In
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Attendance for {formatDate(selectedDateString)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDateAttendance.length > 0 ? (
                    selectedDateAttendance.map((record) => {
                      const staffMember = staff.find(
                        (s) => s.id === record.staffId,
                      );
                      if (!staffMember) return null;

                      return (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {staffMember.firstName} {staffMember.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {staffMember.employeeId}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge className={getStatusColor(record.status)}>
                              {getStatusIcon(record.status)}
                              {record.status.replace("_", " ").toUpperCase()}
                            </Badge>

                            <div className="text-sm text-gray-600">
                              {record.clockIn && (
                                <span>In: {formatTime(record.clockIn)}</span>
                              )}
                              {record.clockOut && (
                                <span className="ml-2">
                                  Out: {formatTime(record.clockOut)}
                                </span>
                              )}
                            </div>

                            <div className="text-sm font-medium">
                              {record.totalHours.toFixed(1)}h
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">
                        No attendance records for this date
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Attendance Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">
                  Detailed attendance reports coming soon
                </p>
                <p className="text-sm text-gray-400">
                  Weekly, monthly, and annual attendance analytics
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceTracker;
