"use client";
import { t } from "i18next";
import { z } from "zod";

export const checkoutSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, t("checkout.errors.emailRequired"))
      .email(t("checkout.errors.emailInvalid")),
    phone: z
      .string()
      .min(1, t("checkout.errors.phoneRequired"))
      .regex(/^01[0125][0-9]{8}$/, t("checkout.errors.phoneInvalid")),
    fullName: z.string().min(3, t("checkout.errors.fullNameMin")),
    address: z.string().min(5, t("checkout.errors.addressMin")),
    governorate: z.string().min(1, t("checkout.errors.governorateRequired")),
    city: z.string().min(2, t("checkout.errors.cityRequired")),
  });
