import { LayoutDashboard, ShoppingBag, Receipt } from "lucide-react";

export const salesMenuItems = [
  {
    label: "Sales Dashboard",
    href: "/sale_dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Inventory",
    href: "/sale_inventory",
    icon: ShoppingBag,
  },
  {
    label: "New Sale",
    href: "/sale_orders",
    icon: Receipt,
  },
];