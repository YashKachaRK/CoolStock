import { ListOrdered , ShoppingCart , Users , LayoutDashboard, BoxIcon } from "lucide-react";

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
   {
      label: "Manage Stock",
      href: "/admin_stock_update",
      icon: BoxIcon,
    }
  ];