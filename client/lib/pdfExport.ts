import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order, OrderStatus, Priority } from "@shared/orders";
import { Staff, AttendanceRecord, StaffRole, Department } from "@shared/staff";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface ExportOptions {
  includeCompanyLogo?: boolean;
  includeStats?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

export class PDFExporter {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private addCompanyHeader(title: string) {
    // Company Logo/Header
    this.doc.setFontSize(24);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Pipes Manufacturing", this.margin, 30);

    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "normal");
    this.doc.text("Admin Dashboard Report", this.margin, 40);

    // Report Title
    this.doc.setFontSize(18);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(title, this.margin, 60);

    // Date Generated
    this.doc.setFontSize(10);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      this.margin,
      70,
    );

    // Add line separator
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, 75, this.pageWidth - this.margin, 75);

    return 85; // Return Y position for next content
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  private getStatusColor(status: OrderStatus): [number, number, number] {
    switch (status) {
      case "pending":
        return [255, 235, 59]; // Yellow
      case "confirmed":
        return [33, 150, 243]; // Blue
      case "processing":
        return [156, 39, 176]; // Purple
      case "shipped":
        return [33, 150, 243]; // Blue
      case "delivered":
        return [76, 175, 80]; // Green
      case "cancelled":
        return [244, 67, 54]; // Red
      default:
        return [158, 158, 158]; // Gray
    }
  }

  private getPriorityColor(priority: Priority): [number, number, number] {
    switch (priority) {
      case "urgent":
        return [244, 67, 54]; // Red
      case "high":
        return [255, 152, 0]; // Orange
      case "medium":
        return [255, 235, 59]; // Yellow
      case "low":
        return [76, 175, 80]; // Green
      default:
        return [158, 158, 158]; // Gray
    }
  }

  public exportOrdersReport(
    orders: Order[],
    options: ExportOptions = {},
  ): void {
    let yPosition = this.addCompanyHeader("Orders Report");

    // Summary Statistics
    if (options.includeStats !== false) {
      const stats = this.calculateOrderStats(orders);
      yPosition = this.addOrderStats(stats, yPosition + 10);
    }

    // Date Range
    if (options.dateRange) {
      this.doc.setFontSize(10);
      this.doc.text(
        `Report Period: ${this.formatDate(options.dateRange.from)} - ${this.formatDate(options.dateRange.to)}`,
        this.margin,
        yPosition + 10,
      );
      yPosition += 20;
    }

    // Orders Table
    const tableData = orders.map((order) => [
      order.orderNumber,
      order.customer.name,
      order.customer.company,
      order.items.length.toString(),
      order.status.replace("_", " ").toUpperCase(),
      order.priority.toUpperCase(),
      this.formatCurrency(order.totalAmount),
      this.formatDate(order.createdAt),
      order.assignedTo || "Unassigned",
    ]);

    autoTable(this.doc, {
      startY: yPosition + 10,
      head: [
        [
          "Order #",
          "Customer",
          "Company",
          "Items",
          "Status",
          "Priority",
          "Total",
          "Date",
          "Assigned To",
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 53, 69], // Red theme matching app
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Order #
        1: { cellWidth: 25 }, // Customer
        2: { cellWidth: 30 }, // Company
        3: { cellWidth: 12 }, // Items
        4: { cellWidth: 20 }, // Status
        5: { cellWidth: 15 }, // Priority
        6: { cellWidth: 20 }, // Total
        7: { cellWidth: 20 }, // Date
        8: { cellWidth: 25 }, // Assigned To
      },
      didParseCell: (data) => {
        // Color code status column
        if (data.column.index === 4 && data.section === "body") {
          const status = orders[data.row.index]?.status;
          if (status) {
            const color = this.getStatusColor(status);
            data.cell.styles.fillColor = color;
          }
        }
        // Color code priority column
        if (data.column.index === 5 && data.section === "body") {
          const priority = orders[data.row.index]?.priority;
          if (priority) {
            const color = this.getPriorityColor(priority);
            data.cell.styles.fillColor = color;
          }
        }
      },
    });

    this.addFooter();
    this.doc.save(
      `orders-report-${new Date().toISOString().split("T")[0]}.pdf`,
    );
  }

  private calculateOrderStats(orders: Order[]) {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) =>
        ["confirmed", "processing", "manufacturing"].includes(o.status),
      ).length,
      shipped: orders.filter((o) =>
        ["shipped", "in_transit", "out_for_delivery"].includes(o.status),
      ).length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) =>
        ["cancelled", "returned"].includes(o.status),
      ).length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue:
        orders.length > 0
          ? orders.reduce((sum, order) => sum + order.totalAmount, 0) /
            orders.length
          : 0,
    };
  }

  private addOrderStats(stats: any, yPosition: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Summary Statistics", this.margin, yPosition);

    yPosition += 15;

    const statsData = [
      ["Total Orders", stats.total.toString()],
      ["Pending", stats.pending.toString()],
      ["Processing", stats.processing.toString()],
      ["Shipped", stats.shipped.toString()],
      ["Delivered", stats.delivered.toString()],
      ["Cancelled/Returned", stats.cancelled.toString()],
      ["Total Revenue", this.formatCurrency(stats.totalRevenue)],
      ["Average Order Value", this.formatCurrency(stats.averageOrderValue)],
    ];

    autoTable(this.doc, {
      startY: yPosition,
      body: statsData,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50 },
        1: { cellWidth: 30 },
      },
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  public exportStaffReport(
    staff: Staff[],
    attendanceRecords?: AttendanceRecord[],
    options: ExportOptions = {},
  ): void {
    let yPosition = this.addCompanyHeader("Staff Report");

    // Staff Summary Statistics
    if (options.includeStats !== false) {
      const stats = this.calculateStaffStats(staff);
      yPosition = this.addStaffStats(stats, yPosition + 10);
    }

    // Staff Directory Table
    const tableData = staff.map((member) => [
      member.employeeId,
      `${member.firstName} ${member.lastName}`,
      member.email,
      member.department.replace("_", " ").toUpperCase(),
      member.role.replace("_", " ").toUpperCase(),
      member.jobTitle,
      this.formatCurrency(member.salary),
      member.status.replace("_", " ").toUpperCase(),
      this.formatDate(member.hireDate),
    ]);

    autoTable(this.doc, {
      startY: yPosition + 10,
      head: [
        [
          "Employee ID",
          "Name",
          "Email",
          "Department",
          "Role",
          "Job Title",
          "Salary",
          "Status",
          "Hire Date",
        ],
      ],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 53, 69], // Red theme matching app
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Employee ID
        1: { cellWidth: 30 }, // Name
        2: { cellWidth: 35 }, // Email
        3: { cellWidth: 25 }, // Department
        4: { cellWidth: 25 }, // Role
        5: { cellWidth: 25 }, // Job Title
        6: { cellWidth: 20 }, // Salary
        7: { cellWidth: 15 }, // Status
        8: { cellWidth: 20 }, // Hire Date
      },
    });

    // Attendance Summary if provided
    if (attendanceRecords && attendanceRecords.length > 0) {
      this.addAttendanceSummary(attendanceRecords, staff);
    }

    this.addFooter();
    this.doc.save(`staff-report-${new Date().toISOString().split("T")[0]}.pdf`);
  }

  private calculateStaffStats(staff: Staff[]) {
    return {
      total: staff.length,
      active: staff.filter((s) => s.status === "active").length,
      inactive: staff.filter((s) => s.status === "inactive").length,
      onLeave: staff.filter((s) => s.status === "on_leave").length,
      avgSalary:
        staff.length > 0
          ? staff.reduce((sum, s) => sum + s.salary, 0) / staff.length
          : 0,
      departments: [...new Set(staff.map((s) => s.department))].length,
      newHires: staff.filter((s) => {
        const hireDate = new Date(s.hireDate);
        const now = new Date();
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
        return hireDate >= monthAgo;
      }).length,
    };
  }

  private addStaffStats(stats: any, yPosition: number): number {
    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Staff Summary", this.margin, yPosition);

    yPosition += 15;

    const statsData = [
      ["Total Staff", stats.total.toString()],
      ["Active", stats.active.toString()],
      ["Inactive", stats.inactive.toString()],
      ["On Leave", stats.onLeave.toString()],
      ["Departments", stats.departments.toString()],
      ["New Hires (This Month)", stats.newHires.toString()],
      ["Average Salary", this.formatCurrency(stats.avgSalary)],
    ];

    autoTable(this.doc, {
      startY: yPosition,
      body: statsData,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 50 },
        1: { cellWidth: 30 },
      },
    });

    return (this.doc as any).lastAutoTable.finalY + 10;
  }

  private addAttendanceSummary(
    records: AttendanceRecord[],
    staff: Staff[],
  ): void {
    // Add new page if needed
    if ((this.doc as any).lastAutoTable.finalY > this.pageHeight - 100) {
      this.doc.addPage();
    }

    let yPosition = (this.doc as any).lastAutoTable.finalY + 20;

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Attendance Summary", this.margin, yPosition);

    yPosition += 15;

    // Group records by staff
    const attendanceByStaff = records.reduce(
      (acc, record) => {
        if (!acc[record.staffId]) {
          acc[record.staffId] = [];
        }
        acc[record.staffId].push(record);
        return acc;
      },
      {} as Record<string, AttendanceRecord[]>,
    );

    const attendanceData = Object.entries(attendanceByStaff).map(
      ([staffId, staffRecords]) => {
        const staffMember = staff.find((s) => s.id === staffId);
        const totalHours = staffRecords.reduce(
          (sum, record) => sum + record.totalHours,
          0,
        );
        const daysPresent = staffRecords.filter(
          (r) => r.status === "present",
        ).length;
        const daysAbsent = staffRecords.filter(
          (r) => r.status === "absent",
        ).length;

        return [
          staffMember
            ? `${staffMember.firstName} ${staffMember.lastName}`
            : "Unknown",
          staffMember?.employeeId || "N/A",
          daysPresent.toString(),
          daysAbsent.toString(),
          totalHours.toFixed(1),
          staffRecords.filter((r) => r.status === "late").length.toString(),
        ];
      },
    );

    autoTable(this.doc, {
      startY: yPosition,
      head: [
        [
          "Employee",
          "ID",
          "Days Present",
          "Days Absent",
          "Total Hours",
          "Late Days",
        ],
      ],
      body: attendanceData,
      theme: "striped",
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: 255,
        fontStyle: "bold",
      },
    });
  }

  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setFont("helvetica", "normal");
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth - 40,
        this.pageHeight - 10,
      );
      this.doc.text(
        "Pipes Manufacturing - Confidential",
        this.margin,
        this.pageHeight - 10,
      );
    }
  }

  public exportSelectedOrders(orderIds: string[], allOrders: Order[]): void {
    const selectedOrders = allOrders.filter((order) =>
      orderIds.includes(order.id),
    );
    this.exportOrdersReport(selectedOrders, { includeStats: true });
  }
}

// Utility functions for quick exports
export const exportOrdersReport = (
  orders: Order[],
  options?: ExportOptions,
) => {
  const exporter = new PDFExporter();
  exporter.exportOrdersReport(orders, options);
};

export const exportStaffReport = (
  staff: Staff[],
  attendanceRecords?: AttendanceRecord[],
  options?: ExportOptions,
) => {
  const exporter = new PDFExporter();
  exporter.exportStaffReport(staff, attendanceRecords, options);
};

export const exportSelectedOrders = (
  orderIds: string[],
  allOrders: Order[],
) => {
  const exporter = new PDFExporter();
  exporter.exportSelectedOrders(orderIds, allOrders);
};

export default PDFExporter;
