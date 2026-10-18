# Plan Redesign SmartPOS (pos-app-expo)

Redesign tampilan POS App dari tema lama (indigo gelap, tidak konsisten antar screen) ke design baru dari mockup HTML. Dikerjakan bertahap per fase, tiap task punya acceptance criteria sebelum lanjut ke task berikutnya.

## 1. Sumber Design (mockup HTML)

| File HTML | Judul | Target route di codebase |
|---|---|---|
| `kasir.html` | Kasir (grid produk) | `src/app/(tabs)/cashier.tsx` |
| `kasir-order.html` | Order Review | `src/app/kasir/order-review.tsx` (baru) |
| `kasir-pay.html` | Metode Pembayaran | `src/app/kasir/payment.tsx` (baru) |
| `kasir-order-confirm.html` | Order Confirmation | `src/app/kasir/success.tsx` (baru) |
| `history-sales.html` | Riwayat Penjualan | `src/app/(tabs)/transaction-history.tsx` |
| `draft-order.html` | Pesanan Tersimpan (Draft) | `src/app/(tabs)/saved-orders.tsx` |
| `setting.html` | Pengaturan | `src/app/(tabs)/settings.tsx` |
| — (tidak ada HTML) | Shift | `src/app/(tabs)/shift-history.tsx` (theme-only) |

Semua HTML memakai NavigationBar komponen yang sama → satu implementasi di `(tabs)/_layout.tsx`.

## 2. Keputusan Desain (default, bisa diubah)

1. **Currency**: mockup pakai `$`, app existing pakai `Rp` + `toLocaleString("id-ID")` → **tetap Rp** agar konsisten dengan data & backend.
2. **Bahasa UI**: mengikuti mockup (campuran Indonesia, label tab: Kasir / Draft / Sales / Shift / Setting).
3. **Icon**: mockup memakai **Lucide** → pakai `lucide-react-native` (butuh `react-native-svg`) agar 1:1 dengan design. Ionicons hanya untuk screen legacy yang belum di-redesign.
4. **Font**: Plus Jakarta Sans via `@expo-google-fonts/plus-jakarta-sans` + `expo-font` (weight 400/500/600/700).
5. **Dark mode**: out of scope (mockup light-only; toggle di setting.html di-skip / non-fungsional).
6. **Styling**: tetap RN `StyleSheet` (tidak menambah NativeWind) — token di `src/theme/` sesuai pedoman `.agents/skills/expo-design-system`.
7. **View-transition CSS** di HTML → di RN digantikan animasi native Stack (`slide`/`fade`), tidak direplikasi manual.

## 3. Design Tokens (Tailwind mockup → `src/theme/`)

```
src/theme/
  colors.ts      # brand + neutral + status
  spacing.ts     # 4pt grid: xs4 sm8 md12 lg16 xl20 xxl24
  typography.ts  # ramp: 10/12/14/16/18/20/24/30 + variant Text component
  radius.ts      # sm8 md12 lg16 xl20 card24 hero32 full9999
  shadows.ts     # card / raised (floating bar) / overlay
  motion.ts      # press 0.98, fade 250ms
  index.ts
```

| Token | Nilai (dari mockup) |
|---|---|
| `primary` | `#F49E4A` |
| `primaryDark` | `#E88D36` |
| `bg` (cream) | `#F5F1E8` |
| `card` | `#FFFFFF` |
| `ink` (gray-900, teks utama & tombol dark) | `#111827` |
| `textSecondary` (gray-500) | `#6B7280` |
| `muted` (gray-400) | `#9CA3AF` |
| `cardBorder` (orange-50/50) | `#FEF3E2` |
| `success` | `#16A34A` (+ bg `#F0FDF4`) |
| `danger` | `#EF4444` (+ bg `#FEF2F2`) |
| `infoBlue` / `infoPurple` | `#3B82F6` / `#8B5CF6` (tint bg `#EFF6FF` / `#F5F3FF`) |

Aturan (dari `expo-design-system`): komponen import token, tidak ada hardcode hex di screen; `borderCurve: "continuous"`; pressed feedback wajib (`Pressable` style fn + scale 0.98); safe-area via `react-native-safe-area-context` (pengganti `pt-14`/`pb-[34px]`).

## 4. Fase & Task

### FASE 0 — Fondasi (theme, font, icon, tab bar)

- [ ] **Task 0.1 — Dependencies**
  - `npx expo install lucide-react-native react-native-svg @expo-google-fonts/plus-jakarta-sans`
  - AC: app masih jalan, tidak ada error install.

