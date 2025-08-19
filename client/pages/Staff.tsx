import Layout from "@/components/Layout";
import { StaffProvider } from "@/hooks/useStaff";
import StaffForm from "@/components/StaffForm";
import StaffList from "@/components/StaffList";
import AttendanceTracker from "@/components/AttendanceTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock, BarChart3 } from "lucide-react";

function StaffContent() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
              <p className="text-gray-600">Manage factory staff, roles, and attendance tracking</p>
            </div>
          </div>
          <StaffForm />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="staff" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff Directory
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Attendance Tracking
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Time Sheets & Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="staff">
            <StaffList />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTracker />
          </TabsContent>

          <TabsContent value="reports">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Sheets & Reports</h3>
              <p className="text-gray-600 mb-4">Advanced reporting features coming soon</p>
              <p className="text-sm text-gray-500">
                Weekly time sheets, payroll reports, and performance analytics
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default function Staff() {
  return (
    <StaffProvider>
      <StaffContent />
    </StaffProvider>
  );
}
