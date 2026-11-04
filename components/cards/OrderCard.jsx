import { CheckCircle2, Clock, Hammer } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { t } from "i18next";
import { useLanguageStore } from "@/store/langStore";
import { calculateOrderTotal } from "@/lib/calculateOrderTotal";
import { Button } from "../ui/button";
import { getOrderItemThumbnail } from "@/utils/Images";

const STATUS_CONFIG = {
  pending: {
    bg: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    icon: <Clock className="w-4 h-4 stroke-[2.5]" />,
  },
  delivered: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    icon: <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />,
  },
};

export default function OrderCard({ order }) {
  const lang = useLanguageStore((state) => state.language);

  return (
    <div
      key={order._id}
      className="border border-zinc-100 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-xs overflow-hidden transition-all duration-300 hover:border-zinc-200 dark:hover:border-zinc-700"
    >
      <div className="bg-zinc-50/50 dark:bg-zinc-900/50 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-4 items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span>
            {t("orders.placed")}{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              {new Date(order.createdAt * 1000).toLocaleDateString(
                lang === "ar" ? "ar-EG" : "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </strong>
          </span>
          <span>
            {t("orders.id")}{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">
              #{order._id}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div>
            {t("orders.total")}{" "}
            <strong className="text-zinc-950 dark:text-zinc-100 text-sm font-bold">
              {calculateOrderTotal(order).toFixed(2)} L.E.
            </strong>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize ${
              (STATUS_CONFIG[order.status] || STATUS_CONFIG.pending).bg
            }`}
          >
            {(STATUS_CONFIG[order.status] || STATUS_CONFIG.pending).icon}
            {t(`orders.status.${order.status}`, {
              defaultValue: order.status,
            })}
          </span>
        </div>
      </div>

      {order.items.length > 0 && (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {order.items.map((item, i) => {
            const itemName =
              typeof item.name === "object"
                ? lang === "en"
                  ? item.name?.en
                  : item.name?.ar
                : item.name;
            const thumbnail = getOrderItemThumbnail(item?.image);

            return (
              <div
                key={`${order._id}-${i}`}
                className="p-5 flex items-start gap-4"
              >
                <div className="relative w-16 h-20 rounded bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex-shrink-0 overflow-hidden">
                  <Image
                    src={thumbnail}
                    alt={itemName || "Product"}
                    fill
                    unoptimized
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm leading-tight hover:text-zinc-600 dark:hover:text-zinc-400 truncate">
                    <Link href={`/collection/${item.productId}`}>
                      {itemName}
                    </Link>
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                    <span>
                      {t("orders.qty")}{" "}
                      <strong className="text-zinc-700 dark:text-zinc-300">
                        {item.quantity}
                      </strong>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span>
                      {t("orders.unitPrice")}{" "}
                      <strong className="text-zinc-700 dark:text-zinc-300">
                        {item.price.toFixed(2)} L.E.
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 self-center">
                  <Link href={`/collection/${item.productId}`}>
                    <Button
                      variant="outline"
                      className="text-xs font-semibold py-1.5 px-3 h-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      {t("orders.buyAgain")}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 space-y-1">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {t("orders.shippingTo")}{" "}
          <span className="text-zinc-700 dark:text-zinc-300">
            {order.shippingAddress}
          </span>
        </p>
        {order.nails > 0 && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Hammer className="w-3 h-3" />
            {t("orders.nailsIncluded")}{" "}
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              {order.nails}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
