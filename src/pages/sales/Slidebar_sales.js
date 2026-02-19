import { LayoutDashboard, ShoppingCart, Package } from "lucide-react";

export const salesMenuItems = [
  {
    label: "Dashboard",
    href: "/sale_dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "New Orders",
    href: "/new_orders",
    icon: Package, // Use Package for inventory
  },
  {
    label: "Orders",
    href: "/sale_orders",
    icon: ShoppingCart, // Use ShoppingCart for selling
  },
];