import { createContext, useContext, useState, ReactNode } from 'react';
import { Item, ItemFormData, ItemFilters } from '@shared/items';

interface ItemsContextType {
  items: Item[];
  filteredItems: Item[];
  filters: ItemFilters;
  isLoading: boolean;
  addItem: (item: ItemFormData) => Promise<void>;
  updateItem: (id: string, item: ItemFormData) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setFilters: (filters: ItemFilters) => void;
  searchItems: (term: string) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

// Mock data for demonstration
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Steel Pipe Standard',
    description: 'High-grade steel pipe for industrial use',
    category: 'steel',
    diameter: 25,
    length: 6,
    thickness: 2.5,
    price: 45.50,
    stockQuantity: 150,
    minimumStock: 20,
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjIwMHgyMDA8L3RleHQ+Cjwvc3ZnPg==',
    specifications: {
      material: 'Carbon Steel',
      grade: 'Grade A',
      pressure: '300 PSI',
      temperature: '-20°C to 120°C'
    },
    supplier: 'SteelCorp Industries',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'PVC Pipe Residential',
    description: 'Lightweight PVC pipe for residential plumbing',
    category: 'pvc',
    diameter: 32,
    length: 4,
    thickness: 3.0,
    price: 12.75,
    stockQuantity: 300,
    minimumStock: 50,
    specifications: {
      material: 'PVC',
      pressure: '200 PSI',
      temperature: '0°C to 60°C'
    },
    supplier: 'PlasticPro Ltd',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
    status: 'active'
  },
  {
    id: '3',
    name: 'Copper Pipe Premium',
    description: 'Premium copper pipe for heating systems',
    category: 'copper',
    diameter: 15,
    length: 3,
    thickness: 1.0,
    price: 28.90,
    stockQuantity: 75,
    minimumStock: 15,
    specifications: {
      material: 'Copper',
      grade: 'Type L',
      pressure: '400 PSI',
      temperature: '-40°C to 200°C'
    },
    supplier: 'CopperWorks Inc',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10',
    status: 'active'
  }
];

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [filters, setFilters] = useState<ItemFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const filteredItems = items.filter(item => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.minPrice && item.price < filters.minPrice) return false;
    if (filters.maxPrice && item.price > filters.maxPrice) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.specifications.material.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const addItem = async (itemData: ItemFormData): Promise<void> => {
    setIsLoading(true);
    try {
      // Convert image file to base64 if it's a File
      let imageData = itemData.image;
      if (itemData.image instanceof File) {
        imageData = await fileToBase64(itemData.image);
      }

      const newItem: Item = {
        id: Date.now().toString(),
        ...itemData,
        image: imageData as string,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      
      setItems(prev => [...prev, newItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: string, itemData: ItemFormData): Promise<void> => {
    setIsLoading(true);
    try {
      let imageData = itemData.image;
      if (itemData.image instanceof File) {
        imageData = await fileToBase64(itemData.image);
      }

      setItems(prev => prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              ...itemData, 
              image: imageData as string,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : item
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      setItems(prev => prev.filter(item => item.id !== id));
    } finally {
      setIsLoading(false);
    }
  };

  const searchItems = (term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };

  return (
    <ItemsContext.Provider value={{
      items,
      filteredItems,
      filters,
      isLoading,
      addItem,
      updateItem,
      deleteItem,
      setFilters,
      searchItems
    }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
