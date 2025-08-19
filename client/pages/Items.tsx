import Layout from "@/components/Layout";

export default function Items() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Items Management</h1>
          <p className="text-gray-600">Add, edit, and manage pipe inventory items</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600">Items management functionality will be available here.</p>
            <p className="text-sm text-gray-500 mt-2">Continue prompting to have this page implemented.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
