"use client";

import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import ProtectedRoutes from "@/components/routes/ProtectedRoutes";
import { useGetUserOrders } from "@/hooks/useOrders";
import OrderCard from "@/components/cards/OrderCard";

export default function OrdersPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useGetUserOrders(user?._id);
  const orders = data?.orders || [];
  console.log(orders);

  return (
    <ProtectedRoutes>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8">
          <Link
            href="/collection"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-wider mb-4"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />{" "}
            {t("orders.backToShop")}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t("orders.title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {t("orders.subtitle")}
          </p>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center py-10">
            {t("orders.error")}
          </p>
        )}

        {!isLoading && !isError && orders.length === 0 && (
          <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20">
            <Package className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4 stroke-[1.5]" />
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-base">
              {t("orders.noOrdersTitle")}
            </h3>
            <p className="text-zinc-400 dark:text-zinc-500 text-xs mt-1 max-w-[280px] mx-auto">
              {t("orders.noOrdersSubtitle")}
            </p>
            <Link href="/collection" className="inline-block mt-5">
              <Button className="bg-blue-900 hover:bg-blue-950 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5">
                {t("orders.startShopping")}
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </main>
    </ProtectedRoutes>
  );
}
