"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { User, Save, ArrowLeft, Globe, Moon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useLanguageStore } from "@/store/langStore";
import ProtectedRoutes from "@/components/routes/ProtectedRoutes";
import { useTranslation } from "react-i18next";
import { useUpdateProfile } from "@/hooks/useAuth";

const settingsSchema = z
  .object({
    name: z.string().trim().min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number"),
    currentPassword: z.string(),
    newPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && data.newPassword.length < 8) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "New password must be at least 8 characters",
      });
    }
    if (data.newPassword && !data.currentPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["currentPassword"],
        message: "Enter your current password to set a new one",
      });
    }
    if (data.currentPassword && !data.newPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "Enter the new password",
      });
    }
  });

export default function SettingsPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const lang = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});

  // fill the form once the persisted user is available, and again after a save
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const unchanged =
    form.name.trim() === (user?.name ?? "") &&
    form.email.trim() === (user?.email ?? "") &&
    form.phone.trim() === (user?.phone ?? "") &&
    !form.newPassword &&
    !form.currentPassword;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const result = settingsSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0];
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const payload = {
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
    };
    // password fields are sent only when the user is changing it
    if (form.newPassword) {
      payload.currentPassword = form.currentPassword;
      payload.newPassword = form.newPassword;
    }

    updateProfile(payload, {
      onSuccess: () =>
        setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" })),
    });
  }

  return (
    <ProtectedRoutes>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-wider mb-4"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />{" "}
            {t("settings.backToHome")}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="space-y-8">
          <Card className="border-zinc-100 dark:border-zinc-800">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <Globe className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                  {t("settings.preferencesAppearance")}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="dark:text-zinc-300">
                    {t("settings.language")}
                  </Label>
                  <Select value={lang} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full dark:text-zinc-100 dark:bg-zinc-900/50">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        {t("settings.englishOption")}
                      </SelectItem>
                      <SelectItem value="ar">
                        {t("settings.arabicOption")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 dark:text-zinc-300">
                    <Moon size={13} /> {t("settings.displayTheme")}
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-full dark:text-zinc-100 dark:bg-zinc-900/50">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        {t("settings.lightMode")}
                      </SelectItem>
                      <SelectItem value="dark">
                        {t("settings.darkMode")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} noValidate>
            <Card className="border-zinc-100 dark:border-zinc-800">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <User className="w-4 h-4 text-blue-900 dark:text-blue-400" />
                  <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                    {t("settings.personalProfile")}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="dark:text-zinc-300">
                      {t("settings.fullName")}
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="dark:text-zinc-100 dark:bg-zinc-900/50"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="dark:text-zinc-300">
                      {t("settings.phoneNumber")}
                    </Label>
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="dark:text-zinc-100 dark:bg-zinc-900/50"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="email" className="dark:text-zinc-300">
                      {t("settings.emailAddress")}
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="dark:text-zinc-100 dark:bg-zinc-900/50"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t(
                      "settings.passwordHint",
                      "Leave the password fields empty to keep your current password.",
                    )}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="currentPassword"
                        className="dark:text-zinc-300"
                      >
                        {t("settings.currentPassword")}
                      </Label>
                      <Input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        autoComplete="current-password"
                        value={form.currentPassword}
                        onChange={handleChange}
                        className="dark:text-zinc-100 dark:bg-zinc-900/50"
                      />
                      {errors.currentPassword && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="newPassword"
                        className="dark:text-zinc-300"
                      >
                        {t("settings.newPassword")}
                      </Label>
                      <Input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        autoComplete="new-password"
                        value={form.newPassword}
                        onChange={handleChange}
                        className="dark:text-zinc-100 dark:bg-zinc-900/50"
                      />
                      {errors.newPassword && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isPending || unchanged}
                    className="bg-blue-900 hover:bg-blue-950 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider gap-2 px-5 py-2 disabled:opacity-60 cursor-pointer"
                  >
                    <Save size={14} />{" "}
                    {isPending
                      ? `${t("settings.saving")}`
                      : `${t("settings.saveProfile")}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </ProtectedRoutes>
  );
}
