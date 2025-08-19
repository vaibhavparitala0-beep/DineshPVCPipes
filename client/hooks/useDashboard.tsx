import { useState, useEffect } from "react";

interface DashboardMetrics {
  totalOrders: number;
  totalShipped: number;
  totalComplete: number;
  totalCustomers: number;
  todayOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  revenue: number;
}

interface LowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  category: string;
  priority: "low" | "medium" | "high";
}

interface NewOrder {
  id: string;
  customer: string;
  items: string;
  priority: "low" | "medium" | "high" | "urgent";
  time: string;
  amount: string;
  status: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  items: string;
  status: string;
  priority: string;
  date: string;
  amount: string;
}

interface CompletedDelivery {
  id: string;
  customer: string;
  items: string;
  deliveredDate: string;
  amount: string;
}

export const useDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 1247,
    totalShipped: 986,
    totalComplete: 923,
    totalCustomers: 156,
    todayOrders: 23,
    pendingOrders: 45,
    lowStockCount: 8,
    revenue: 1234567,
  });

  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([
    {
      id: "ITM-001",
      name: "Steel Pipes 6mm",
      currentStock: 5,
      minimumStock: 20,
      category: "steel",
      priority: "high",
    },
    {
      id: "ITM-002",
      name: "PVC Pipes 12mm",
      currentStock: 8,
      minimumStock: 25,
      category: "pvc",
      priority: "high",
    },
    {
      id: "ITM-003",
      name: "Copper Pipes 8mm",
      currentStock: 3,
      minimumStock: 15,
      category: "copper",
      priority: "high",
    },
    {
      id: "ITM-004",
      name: "Aluminum Pipes 10mm",
      currentStock: 12,
      minimumStock: 30,
      category: "aluminum",
      priority: "medium",
    },
  ]);

  const [newOrders, setNewOrders] = useState<NewOrder[]>([
    {
      id: "ORD-006",
      customer: "TechBuild Solutions",
      items: "Steel Pipes 10mm x 150m",
      priority: "high",
      time: "2 minutes ago",
      amount: "$18,500",
      status: "pending",
    },
    {
      id: "ORD-007",
      customer: "Modern Construction",
      items: "PVC Pipes 15mm x 80m",
      priority: "medium",
      time: "15 minutes ago",
      amount: "$9,200",
      status: "pending",
    },
    {
      id: "ORD-008",
      customer: "Elite Manufacturing",
      items: "Aluminum Pipes 12mm x 120m",
      priority: "urgent",
      time: "1 hour ago",
      amount: "$22,400",
      status: "confirmed",
    },
  ]);

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([
    {
      id: "ORD-001",
      customer: "ABC Construction",
      items: "Steel Pipes 6mm x 100m",
      status: "Processing",
      priority: "High",
      date: "2024-01-15",
      amount: "$15,200",
    },
    {
      id: "ORD-002",
      customer: "XYZ Industries",
      items: "PVC Pipes 12mm x 50m",
      status: "Shipped",
      priority: "Medium",
      date: "2024-01-14",
      amount: "$8,750",
    },
    {
      id: "ORD-003",
      customer: "BuildTech LLC",
      items: "Copper Pipes 8mm x 75m",
      status: "Completed",
      priority: "Low",
      date: "2024-01-13",
      amount: "$12,300",
    },
    {
      id: "ORD-004",
      customer: "Metro Pipes Co.",
      items: "Steel Pipes 10mm x 200m",
      status: "Processing",
      priority: "High",
      date: "2024-01-12",
      amount: "$25,600",
    },
    {
      id: "ORD-005",
      customer: "Global Manufacturing",
      items: "PVC Pipes 15mm x 120m",
      status: "Shipped",
      priority: "Medium",
      date: "2024-01-11",
      amount: "$11,400",
    },
  ]);

  const [completedDeliveries, setCompletedDeliveries] = useState<
    CompletedDelivery[]
  >([
    {
      id: "DEL-001",
      customer: "Premium Construction",
      items: "Steel Pipes Bundle",
      deliveredDate: "2024-01-15",
      amount: "$15,400",
    },
    {
      id: "DEL-002",
      customer: "Urban Developers",
      items: "PVC Pipes Set",
      deliveredDate: "2024-01-14",
      amount: "$8,750",
    },
    {
      id: "DEL-003",
      customer: "Industrial Works",
      items: "Copper Pipes Kit",
      deliveredDate: "2024-01-13",
      amount: "$12,300",
    },
    {
      id: "DEL-004",
      customer: "City Infrastructure",
      items: "Mixed Pipes Package",
      deliveredDate: "2024-01-12",
      amount: "$19,800",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new order notifications
      const shouldAddNewOrder = Math.random() > 0.95; // 5% chance every 30 seconds
      if (shouldAddNewOrder) {
        const newOrderData: NewOrder = {
          id: `ORD-${String(Date.now()).slice(-3)}`,
          customer: `Customer ${Math.floor(Math.random() * 1000)}`,
          items: "Mixed Pipes Order",
          priority: ["low", "medium", "high", "urgent"][
            Math.floor(Math.random() * 4)
          ] as any,
          time: "Just now",
          amount: `$${(Math.random() * 50000 + 5000).toFixed(0)}`,
          status: "pending",
        };

        setNewOrders((prev) => [newOrderData, ...prev.slice(0, 4)]);
        setMetrics((prev) => ({
          ...prev,
          totalOrders: prev.totalOrders + 1,
          todayOrders: prev.todayOrders + 1,
          pendingOrders: prev.pendingOrders + 1,
        }));
      }

      // Update stock levels occasionally
      const shouldUpdateStock = Math.random() > 0.98; // 2% chance
      if (shouldUpdateStock) {
        setLowStockItems((prev) =>
          prev.map((item) => ({
            ...item,
            currentStock: Math.max(
              0,
              item.currentStock - Math.floor(Math.random() * 3),
            ),
          })),
        );
      }

      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setLoading(false);
  };

  return {
    metrics,
    lowStockItems,
    newOrders,
    recentOrders,
    completedDeliveries,
    loading,
    lastUpdated,
    refreshData,
  };
};
