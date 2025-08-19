import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useItems } from '@/hooks/useItems';
import { Item } from '@shared/items';
import ItemForm from './ItemForm';
import { Search, Edit, Trash2, Package, AlertTriangle, DollarSign, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ItemsTable = () => {
  const { filteredItems, filters, setFilters, searchItems, deleteItem, isLoading } = useItems();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchItems(term);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value === 'all' ? undefined : value });
  };

  const handleDelete = async (item: Item) => {
    try {
      await deleteItem(item.id);
      toast({
        title: "Success",
        description: `${item.name} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Item['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'discontinued':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'out_of_stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: Item['category']) => {
    switch (category) {
      case 'steel':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pvc':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'copper':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'aluminum':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isLowStock = (item: Item) => item.stockQuantity <= item.minimumStock;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="pvc">PVC</SelectItem>
                <SelectItem value="copper">Copper</SelectItem>
                <SelectItem value="aluminum">Aluminum</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({});
                  searchItems('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-600">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Items Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Specifications</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category.toUpperCase()}
                      </Badge>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{item.diameter}mm × {item.length}m</p>
                        <p className="text-gray-600">{item.specifications.material}</p>
                        {item.thickness && (
                          <p className="text-gray-500">{item.thickness}mm thick</p>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className={cn(
                          "flex items-center gap-1 mb-1",
                          isLowStock(item) && "text-red-600"
                        )}>
                          {isLowStock(item) && <AlertTriangle className="h-3 w-3" />}
                          <span className="font-medium">{item.stockQuantity}</span>
                        </div>
                        <p className="text-gray-500">Min: {item.minimumStock}</p>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <ItemForm
                          item={item}
                          trigger={
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Item</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{item.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500">No items found</p>
                        {searchTerm && (
                          <p className="text-sm text-gray-400">
                            Try adjusting your search or filters
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemsTable;
