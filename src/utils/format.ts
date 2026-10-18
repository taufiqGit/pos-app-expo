/** Format angka ke Rupiah, mis. 18500 → "Rp 18.500" */
export function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

/** Format qty (bisa desimal, maks 3 tempat): 1.75 → "1,75", 2 → "2" */
export function formatQty(value: number): string {
  return (Math.round(value * 1000) / 1000).toLocaleString("id-ID", {
    maximumFractionDigits: 3,
  });
}
