"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/store/cartStore";
import { useLanguageStore } from "@/store/langStore";
import { useGetNailCost } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const getId = (item) => item._id ?? item.id;

function imageUrl(path) {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${path}`;
}

export default function CartPage() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);

  const items = useCartStore((state) => state.cart);
  const nails = useCartStore((state) => state.nails);
  const setNails = useCartStore((state) => state.setNails);
  const removeItem = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const { data: nailPrice = 0, isLoading: loadingNailPrice } = useGetNailCost();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nailsTotal = nails * nailPrice;
  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );

  function getItemName(item) {
    if (item.name && typeof item.name === "object") {
      return (
        (lang === "en" ? item.name.en : item.name.ar) || item.name.en || ""
      );
    }
    return item.name || "";
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-4">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/40" />
        </div>
        <h1 className="text-xl font-bold mb-2">
          {t("cart.emptyTitle", "Your cart is empty")}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {t(
            "cart.emptyDesc",
            "Looks like you haven't added anything to your cart yet.",
          )}
        </p>
        <Button asChild>
          <Link href="/collection">
            {t("cart.continueShopping", "Continue Shopping")}
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">
        {t("cart.title", "Shopping Cart")}
      </h1>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const id = getId(item);
            return (
              <Card key={id} className="border-border bg-card">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={imageUrl(item.images?.[0])}
                      alt={getItemName(item)}
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate">
                      {getItemName(item)}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Number(item.price).toFixed(2)} L.E.
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(id, Math.max(1, item.quantity - 1))
                        }
                      >
                        -
                      </Button>
                      <span className="text-xs font-semibold px-2">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="text-end flex flex-col items-end gap-2">
                    <span className="text-sm font-bold">
                      {(Number(item.price) * item.quantity).toFixed(2)} L.E.
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => removeItem(id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-border bg-card">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  {t("cart.extraNails", "Extra Nails")}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {loadingNailPrice ? "..." : nailPrice.toFixed(2)} L.E.{" "}
                  {t("cart.perNail", "per nail")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setNails(Math.max(0, nails - 1))}
                >
                  -
                </Button>
                <span className="text-sm font-bold px-2">{nails}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setNails(nails + 1)}
                >
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold border-b border-border pb-3">
                {t("cart.summary", "Order Summary")}
              </h2>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("cart.subtotal", "Subtotal")}
                </span>
                <span className="font-bold">{subtotal.toFixed(2)} L.E.</span>
              </div>

              {nails > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("cart.nails", "Extra Nails")} ({nails})
                  </span>
                  <span className="font-bold">
                    {nailsTotal.toFixed(2)} L.E.
                  </span>
                </div>
              )}

              <div className="flex justify-between text-xs text-muted-foreground border-b border-border pb-3">
                <span>{t("cart.shipping", "Shipping")}</span>
                <span>
                  {t("cart.calculatedAtCheckout", "Calculated at checkout")}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold pt-1">
                <span>{t("cart.total", "Total")}</span>
                <span>{(subtotal + nailsTotal).toFixed(2)} L.E.</span>
              </div>

              <Button asChild className="w-full mt-4" size="lg">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2"
                >
                  {t("cart.proceedToCheckout", "Proceed to Checkout")}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
