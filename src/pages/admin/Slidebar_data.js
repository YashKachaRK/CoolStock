import { ListOrdered , ShoppingCart , Users , LayoutDashboard } from "lucide-react";

 export const menuItems = [
    {
      label: "Dashboard",
      href: "/admin_dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Salesman",
      href: "/admin_users",
      icon: Users,
    },
    {
      label: "Products",
      href: "/admin_product",
      icon: ShoppingCart ,
    },
    {
      label:"Orders",
      href:"/admin_orders",
      icon: ListOrdered
    },
  ];