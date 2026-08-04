"use client";

import { forwardRef, useMemo } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

/** Default UAE country code for public forms */
export const PHONE_COUNTRY_CODE = "+971";
/** Max local digits after country code */
export const PHONE_LOCAL_MAX = 10;
/** Min local digits when phone is required */
export const PHONE_LOCAL_MIN = 7;

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

/** Strip code if typed; return local part capped at 10 digits */
export function toLocalPhone(value: string) {
  let digits = digitsOnly(value);
  // Drop leading country digits if user pastes full international number
  if (digits.startsWith("971")) digits = digits.slice(3);
  // UAE locals often typed with leading 0
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, PHONE_LOCAL_MAX);
}

export function toFullPhone(local: string) {
  const l = toLocalPhone(local);
  return l ? `${PHONE_COUNTRY_CODE}${l}` : "";
}

export function localFromFull(full: string | undefined) {
  if (!full) return "";
  return toLocalPhone(full);
}

export const phoneRequiredSchema = z
  .string()
  .min(1, "Phone is required")
  .refine((v) => {
    const local = localFromFull(v);
    return local.length >= PHONE_LOCAL_MIN && local.length <= PHONE_LOCAL_MAX;
  }, `Enter ${PHONE_LOCAL_MIN}–${PHONE_LOCAL_MAX} digits after +971`);

export const phoneOptionalSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .refine((v) => {
    if (!v) return true;
    const local = localFromFull(v);
    if (local.length === 0) return true;
    return local.length >= PHONE_LOCAL_MIN && local.length <= PHONE_LOCAL_MAX;
  }, `Enter ${PHONE_LOCAL_MIN}–${PHONE_LOCAL_MAX} digits after +971`);

type PhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
};

/**
 * Phone input: fixed +971 prefix, max 10 local digits.
 * Emits full value as +971XXXXXXXXXX (or empty when local is empty).
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput(
    {
      value = "",
      onChange,
      onBlur,
      name,
      id,
      className,
      disabled,
      required,
      placeholder = "50 123 4567",
    },
    ref
  ) {
    const local = useMemo(() => localFromFull(value), [value]);

    return (
      <div
        className={cn(
          "flex w-full items-center border-b border-line bg-transparent transition focus-within:border-pink",
          className
        )}
      >
        <span
          className="select-none py-3 pr-2 text-sm font-medium text-ink"
          aria-hidden
        >
          {PHONE_COUNTRY_CODE}
        </span>
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          name={name}
          id={id}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          maxLength={PHONE_LOCAL_MAX}
          value={local}
          onBlur={onBlur}
          onChange={(e) => {
            const next = toLocalPhone(e.target.value);
            onChange?.(next ? `${PHONE_COUNTRY_CODE}${next}` : "");
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text");
            const next = toLocalPhone(pasted);
            onChange?.(next ? `${PHONE_COUNTRY_CODE}${next}` : "");
          }}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
          aria-label={`Phone number, country code ${PHONE_COUNTRY_CODE}`}
        />
      </div>
    );
  }
);
