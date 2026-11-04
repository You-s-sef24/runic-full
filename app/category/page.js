"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import CategoryCard from "@/components/cards/CategoryCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetCategories } from "@/hooks/useCategories";

const PAGE_SIZE = 12;

export default function CategoriesPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isPending, isError, isPlaceholderData } = useGetCategories({
    page,
    limit: PAGE_SIZE,
  });
  const categories = data?.categories ?? [];
  const totalPages = data?.totalPages ?? 1;
  const hasNextPage = page < totalPages;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-foreground">
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8 tracking-wide uppercase">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("categories.home", "Home")}
        </Link>
        <ChevronRight size={12} className="opacity-60 rtl:rotate-180" />
        <span className="text-foreground/70">{t("Categories")}</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t("categories.title", "Shop By Category")}
        </h1>
      </div>

      {isPending && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-100/70 dark:bg-zinc-900/50 p-5 sm:p-6 animate-pulse"
            >
              <div className="aspect-square mb-4 bg-gray-200 dark:bg-zinc-800 rounded-md" />
              <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {t("categories.error", "Failed to load categories.")}
        </p>
      )}

      {!isPending && !isError && categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t("categories.empty", "No categories found.")}
        </p>
      )}

      {!isPending && !isError && categories.length > 0 && (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 transition-opacity ${
              isPlaceholderData ? "opacity-50" : "opacity-100"
            }`}
          >
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text={t("categories.pagination.previous", "Previous")}
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
                    text={t("categories.pagination.next", "Next")}
                    onClick={() =>
                      hasNextPage && !isPlaceholderData && setPage((p) => p + 1)
                    }
                    className={
                      !hasNextPage || isPlaceholderData
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