- [ ] **Task 0.2 — Buat `src/theme/`**
  - File: `src/theme/{colors,spacing,typography,radius,shadows,motion,index}.ts` sesuai tabel di atas.
  - AC: `import { colors, radius } from "@/theme"` resolve (cek path alias `@/` di tsconfig; tambah bila belum ada).

- [ ] **Task 0.3 — Font & StatusBar global**
  - File: `src/app/_layout.tsx` — load font via `useFonts`, gate render sampai font siap, `StatusBar style="dark"` (bg light).
  - AC: text di semua screen memakai Plus Jakarta Sans; splash/loader tetap berfungsi.

- [ ] **Task 0.4 — Primitif bersama** (`src/components/`)
  - `ui/ThemedText.tsx` (variant: micro-10, xs, sm, body, title, price, hero)
  - `ui/Button.tsx` (variant: primary-orange / dark / white-ghost / danger-soft; size sm/md/lg; state pressed/disabled/loading)
  - `ui/Badge.tsx` (variant: success, refunded, dine-in, take-away, connected)
  - `ui/Card.tsx` (padding token, radius 24, border orange-50, children)
  - `ui/EmptyState.tsx` (icon + title + subtitle)
  - `pos/QtyStepper.tsx` (minus/qty/plus gaya kasir-order.html)
  - AC: semua memakai token theme, ada pressed feedback, tanpa hardcode warna.

- [ ] **Task 0.5 — Redesign tab bar** — file: `src/app/(tabs)/_layout.tsx`
  - 5 tab: Kasir (`layout-grid`), Draft (`save`), Sales (`history`), Shift (`clock-3`), Setting (`settings-2`) — pakai lucide.
  - Style: bg putih, border-top hairline, active `#F49E4A` + label bold + dot indicator di bawah icon, inactive gray-400. Hapus tombol center floating lama (custom `tabBarButton` Kasir).
  - Urutan tab disesuaikan mockup: Kasir, Draft, Sales, Shift, Setting. `transaction-history` → title "Sales", `saved-orders` → title "Draft".
  - AC: navigasi antar tab jalan, active state benar di 5 tab, safe-area bottom aman di iOS.

### FASE 1 — Kasir screen (`kasir.html`)

- [ ] **Task 1.1 — Header kasir**
  - Avatar (inisisial / dari data user), nama, lokasi+outlet (dari `useOutletStore`/user) dengan dot hijau, tombol search.
  - AC: data user/outlet nyata dipakai bila tersedia; fallback "Ahmad Maulana" hanya untuk dev mock.

- [ ] **Task 1.2 — Category pills**
  - Scroll horizontal: All / Food / Drink / Dessert / Snack; active = pill orange + shadow; sumber kategori dari data produk (fallback statis).
  - AC: filter grid produk berfungsi.

- [ ] **Task 1.3 — Grid produk + ProductCard redesign**
  - Redesign `src/components/pos/ProductCard.tsx` → gaya `kasir.html`: gambar (expo-image, radius 16, placeholder huruf bila tanpa gambar), badge diskon `-30%` bila ada, nama, subtitle, harga orange, tombol `+` bulat dark.
  - `cashier.tsx`: `FlatList numColumns={2}`; produk dari `useProducts()` — karena `useProducts.fetchProducts` masih TODO/kosong, tambahkan fallback mock products (6 item seperti mockup, field `image`, `category`, `subtitle`) agar UI terlihat; struktur data tetap `src/types/product.ts`.
  - AC: tap `+` menambah `useCart` (cartStore), card punya pressed feedback.

- [ ] **Task 1.4 — Floating checkout bar**
  - Bar fixed di atas tab bar: bg `#111827` radius 16, kotak orange jumlah item, "Items selected" + total, tombol "View Order" → `router.push("/kasir/order-review")`.
  - AC: bar muncul hanya bila cart tidak kosong; total & item count live dari `useCart`; hilang saat cart kosong.

### FASE 2 — Alur transaksi (Order Review → Payment → Success)

- [ ] **Task 2.1 — Route group + Stack**
  - File baru: `src/app/kasir/_layout.tsx` (`Stack`, `headerShown: false`, animasi default native).
  - AC: push dari cashier → order-review dengan animasi slide.

- [ ] **Task 2.2 — Order Review** (`src/app/kasir/order-review.tsx`, ref `kasir-order.html`)
  - Header: back → cashier.
  - Item cards: gambar, nama, subtitle, harga, `QtyStepper` (sync `updateQuantity`), bagian "Extras" (opsional: tampilkan note/add-ons bila ada di data — cukup slot sederhana).
  - Order Summary card: Item total (subtotal), Discount (dari cartStore, merah bila ada), Tax, Total orange besar.
  - Tombol "Proceed Transactions" (dark, full width) → `/kasir/payment`.
  - AC: qty +/- update total live; cart kosong → redirect balik ke cashier; tombol Proceed aktif hanya bila ada item.

