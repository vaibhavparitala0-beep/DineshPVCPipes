import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import { exportOrdersReport, exportStaffReport } from "@/lib/pdfExport";
import { Order, OrderStatus, Priority } from "@shared/orders";
import { Staff, StaffRole, Department, EmploymentStatus } from "@shared/staff";

// Mock data for testing
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customer: {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "555-0123",
      company: "ABC Construction",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
    },
    items: [
      {
        id: "1",
        itemId: "ITEM-001",
        name: "Steel Pipes 6mm",
        category: "steel",
        diameter: 6,
        length: 100,
        quantity: 50,
        unitPrice: 25.0,
        totalPrice: 1250.0,
        specifications: {
          material: "Carbon Steel",
          grade: "A106",
          pressure: "200 PSI",
        },
      },
    ],
    status: "processing" as OrderStatus,
    priority: "high" as Priority,
    paymentStatus: "paid",
    totalAmount: 1250.0,
    subtotal: 1200.0,
    tax: 50.0,
    shippingCost: 0.0,
    shipping: {
      method: "Standard",
      carrier: "FedEx",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
      cost: 0.0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [],
    assignedTo: "Mike Wilson",
  },
];

const mockStaff: Staff[] = [
  {
    id: "1",
    employeeId: "EMP-001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phone: "555-0123",
    role: "machine_operator" as StaffRole,
    department: "production" as Department,
    jobTitle: "Senior Machine Operator",
    hireDate: "2023-01-15",
    salary: 55000,
    status: "active" as EmploymentStatus,
    address: {
      street: "456 Oak Ave",
      city: "Worktown",
      state: "CA",
      zipCode: "12346",
      country: "USA",
    },
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "555-0124",
    },
    shift: "day",
    workingHours: {
      startTime: "08:00",
      endTime: "17:00",
      breakDuration: 60,
    },
    roles: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "admin",
  },
];

const PDFExportTest = () => {
  const handleTestOrdersExport = () => {
    exportOrdersReport(mockOrders, { includeStats: true });
  };

  const handleTestStaffExport = () => {
    exportStaffReport(mockStaff, undefined, { includeStats: true });
  };

  const handleTestStaffWithAttendance = () => {
    // Mock attendance records
    const mockAttendance = [
      {
        id: "1",
        staffId: "1",
        date: new Date().toISOString().split("T")[0],
        clockIn: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        clockOut: new Date().toISOString(),
        status: "present" as const,
        totalHours: 8,
        overtimeHours: 0,
        isManualEntry: false,
      },
    ];

    exportStaffReport(mockStaff, mockAttendance, { includeStats: true });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PDF Export Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleTestOrdersExport}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Test Orders Export
          </Button>

          <Button
            onClick={handleTestStaffExport}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Test Staff Export
          </Button>

          <Button
            onClick={handleTestStaffWithAttendance}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            Test Staff + Attendance
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Test Results</h4>
          <p className="text-sm text-gray-600">
            Click the buttons above to test PDF generation. Each button will
            download a PDF file with sample data to verify the export
            functionality is working correctly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFExportTest;
