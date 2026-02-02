import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export const salesMenuItems = [
  {
    label: "Dashboard",
    href: "/sale_dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Inventory",
    href: "/sale_inventory",
    icon: Package, // Use Package for inventory
  },
  {
    label: "New Sale",
    href: "/sale_orders",
    icon: ShoppingCart, // Use ShoppingCart for selling
  },
];