- [ ] **Task 2.3 — Payment** (`src/app/kasir/payment.tsx`, ref `kasir-pay.html`)
  - Header: back → order-review + subtitle "Order ID #TRX-xxx" (generate dari cart / timestamp).
  - Kartu total dark (`#111827`, radius 32): "TOTAL YANG HARUS DIBAYAR" + jumlah besar + chip "N Items".
  - Pilihan metode (radio cards): Tunai/Cash (banknote, orange active), Kartu Debit/Kredit (credit-card, blue), E-Wallet/QRIS (wallet, purple). Active: border orange + bg `#FFF9F3` + dot terisi.
  - Panel kontekstual **hanya saat Tunai**: input "Uang Diterima" (numeric), tombol "UANG PAS" (set = total), baris "Kembalian" (hijau bila cukup, merah + disabled bila kurang).
  - State method + tendered disimpan di store baru ringan `src/store/checkoutStore.ts` (zustand: `paymentMethod`, `tendered`, `orderId`) supaya success screen bisa baca.
  - Tombol "Konfirmasi Pembayaran" (orange) → panggil `usePayment().processPayment` → sukses → `/kasir/success`.
  - AC: pilih metode bekerja; UANG PAS mengisi nominal; kembalian terhitung; konfirmasi disabled bila tunai < total; payment non-tunai tidak butuh tendered.

- [ ] **Task 2.4 — Success** (`src/app/kasir/success.tsx`, ref `kasir-order-confirm.html`)
  - Icon sukses (circle + check, animasi scale/ping sederhana), judul "Payment Success!".
  - Receipt card (radius 32, cutout circles kiri-kanan via View bg cream): Order Number, Date, list item (qty chip `1x`), Subtotal, Tax, Total, tag Payment Method (icon + label + check).
  - Tombol "Print Receipt" (dark; wire ke `usePrinter` bila tersedia, else no-op/toast) dan "Start New Order" (putih) → `clearCart()` + `checkoutStore.reset()` + `router.replace("/(tabs)/cashier")`.
  - AC: data receipt dari cartStore+checkoutStore (bukan hardcode); kembali ke kasir dengan cart kosong; tidak bisa back ke payment (replace/dismiss).

- [ ] **Task 2.5 — Wiring end-to-end + guard**
  - Cashier → Order Review → Payment → Success → Cashier; guard: akses `/kasir/*` dengan cart kosong → redirect cashier.
  - AC: alur penuh manual-test sukses di semua kombinasi (tunai pas, tunai lebih, non-tunai).

### FASE 3 — Tab screens lain

- [ ] **Task 3.1 — Sales / Riwayat Penjualan** (`transaction-history.tsx`, ref `history-sales.html`)
  - Header: judul + "TOTAL HARI INI: Rp xxx" (uppercase micro), tombol filter-tanggal & search (UI dulu, fungsional next).
  - Stat chips scroll: Transaksi (orange), Cashless (green), Tunai (blue).
  - Kartu transaksi: icon receipt (kotak dark), `Order #TRX-xxx`, jam + jumlah menu, harga orange, badge Success/Refunded, footer metode pembayaran (icon sesuai metode) + chevron.
  - Grouping label tanggal ("Hari Ini" / "Kemarin, x Okt"); empty state (search-x).
  - Data: tetap MOCK dulu (upgrade struktur mock agar ada `paymentMethod`, `time`, `itemsCount`, `status`), filter search sederhana tetap jalan.
  - AC: visual match mockup; badge & metode benar; empty state tampil saat filter kosong.

- [ ] **Task 3.2 — Draft / Pesanan Tersimpan** (`saved-orders.tsx`, ref `draft-order.html`)
  - Header: "Pesanan Tersimpan" + "N DRAF AKTIF", tombol filter & search.
  - Kartu draft: icon shopping-bag (orange-100 bg), `Order #DF-xxxx`, label "Meja 08 • 14:20" atau "Walk-in Customer", badge DINE-IN (blue) / TAKE-AWAY (orange).
  - Tengah: stack avatar gambar item (expo-image, `-space-x-2` → negative margin) + `+N`, kanan jumlah item + total.
  - Tombol "Hapus" (outline merah, konfirmasi Alert) & "Lanjutkan Pesanan" (dark) → nanti wire ke draft flow; untuk fase ini push ke order-review bila ada data cart terkait, else Alert info.
  - AC: visual match; delete dengan konfirmasi; filter search jalan; empty state.

