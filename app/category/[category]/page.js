"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/cards/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useLanguageStore } from "@/store/langStore";
import { useGetProductsByCategory } from "@/hooks/useProducts";

const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  {
    value: "newest",
    labelKey: "categoryProducts.sortOptions.newest",
    sortBy: "createdAt",
    order: "desc",
  },
  {
    value: "priceLowToHigh",
    labelKey: "categoryProducts.sortOptions.priceLowToHigh",
    sortBy: "price",
    order: "asc",
  },
  {
    value: "priceHighToLow",
    labelKey: "categoryProducts.sortOptions.priceHighToLow",
    sortBy: "price",
    order: "desc",
  },
];

export default function CategoryProductsPage() {
  const { category } = useParams();
  const { t } = useTranslation();
  const lang = useLanguageStore((s) => s.language);

  const [page, setPage] = useState(1);
  const [sortValue, setSortValue] = useState("newest");

  const selectedOption =
    SORT_OPTIONS.find((o) => o.value === sortValue) || SORT_OPTIONS[0];

  const { data, isLoading, isError, isPlaceholderData } =
    useGetProductsByCategory({
      categoryId: category,
      page,
      limit: PAGE_SIZE,
      sortBy: selectedOption.sortBy,
      order: selectedOption.order,
    });
  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;

  const categoryName = data?.name;
  const title =
    (lang === "en" ? categoryName?.en : categoryName?.ar) ||
    categoryName?.en ||
    "";

  function handleSortChange(value) {
    setSortValue(value);
    setPage(1);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-foreground">
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8 tracking-wide uppercase">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("categoryProducts.home")}
        </Link>
        <ChevronRight size={12} className="opacity-60 rtl:rotate-180" />
        <Link href="/category" className="hover:text-primary transition-colors">
          {t("Categories")}
        </Link>
        <ChevronRight size={12} className="opacity-60 rtl:rotate-180" />
        <span className="text-foreground/70 truncate max-w-[180px]">
          {title}
        </span>
      </nav>

      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {title}
        </h1>

        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[200px] bg-background border-input text-foreground">
            <SelectValue placeholder={t("categoryProducts.sortBy")}>
              {t(selectedOption.labelKey)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-popover border-border text-popover-foreground">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border p-4 animate-pulse bg-card text-card-foreground"
            >
              <div className="aspect-[3/4] mb-4 bg-muted rounded-xl" />
              <div className="h-3 w-16 bg-muted rounded mb-2" />
              <div className="h-4 w-32 bg-muted rounded mb-2" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 bg-destructive/5 border border-destructive/10 rounded-2xl">
          <p className="text-sm text-destructive font-medium">
            {t("categoryProducts.error")}
          </p>
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/10">
          <p className="text-sm text-muted-foreground font-medium">
            {t("categoryProducts.noProducts")}
          </p>
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity ${
              isPlaceholderData ? "opacity-50" : "opacity-100"
            }`}
          >
            {products.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text={t("categoryProducts.pagination.previous")}
                    onClick={() =>
                      page > 1 && !isPlaceholderData && setPage((p) => p - 1)
                    }
                    className={
                      page === 1 || isPlaceholderData
                        ? "pointer-events-none opacity-40 text-muted-foreground"
                        : "cursor-pointer hover:bg-muted text-foreground transition-colors"
                    }
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink isActive>
                    {page} / {totalPages}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    text={t("categoryProducts.pagination.next")}
                    onClick={() =>
                      page < totalPages &&
                      !isPlaceholderData &&
                      setPage((p) => p + 1)
                    }
                    className={
                      page >= totalPages || isPlaceholderData
                        ? "pointer-events-none opacity-40 text-muted-foreground"
                        : "cursor-pointer hover:bg-muted text-foreground transition-colors"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </main>
  );
}
