import { fr, type TranslationKey } from "./fr";

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type LocaleKey = NestedKeyOf<TranslationKey>;

const dictionaries = { fr } as const;

let currentLocale: keyof typeof dictionaries = "fr";

export function setLocale(locale: keyof typeof dictionaries) {
  currentLocale = locale;
}

export function t(key: string, params?: Record<string, string>): string {
  const parts = key.split(".");
  let value: unknown = dictionaries[currentLocale];
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key;
    }
  }
  if (typeof value !== "string") return key;
  if (!params) return value;
  return Object.entries(params).reduce(
    (acc, [param, replacement]) => acc.replace(`{${param}}`, replacement),
    value,
  );
}

export function useT() {
  return { t, locale: currentLocale };
}
