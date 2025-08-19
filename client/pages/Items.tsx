import Layout from "@/components/Layout";
import { ItemsProvider } from "@/hooks/useItems";
import ItemForm from "@/components/ItemForm";
import ItemsTable from "@/components/ItemsTable";

function ItemsContent() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Items Management</h1>
            <p className="text-gray-600">Add, edit, and manage pipe inventory items</p>
          </div>
          <ItemForm />
        </div>

        {/* Items Table */}
        <ItemsTable />
      </div>
    </Layout>
  );
}

export default function Items() {
  return (
    <ItemsProvider>
      <ItemsContent />
    </ItemsProvider>
  );
}
