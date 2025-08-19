# PDF Export Functionality

This document explains how to use the PDF export features added to the Order Tracking and Staff Management sections.

## Features

### 📋 Order Reports
- **Export All Orders**: Generate a complete PDF report of all orders
- **Export Current View**: Export orders from the current filtered/tabbed view
- **Export Selected Orders**: Export only the orders you've selected
- **Comprehensive Data**: Includes order details, customer info, status, priority, and summary statistics

### 👥 Staff Reports  
- **Export Staff Directory**: Generate a PDF report of all staff members
- **Export with Attendance**: Include attendance records in the staff report
- **Export Selected Staff**: Export only the staff members you've selected
- **Rich Data**: Includes employee details, roles, departments, salaries, and attendance summaries

## How to Use

### Order Tracking Page
1. **Export All Orders**: Click "Export All Orders" button in the search header
2. **Export Current View**: Click "Export Current View" button to export filtered results
3. **Export Selected**: Select orders using checkboxes, then click "Export Selected" in the bulk actions bar

### Staff Management Page
1. **Export Staff Report**: Click "Export Staff Report" button in the search header
2. **Export with Attendance**: Click "Export with Attendance" for detailed reports
3. **Export Selected**: Select staff using checkboxes, then click "Export Selected" in the bulk actions bar

### Attendance Tracking
1. **Export Attendance Report**: Click "Export Attendance Report" button in the tabs section
2. **Includes**: Staff attendance records, total hours, days present/absent, and summary statistics

## PDF Report Contents

### Order Reports Include:
- Company header with logo and generation date
- Summary statistics (total orders, revenue, status breakdown)
- Detailed order table with:
  - Order number and customer details
  - Item quantities and pricing
  - Status and priority (color-coded)
  - Assigned staff and dates
- Footer with page numbers and confidentiality notice

### Staff Reports Include:
- Company header with generation information
- Staff summary statistics (total staff, departments, active/inactive counts)
- Detailed staff directory with:
  - Employee ID and contact information
  - Department and role assignments
  - Salary and hire date information
  - Employment status
- Optional attendance summary with:
  - Days present/absent per employee
  - Total hours worked
  - Late arrival tracking

## Technical Implementation

### Libraries Used
- **jsPDF**: Core PDF generation library
- **jsPDF-AutoTable**: Advanced table formatting and styling

### Key Components
- `PDFExporter` class: Main export functionality
- `exportOrdersReport()`: Orders export utility
- `exportStaffReport()`: Staff export utility
- `exportSelectedOrders()`: Selected orders export

### Customization Options
- Include/exclude statistics sections
- Date range filtering
- Custom styling and themes
- Company branding and headers

## File Naming Convention
- Orders: `orders-report-YYYY-MM-DD.pdf`
- Staff: `staff-report-YYYY-MM-DD.pdf`

## Browser Support
- Works in all modern browsers
- Requires JavaScript enabled
- Downloads automatically when generated

## Example Usage in Code

```typescript
import { exportOrdersReport, exportStaffReport } from '@/lib/pdfExport';

// Export orders with statistics
exportOrdersReport(orders, { 
  includeStats: true,
  dateRange: { from: '2024-01-01', to: '2024-12-31' }
});

// Export staff with attendance
exportStaffReport(staff, attendanceRecords, { 
  includeStats: true 
});
```

## Future Enhancements
- Custom report templates
- Email integration for sending reports
- Scheduled report generation
- Additional export formats (Excel, CSV)
- Advanced filtering and grouping options
