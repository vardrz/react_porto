export function pickLangField(obj, base, lang) {
  if (!obj) return "";
  const key = `${base}_${lang}`;
  return obj[key] ?? obj[`${base}_en`] ?? obj[base] ?? "";
}
