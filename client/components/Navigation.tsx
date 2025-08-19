import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Truck, Users, Factory } from "lucide-react";

interface NavigationProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Navigation = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: NavigationProps) => {
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

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 min-h-screen transition-transform duration-300 ease-in-out z-40",
        "w-64 lg:translate-x-0 lg:relative lg:flex-shrink-0",
        "fixed top-0 left-0",
        isMobileMenuOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0",
      )}
    >
     <div className="p-4 lg:p-6 border-b border-gray-200">
  <div className="flex items-center">
    <h1 className="text-lg lg:text-xl font-bold text-gray-900">
      Admin Dashboard
    </h1>
  </div>
</div>

      <nav className="mt-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 lg:px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 border-r-2 border-transparent transition-colors",
                isActive && "bg-red-50 text-red-600 border-red-600 font-medium",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm lg:text-base">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;
