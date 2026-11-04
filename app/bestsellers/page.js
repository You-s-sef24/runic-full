"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronRight, TrendingUp } from "lucide-react";
import ProductCard from "@/components/cards/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetBestSellingProducts } from "@/hooks/useProducts";

const PAGE_SIZE = 10;

export default function BestSellersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isPending, isError } = useGetBestSellingProducts({
    page,
    limit: PAGE_SIZE,
  });
  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;
  const hasNextPage = page < totalPages;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-zinc-500 mb-8 tracking-wide uppercase">
        <Link
          href="/"
          className="hover:text-blue-900 dark:hover:text-zinc-100 transition-colors"
        >
          {t("bestsellers.home")}
        </Link>
        <ChevronRight size={12} className="opacity-60 rtl:rotate-180" />
        <span className="text-gray-600 dark:text-zinc-400 truncate max-w-[180px]">
          {t("bestsellers.title")}
        </span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-600 dark:text-blue-400">
            {t("bestsellers.badge")}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-100">
          {t("bestsellers.title")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
          {t("bestsellers.subtitle")}
        </p>
      </div>

      {isPending && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 animate-pulse"
            >
              <div className="aspect-[3/4] mb-4 bg-gray-100 dark:bg-zinc-800/60 rounded-md" />
              <div className="h-3 w-16 bg-gray-100 dark:bg-zinc-800/60 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-100 dark:bg-zinc-800/60 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-100 dark:bg-zinc-800/60 rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {t("bestsellers.error")}
        </p>
      )}

      {!isPending && !isError && products.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          {t("bestsellers.noProducts")}
        </p>
      )}

      {!isPending && !isError && products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <div key={product._id} className="relative">
                <span className="absolute top-2 start-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-blue-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold shadow-md">
                  #{(page - 1) * PAGE_SIZE + index + 1}
                </span>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text={t("collection.pagination.previous")}
                    onClick={() => page > 1 && setPage((p) => p - 1)}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-40 text-gray-400 dark:text-zinc-600"
                        : "cursor-pointer text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }
                  />
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink
                    isActive
                    className="bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-950"
                  >
                    {page} / {totalPages}
                  </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    text={t("collection.pagination.next")}
                    onClick={() => hasNextPage && setPage((p) => p + 1)}
                    className={
                      !hasNextPage
                        ? "pointer-events-none opacity-40 text-gray-400 dark:text-zinc-600"
                        : "cursor-pointer text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
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
