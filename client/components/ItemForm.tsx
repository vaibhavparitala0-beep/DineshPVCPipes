import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useItems } from '@/hooks/useItems';
import { ItemFormData, Item } from '@shared/items';
import { Plus, Upload, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ItemFormProps {
  item?: Item;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

const ItemForm = ({ item, onClose, trigger }: ItemFormProps) => {
  const { addItem, updateItem, isLoading } = useItems();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    category: 'steel',
    diameter: 0,
    length: 0,
    thickness: 0,
    price: 0,
    stockQuantity: 0,
    minimumStock: 0,
    specifications: {
      material: '',
      grade: '',
      pressure: '',
      temperature: ''
    },
    supplier: '',
    status: 'active'
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        category: item.category,
        diameter: item.diameter,
        length: item.length,
        thickness: item.thickness || 0,
        price: item.price,
        stockQuantity: item.stockQuantity,
        minimumStock: item.minimumStock,
        specifications: item.specifications,
        supplier: item.supplier || '',
        status: item.status
      });
      if (item.image) {
        setImagePreview(item.image);
      }
    }
  }, [item]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ItemFormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (item) {
        await updateItem(item.id, formData);
        toast({
          title: "Success",
          description: "Item updated successfully!",
        });
      } else {
        await addItem(formData);
        toast({
          title: "Success", 
          description: "Item added successfully!",
        });
      }
      
      setOpen(false);
      onClose?.();
      
      // Reset form if adding new item
      if (!item) {
        setFormData({
          name: '',
          description: '',
          category: 'steel',
          diameter: 0,
          length: 0,
          thickness: 0,
          price: 0,
          stockQuantity: 0,
          minimumStock: 0,
          specifications: {
            material: '',
            grade: '',
            pressure: '',
            temperature: ''
          },
          supplier: '',
          status: 'active'
        });
        setImagePreview('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const defaultTrigger = (
    <Button className="bg-red-600 hover:bg-red-700 text-white">
      <Plus className="h-4 w-4 mr-2" />
      Add New Item
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {item ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="e.g., Steel Pipe Standard"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Item description..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steel">Steel</SelectItem>
                      <SelectItem value="pvc">PVC</SelectItem>
                      <SelectItem value="copper">Copper</SelectItem>
                      <SelectItem value="aluminum">Aluminum</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="diameter">Diameter (mm) *</Label>
                    <Input
                      id="diameter"
                      type="number"
                      value={formData.diameter}
                      onChange={(e) => handleInputChange('diameter', parseFloat(e.target.value))}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="length">Length (m) *</Label>
                    <Input
                      id="length"
                      type="number"
                      value={formData.length}
                      onChange={(e) => handleInputChange('length', parseFloat(e.target.value))}
                      required
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="thickness">Thickness (mm)</Label>
                  <Input
                    id="thickness"
                    type="number"
                    value={formData.thickness}
                    onChange={(e) => handleInputChange('thickness', parseFloat(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="material">Material *</Label>
                  <Input
                    id="material"
                    value={formData.specifications.material}
                    onChange={(e) => handleInputChange('specifications.material', e.target.value)}
                    required
                    placeholder="e.g., Carbon Steel"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      value={formData.specifications.grade}
                      onChange={(e) => handleInputChange('specifications.grade', e.target.value)}
                      placeholder="e.g., Grade A"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pressure">Pressure Rating</Label>
                    <Input
                      id="pressure"
                      value={formData.specifications.pressure}
                      onChange={(e) => handleInputChange('specifications.pressure', e.target.value)}
                      placeholder="e.g., 300 PSI"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="temperature">Temperature Range</Label>
                  <Input
                    id="temperature"
                    value={formData.specifications.temperature}
                    onChange={(e) => handleInputChange('specifications.temperature', e.target.value)}
                    placeholder="e.g., -20°C to 120°C"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Stock */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Pricing & Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Price per Unit ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value))}
                      required
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="minimumStock">Minimum Stock *</Label>
                    <Input
                      id="minimumStock"
                      type="number"
                      value={formData.minimumStock}
                      onChange={(e) => handleInputChange('minimumStock', parseInt(e.target.value))}
                      required
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    placeholder="e.g., SteelCorp Industries"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Item Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <div className="mt-2">
                    <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload image</p>
                      </div>
                      <input
                        id="image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, image: undefined }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;
