export interface Item {
  id: string;
  name: string;
  description: string;
  category: "steel" | "pvc" | "copper" | "aluminum" | "other";
  diameter: number; // in mm
  length: number; // in meters
  thickness?: number; // in mm
  price: number; // per unit
  stockQuantity: number;
  minimumStock: number;
  image?: string; // base64 or URL
  specifications: {
    material: string;
    grade?: string;
    pressure?: string; // e.g., "200 PSI"
    temperature?: string; // e.g., "-20°C to 80°C"
  };
  supplier?: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "discontinued" | "out_of_stock";
}

export interface ItemFormData {
  name: string;
  description: string;
  category: Item["category"];
  diameter: number;
  length: number;
  thickness?: number;
  price: number;
  stockQuantity: number;
  minimumStock: number;
  image?: File | string;
  specifications: {
    material: string;
    grade?: string;
    pressure?: string;
    temperature?: string;
  };
  supplier?: string;
  status: Item["status"];
}

export interface ItemFilters {
  category?: Item["category"];
  status?: Item["status"];
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
}
