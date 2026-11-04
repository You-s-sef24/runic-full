"use client";

import { useEffect } from "react";
import i18n from "@/i18n";
import { useLanguageStore } from "@/store/langStore";

export default function I18nInitializer() {
  const lang = useLanguageStore((state) => state.language);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    if (i18n.resolvedLanguage !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return null;
}
