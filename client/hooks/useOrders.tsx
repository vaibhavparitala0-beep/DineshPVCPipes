import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Order, OrderFilters, OrderStats, BulkAction, OrderStatus, Priority, StatusHistory } from '@shared/orders';

interface OrdersContextType {
  orders: Order[];
  filteredOrders: Order[];
  filters: OrderFilters;
  selectedOrders: string[];
  isLoading: boolean;
  stats: OrderStats;
  setFilters: (filters: OrderFilters) => void;
  searchOrders: (term: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<void>;
  updateOrderPriority: (orderId: string, priority: Priority) => Promise<void>;
  assignOrder: (orderId: string, assignedTo: string) => Promise<void>;
  selectOrder: (orderId: string) => void;
  selectAllOrders: () => void;
  clearSelection: () => void;
  performBulkAction: (action: BulkAction) => Promise<void>;
  getOrder: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust1',
      name: 'John Smith',
      email: 'john@abcconstruction.com',
      phone: '+1-555-0123',
      company: 'ABC Construction Ltd.',
      address: {
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
    items: [
      {
        id: 'item1',
        itemId: '1',
        name: 'Steel Pipe Standard',
        category: 'steel',
        diameter: 25,
        length: 6,
        quantity: 50,
        unitPrice: 45.50,
        totalPrice: 2275.00,
        specifications: {
          material: 'Carbon Steel',
          grade: 'Grade A',
          pressure: '300 PSI'
        }
      }
    ],
    status: 'processing',
    priority: 'high',
    paymentStatus: 'paid',
    totalAmount: 2520.75,
    subtotal: 2275.00,
    tax: 195.75,
    shippingCost: 50.00,
    shipping: {
      method: 'Standard Delivery',
      carrier: 'FedEx',
      trackingNumber: 'FX123456789',
      estimatedDelivery: '2024-01-25',
      address: {
        street: '456 Construction Site Rd',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        country: 'USA'
      },
      cost: 50.00
    },
    notes: 'Customer requested expedited processing',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-16',
    dueDate: '2024-01-22',
    estimatedCompletion: '2024-01-20',
    statusHistory: [
      {
        id: 'hist1',
        status: 'pending',
        timestamp: '2024-01-15T09:00:00Z',
        updatedBy: 'System',
        notes: 'Order created'
      },
      {
        id: 'hist2',
        status: 'confirmed',
        timestamp: '2024-01-15T10:30:00Z',
        updatedBy: 'Sarah Johnson',
        notes: 'Payment confirmed, order approved'
      },
      {
        id: 'hist3',
        status: 'processing',
        timestamp: '2024-01-16T08:00:00Z',
        updatedBy: 'Mike Wilson',
        notes: 'Started manufacturing process'
      }
    ],
    assignedTo: 'Mike Wilson',
    tags: ['urgent', 'large-order']
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'cust2',
      name: 'Maria Garcia',
      email: 'maria@xyzsupply.com',
      phone: '+1-555-0456',
      company: 'XYZ Supply Inc.',
      address: {
        street: '789 Industrial Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      }
    },
    items: [
      {
        id: 'item2',
        itemId: '2',
        name: 'PVC Pipe Residential',
        category: 'pvc',
        diameter: 32,
        length: 4,
        quantity: 100,
        unitPrice: 12.75,
        totalPrice: 1275.00,
        specifications: {
          material: 'PVC',
          pressure: '200 PSI'
        }
      }
    ],
    status: 'shipped',
    priority: 'medium',
    paymentStatus: 'paid',
    totalAmount: 1377.00,
    subtotal: 1275.00,
    tax: 102.00,
    shippingCost: 0.00,
    shipping: {
      method: 'Express Delivery',
      carrier: 'UPS',
      trackingNumber: 'UPS987654321',
      estimatedDelivery: '2024-01-18',
      address: {
        street: '321 Warehouse District',
        city: 'Long Beach',
        state: 'CA',
        zipCode: '90802',
        country: 'USA'
      },
      cost: 0.00
    },
    createdAt: '2024-01-12',
    updatedAt: '2024-01-16',
    dueDate: '2024-01-20',
    statusHistory: [
      {
        id: 'hist4',
        status: 'pending',
        timestamp: '2024-01-12T14:00:00Z',
        updatedBy: 'System',
        notes: 'Order created'
      },
      {
        id: 'hist5',
        status: 'confirmed',
        timestamp: '2024-01-12T15:20:00Z',
        updatedBy: 'Tom Brown',
        notes: 'Payment verified'
      },
      {
        id: 'hist6',
        status: 'processing',
        timestamp: '2024-01-13T09:00:00Z',
        updatedBy: 'Lisa Chen',
        notes: 'In production queue'
      },
      {
        id: 'hist7',
        status: 'quality_check',
        timestamp: '2024-01-15T11:00:00Z',
        updatedBy: 'Quality Team',
        notes: 'Passed quality inspection'
      },
      {
        id: 'hist8',
        status: 'shipped',
        timestamp: '2024-01-16T16:30:00Z',
        updatedBy: 'Shipping Dept',
        notes: 'Package dispatched via UPS'
      }
    ],
    assignedTo: 'Lisa Chen',
    tags: ['repeat-customer']
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'cust3',
      name: 'Robert Johnson',
      email: 'robert@buildtech.com',
      phone: '+1-555-0789',
      company: 'BuildTech Solutions',
      address: {
        street: '456 Tech Park Dr',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'USA'
      }
    },
    items: [
      {
        id: 'item3',
        itemId: '3',
        name: 'Copper Pipe Premium',
        category: 'copper',
        diameter: 15,
        length: 3,
        quantity: 25,
        unitPrice: 28.90,
        totalPrice: 722.50,
        specifications: {
          material: 'Copper',
          grade: 'Type L',
          pressure: '400 PSI'
        }
      }
    ],
    status: 'delivered',
    priority: 'low',
    paymentStatus: 'paid',
    totalAmount: 787.92,
    subtotal: 722.50,
    tax: 57.80,
    shippingCost: 7.62,
    shipping: {
      method: 'Ground Shipping',
      carrier: 'USPS',
      trackingNumber: 'USPS456789123',
      estimatedDelivery: '2024-01-15',
      actualDelivery: '2024-01-14',
      address: {
        street: '789 Project Site Lane',
        city: 'Round Rock',
        state: 'TX',
        zipCode: '78664',
        country: 'USA'
      },
      cost: 7.62
    },
    createdAt: '2024-01-08',
    updatedAt: '2024-01-14',
    statusHistory: [
      {
        id: 'hist9',
        status: 'pending',
        timestamp: '2024-01-08T10:00:00Z',
        updatedBy: 'System',
        notes: 'Order placed'
      },
      {
        id: 'hist10',
        status: 'confirmed',
        timestamp: '2024-01-08T11:15:00Z',
        updatedBy: 'Jenny Adams',
        notes: 'Order confirmed and scheduled'
      },
      {
        id: 'hist11',
        status: 'processing',
        timestamp: '2024-01-09T08:30:00Z',
        updatedBy: 'Production Team',
        notes: 'Manufacturing started'
      },
      {
        id: 'hist12',
        status: 'shipped',
        timestamp: '2024-01-12T14:00:00Z',
        updatedBy: 'Shipping Dept',
        notes: 'Shipped via USPS Ground'
      },
      {
        id: 'hist13',
        status: 'delivered',
        timestamp: '2024-01-14T16:45:00Z',
        updatedBy: 'System',
        notes: 'Package delivered and signed for'
      }
    ],
    assignedTo: 'Jenny Adams'
  }
];

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (filters.status && filters.status.length > 0 && !filters.status.includes(order.status)) return false;
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(order.priority)) return false;
      if (filters.paymentStatus && filters.paymentStatus.length > 0 && !filters.paymentStatus.includes(order.paymentStatus)) return false;
      if (filters.customer && !order.customer.name.toLowerCase().includes(filters.customer.toLowerCase()) && 
          !order.customer.company.toLowerCase().includes(filters.customer.toLowerCase())) return false;
      if (filters.orderNumber && !order.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase())) return false;
      if (filters.assignedTo && order.assignedTo !== filters.assignedTo) return false;
      if (filters.minAmount && order.totalAmount < filters.minAmount) return false;
      if (filters.maxAmount && order.totalAmount > filters.maxAmount) return false;
      if (filters.dateFrom && new Date(order.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(order.createdAt) > new Date(filters.dateTo)) return false;
      
      return true;
    });
  }, [orders, filters]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => ['confirmed', 'processing', 'manufacturing', 'quality_check', 'ready_to_ship'].includes(o.status)).length;
    const shipped = orders.filter(o => ['shipped', 'in_transit', 'out_for_delivery'].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => ['cancelled', 'returned'].includes(o.status)).length;
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = totalRevenue / Math.max(orders.filter(o => o.paymentStatus === 'paid').length, 1);

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
      averageOrderValue
    };
  }, [orders]);

  const searchOrders = (term: string) => {
    setFilters(prev => ({ 
      ...prev, 
      customer: term,
      orderNumber: term 
    }));
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string): Promise<void> => {
    setIsLoading(true);
    try {
      setOrders(prev => prev.map(order => {
        if (order.id === orderId) {
          const newHistoryEntry: StatusHistory = {
            id: Date.now().toString(),
            status,
            timestamp: new Date().toISOString(),
            updatedBy: 'Admin User',
            notes
          };
          
          return {
            ...order,
            status,
            updatedAt: new Date().toISOString().split('T')[0],
            statusHistory: [...order.statusHistory, newHistoryEntry]
          };
        }
        return order;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderPriority = async (orderId: string, priority: Priority): Promise<void> => {
    setIsLoading(true);
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, priority, updatedAt: new Date().toISOString().split('T')[0] }
          : order
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const assignOrder = async (orderId: string, assignedTo: string): Promise<void> => {
    setIsLoading(true);
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, assignedTo, updatedAt: new Date().toISOString().split('T')[0] }
          : order
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const selectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    setSelectedOrders(filteredOrders.map(order => order.id));
  };

  const clearSelection = () => {
    setSelectedOrders([]);
  };

  const performBulkAction = async (action: BulkAction): Promise<void> => {
    setIsLoading(true);
    try {
      switch (action.type) {
        case 'update_status':
          if (action.value) {
            for (const orderId of action.orderIds) {
              await updateOrderStatus(orderId, action.value as OrderStatus, 'Bulk status update');
            }
          }
          break;
        case 'assign_to':
          if (action.value) {
            for (const orderId of action.orderIds) {
              await assignOrder(orderId, action.value);
            }
          }
          break;
        // Add more bulk actions as needed
      }
      clearSelection();
    } finally {
      setIsLoading(false);
    }
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      filteredOrders,
      filters,
      selectedOrders,
      isLoading,
      stats,
      setFilters,
      searchOrders,
      updateOrderStatus,
      updateOrderPriority,
      assignOrder,
      selectOrder,
      selectAllOrders,
      clearSelection,
      performBulkAction,
      getOrder
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
