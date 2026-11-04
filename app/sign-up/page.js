"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signUpSchema } from "@/lib/validation/auth";
import { useRegister } from "@/hooks/useAuth";
import GuestRoutes from "@/components/routes/GuestRoutes";

export default function SignUpPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const { mutate: registerUser, isPending } = useRegister(formData);

  function handleSignUp(e) {
    e.preventDefault();

    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    registerUser(formData);
  }

  return (
    <GuestRoutes>
      <main className="min-h-[85vh] flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-[0.2em] text-blue-900 dark:text-zinc-100 uppercase"
            >
              Runic
            </Link>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              {t("auth.signUpTagline")}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight mb-6">
              {t("auth.signUpTitle")}
            </h2>

            <form onSubmit={handleSignUp} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                >
                  {t("auth.fullName")}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-900/50 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                    placeholder="Youssef Ahmed"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                >
                  {t("auth.emailAddress")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-900/50 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                    placeholder="name@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                >
                  {t("auth.phoneNumber")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-900/50 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                    placeholder="01012345678"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                >
                  {t("auth.password")}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800 rounded-lg text-sm text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-900/50 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all"
                    placeholder={t("auth.createPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-950 dark:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.98] text-white rounded-xl py-3 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-lg shadow-blue-900/15 dark:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending
                  ? t("auth.creatingAccount")
                  : t("auth.createAccount")}
                {!isPending && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 dark:text-zinc-400 mt-6">
              {t("auth.haveAccount")}{" "}
              <Link
                href="/sign-in"
                className="font-bold text-blue-900 dark:text-blue-400 hover:text-blue-950 dark:hover:text-blue-300 underline transition-colors"
              >
                {t("nav.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </main>
    </GuestRoutes>
  );
}
