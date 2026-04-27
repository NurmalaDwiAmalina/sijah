export const formatRupiah = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID").replace(/,/g, ".");

export const formatDate = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const parseDate = (str: string) => {
  // Accept "yyyy-mm-dd" (HTML date input) or "dd/mm/yyyy"
  if (str.includes("-")) return new Date(str);
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
};
