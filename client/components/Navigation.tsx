import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Truck, Users, Factory } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Items Management",
      href: "/items",
      icon: Package,
    },
    {
      name: "Order Tracking",
      href: "/orders",
      icon: Truck,
    },
    {
      name: "Staff Management",
      href: "/staff",
      icon: Users,
    },
  ];

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Factory className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Pipes Manufacturing</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 border-r-2 border-transparent",
                isActive && "bg-red-50 text-red-600 border-red-600 font-medium",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