- [ ] **Task 3.3 — Setting** (`settings.tsx`, ref `setting.html`)
  - Header: "Pengaturan" + "KASIR ID: xxx • V x.x".
  - Section "Akun & Profil": row profil (avatar, nama, email — dari user nyata bila ada) → `/settings/profile`; row "Ganti Kata Sandi".
  - Section "Aplikasi": toggle "Notifikasi Transaksi" (Switch native, simpan `settingsStore` bila sudah ada field-nya), "Mode Malam" (tampil tapi disabled + note), row "Bahasa" (value "BAHASA INDONESIA").
  - Section "Toko & Sistem": "Informasi Outlet" (→ data outlet terpilih), "Printer & Bluetooth" (badge TERHUBUNG → `/settings/printer-management`), "Backup Data Ke Cloud".
  - Bawah: tombol "Pusat Bantuan" (putih) & "Keluar Dari Aplikasi" (merah soft) → `authService.logout()` + replace login.
  - Grouped-list style: satu Card per section, divider hairline antar row (bukan card per row).
  - AC: logout tetap berfungsi; navigasi ke profile & printer jalan; tidak ada emoji icon.

- [ ] **Task 3.4 — Shift (theme-only)**
  - `shift-history.tsx`: ganti stylesheet ke token baru (bg cream, card putih, primary orange, lucide icons) — layout existing dipertahankan.
  - AC: tidak ada warna lama (indigo/dark) tersisa di screen ini.

- [ ] **Task 3.5 — Sub-pages setting** (`/settings/profile`, `/settings/printer-management`)
  - Apply token + font + lucide; layout existing dipertahankan.
  - AC: konsisten visual dengan section Setting.

### FASE 4 — Cleanup, Konsistensi & QA

- [ ] **Task 4.1 — Sweep warna lama**
  - Grep hex lama (`#4F46E5`, `#6C63FF`, `#0F172A`, `#7C6FFF`, dll) di `src/` → pastikan sisa hanya di file yang memang belum masuk scope; hilangkan dari semua screen tabs + kasir flow.
  - AC: grep bersih untuk screen-scope redesign.

- [ ] **Task 4.2 — Legacy routes (konfirmasi user dulu)**
  - `pos/index.tsx`, `products/index.tsx`, `reports/index.tsx`, `components/layout/{BottomBar,Sidebar,Header}.tsx` tidak dipakai flow baru → usulkan dihapus (atau dibiarkan bila user mau simpan).
  - AC: keputusan user tercatat; tidak ada dead-link dari UI baru.

- [ ] **Task 4.3 — QA**
  - `npm run lint` bersih; `tsc --noEmit` bersih.
  - `npx expo start` → visual check tiap screen vs mockup (checklist di bawah).
  - A11y: label icon-only button, `accessibilityRole/state` di interactive, kontras teks.
  - Haptics ringan (`expo-haptics`) di: tambah item, konfirmasi pembayaran, sukses.
  - AC: semua screen match checklist; lint & tsc lolos.

## 5. Checklist Visual (per screen, untuk QA)

- [ ] Tab bar: putih, active orange + dot, label 10px
- [ ] Kasir: header profil + pills + grid 2 kolom + floating bar dark
- [ ] Order Review: kartu item radius 24, stepper, summary dashed divider, total orange
- [ ] Payment: kartu total dark radius 32, radio 3 metode, panel tunai + kembalian
- [ ] Success: icon hijau, receipt radius 32 + cutout, tombol print/start
- [ ] Sales: stat chips, kartu receipt + status badge, group tanggal
- [ ] Draft: badge DINE-IN/TAKE-AWAY, stack avatar item, tombol hapus/lanjutkan
- [ ] Setting: 3 section grouped card, toggle, tombol merah logout
- [ ] Semua screen: bg `#F5F1E8`, font Plus Jakarta Sans, angka pakai "Rp" format id-ID

## 6. Out of Scope (tidak dikerjakan di redesign ini)

- Integrasi API produk/transaksi nyata (`useProducts` masih TODO — hanya fallback mock).
- Dark mode.
- Fitur filter tanggal & search advanced di Sales/Draft (UI saja).
- Fungsional backup cloud, ganti bahasa, ganti password (row UI saja).
- Draft flow nyata (save/resume draft ke persist storage) — hanya desain + tombol; jadi task lanjutan bila diminta.
- Print receipt nyata ke printer bluetooth (tetap `usePrinter` existing / no-op).
