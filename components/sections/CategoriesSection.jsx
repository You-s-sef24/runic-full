"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowLeft } from "lucide-react";
import CategoryCard from "../cards/CategoryCard";
import { useGetCategories } from "@/hooks/useCategories";

export default function CategorySection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { data, isPending, isError } = useGetCategories({ page: 1, limit: 5 });
  const categories = data?.categories || [];

  if (isPending) {
    return (
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-full sm:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.25rem)] rounded-xl bg-gray-100/70 dark:bg-zinc-900/50 p-5 sm:p-6 animate-pulse"
          >
            <div className="aspect-square mb-4 bg-gray-200 dark:bg-zinc-800 rounded-md" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        {t("categories.error")}
      </p>
    );
  }

  return (
    <section className="py-2 sm:py-6">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t("categories.title")}
        </h2>
        <Link
          href="/category"
          className="group flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
        >
          <span>{t("categories.viewAll", "View All")}</span>
          {isRtl ? (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </Link>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="w-full sm:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.25rem)]"
          >
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
}
