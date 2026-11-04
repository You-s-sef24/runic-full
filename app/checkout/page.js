"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  Loader2,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/langStore";
import { useGetShippingRates } from "@/hooks/useShippingRates";
import { useGetNailCost } from "@/hooks/useSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import ProtectedRoutes from "@/components/routes/ProtectedRoutes";
import { checkoutSchema } from "@/lib/validation/checkout";
import { useCreateOrder } from "@/hooks/useOrders";

const getId = (item) => item._id ?? item.id;

function imageUrl(path) {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${path}`;
}

export default function CheckoutPage() {
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);
  const items = useCartStore((state) => state.cart);
  const nails = useCartStore((state) => state.nails);
  const setNails = useCartStore((state) => state.setNails);
  const removeItem = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const user = useAuthStore((state) => state.user);
  const { mutate: createOrder, isPending } = useCreateOrder();

  const { data: ratesData, isLoading: loadingRates } = useGetShippingRates();
  const rates = (ratesData?.shippingRates ?? []).filter((r) => r.isActive);
  const { data: nailPrice = 0 } = useGetNailCost();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    address: "",
    governorate: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        fullName: user.name || prev.fullName,
      }));
    }
  }, [user]);

  function getRateName(rate) {
    return (
      (lang === "en" ? rate.name?.en : rate.name?.ar) ||
      rate.name?.en ||
      rate.government
    );
  }

  const selectedRate = rates.find((r) => r.government === formData.governorate);

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0,
  );
  const shipping = selectedRate ? Number(selectedRate.price) : 0;
  const nailsFee = nails * nailPrice;
  const total = subtotal + shipping + nailsFee;

  function clearError(field) {
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  }

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    clearError(id);
  }

  function handleGovernorateChange(value) {
    setFormData((prev) => ({ ...prev, governorate: value }));
    clearError("governorate");
  }

  function getItemName(item) {
    if (item.name && typeof item.name === "object") {
      return (
        (lang === "en" ? item.name.en : item.name.ar) ||
        item.name.en ||
        t("checkout.product")
      );
    }
    return item.name || t("checkout.product");
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();

    const result = checkoutSchema().safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const shippingAddress = `${formData.fullName} - ${formData.phone}\n${formData.address}, ${formData.city}`;

    const orderPayload = {
      items: items.map((item) => ({
        productId: getId(item),
        quantity: item.quantity,
      })),
      shippingAddress,
      government: formData.governorate,
      nails,
    };

    try {
      console.log(orderPayload);

      await createOrder(orderPayload);
      clearCart();
    } catch (err) {
      toast.error(err?.response?.data?.message || t("checkout.orderError"));
    }
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
          {t("checkout.emptyCart")}{" "}
          <Link
            href="/collection"
            className="text-primary font-semibold underline underline-offset-4 hover:opacity-90"
          >
            {t("checkout.browseProducts")}
          </Link>
        </p>
      </main>
    );
  }

  return (
    <ProtectedRoutes>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 text-foreground">
        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8 tracking-wide uppercase">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("checkout.home")}
          </Link>
          <ChevronRight size={12} className="opacity-60 rtl:rotate-180" />
          <span className="text-foreground/70">{t("checkout.checkout")}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
            className="lg:col-span-7 space-y-6"
            noValidate
          >
            <Card className="border-border bg-card text-card-foreground">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    1
                  </span>
                  {t("checkout.contactInfo")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">{t("checkout.emailAddress")}</Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@email.com"
                      className="bg-background border-input"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">{t("checkout.phoneNumber")}</Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01012345678"
                      className="bg-background border-input"
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card text-card-foreground">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    2
                  </span>
                  {t("checkout.shippingAddress")}
                </h2>

                <div className="space-y-1.5">
                  <Label htmlFor="fullName">{t("checkout.fullName")}</Label>
                  <Input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Youssef Ahmed"
                    className="bg-background border-input"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address">{t("checkout.streetAddress")}</Label>
                  <Input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 El Nasr Street, Building 4, Apt 12"
                    className="bg-background border-input"
                  />
                  {errors.address && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="governorate">
                      {t("checkout.governorate")}
                    </Label>
                    <Select
                      value={formData.governorate}
                      onValueChange={handleGovernorateChange}
                      disabled={loadingRates}
                    >
                      <SelectTrigger
                        id="governorate"
                        className="w-full bg-background border-input"
                      >
                        <SelectValue
                          placeholder={t("checkout.selectGovernorate")}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border text-popover-foreground">
                        {rates.map((rate) => (
                          <SelectItem key={rate._id} value={rate.government}>
                            <div className="flex justify-between items-center w-full gap-4">
                              <span>{getRateName(rate)}</span>
                              <span className="text-xs text-muted-foreground font-mono">
                                (+{rate.price} L.E.)
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.governorate && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.governorate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">{t("checkout.cityDistrict")}</Label>
                    <Input
                      type="text"
                      id="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Nasr City"
                      className="bg-background border-input"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card text-card-foreground">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    3
                  </span>
                  {t("checkout.paymentMethod")}
                </h2>

                <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <Truck
                    className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {t("checkout.cashOnDelivery")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {t("checkout.cashOnDeliveryDesc")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>

          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <Card className="bg-muted/30 border-border text-card-foreground">
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-lg font-bold tracking-tight pb-4 border-b border-border">
                  {t("checkout.reviewOrder")}
                </h2>

                <div className="divide-y divide-border max-h-[300px] overflow-y-auto space-y-2">
                  {items.map((item) => {
                    const id = getId(item);
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-4 py-4 first:pt-4 last:pb-0"
                      >
                        <div className="relative w-14 h-14 bg-background border border-border rounded-lg flex items-center justify-center flex-shrink-0">
                          <Image
                            src={imageUrl(item.images?.[0])}
                            alt={getItemName(item)}
                            fill
                            unoptimized
                            sizes="56px"
                            className="object-contain p-1 dark:invert-0"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold truncate">
                            {getItemName(item)}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {Number(item.price).toFixed(2)} L.E.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(
                                  id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              -
                            </Button>
                            <span className="text-xs font-semibold px-1">
                              {item.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                updateQuantity(id, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="text-end flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-sm font-bold">
                            {(Number(item.price) * item.quantity).toFixed(2)}{" "}
                            L.E.
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => removeItem(id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="py-4 border-t border-b border-border my-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">
                        {t("cart.extraNails", "Extra Nails")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {nailPrice.toFixed(2)} L.E.{" "}
                        {t("cart.perNail", "per nail")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setNails(Math.max(0, nails - 1))}
                      >
                        -
                      </Button>
                      <span className="text-xs font-bold px-1">{nails}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setNails(nails + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="py-2 border-b border-border text-sm font-medium space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("checkout.subtotal")}</span>
                    <span className="text-foreground font-bold">
                      {subtotal.toFixed(2)} L.E.
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("checkout.shipping")}</span>
                    <span>
                      {!selectedRate ? (
                        <span className="text-xs text-muted-foreground italic">
                          {t(
                            "checkout.selectGovernorateFirst",
                            "Select governorate",
                          )}
                        </span>
                      ) : shipping === 0 ? (
                        <span className="text-emerald-600 font-semibold uppercase tracking-wider text-xs">
                          {t("checkout.free")}
                        </span>
                      ) : (
                        `${shipping.toFixed(2)} L.E.`
                      )}
                    </span>
                  </div>
                  {nails > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        {t("checkout.nails")} ({nails})
                      </span>
                      <span className="text-foreground font-bold">
                        {nailsFee.toFixed(2)} L.E.
                      </span>
                    </div>
                  )}
                </div>

                <div className="py-4 flex justify-between items-center">
                  <span className="text-base font-bold">
                    {t("checkout.totalDue")}
                  </span>
                  <span className="text-2xl font-extrabold text-primary tracking-tight">
                    {total.toFixed(2)} L.E.
                  </span>
                </div>

                <Button
                  type="submit"
                  form="checkout-form"
                  disabled={isPending}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-primary/10 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("checkout.placingOrder")}
                    </>
                  ) : (
                    t("checkout.placeOrder")
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="flex items-start gap-3 px-4 py-3 bg-muted/20 border border-border rounded-xl">
              <ShieldCheck
                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider">
                  {t("checkout.buyerPromiseTitle")}
                </p>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  {t("checkout.buyerPromiseDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoutes>
  );
}
