/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import en from "../i18n/en.json";
import id from "../i18n/id.json";

const dict = { en, id };

function get(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const s = localStorage.getItem("lang");
      return s === "id" || s === "en" ? s : "en";
    } catch { return "en"; }
  });

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch { void 0; }
  }, [lang]);

  const t = useCallback((key) => {
    const v = get(dict[lang], key);
    if (v !== undefined) return v;
    const fallback = get(dict.en, key);
    return fallback !== undefined ? fallback : key;
  }, [lang]);

  const toggle = useCallback(() => setLang((p) => (p === "en" ? "id" : "en")), []);

  const value = useMemo(() => ({ lang, setLang, t, toggle }), [lang, t, toggle]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be inside LangProvider");
  return ctx;
}


