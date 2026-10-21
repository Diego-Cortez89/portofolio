# Portofolio Sudarno Lamhot

Situs: https://diego-cortez89.github.io/portofolio/

Semua isi situs ada di **satu file**: `data/profile.json`. Tampilan (`index.html`) membaca file itu setiap kali halaman dibuka, jadi untuk mengubah isi Anda tidak perlu menyentuh HTML sama sekali.

## Struktur

```
index.html              tampilan situs (tidak perlu diedit)
admin.html              editor berbasis form + simpan langsung ke GitHub
data/profile.json       SEMUA isi: karier, proyek, skill, kontak, dll.
scripts/validate.mjs    pemeriksa data (dipakai admin.html dan GitHub Action)
.github/workflows/      GitHub Action yang memeriksa data setiap push
.nojekyll               mempercepat build GitHub Pages
```

## Cara update (pilih salah satu)

### A. Lewat editor (paling cepat, bisa dari HP)

1. Buka `https://diego-cortez89.github.io/portofolio/admin.html`
2. Pertama kali saja: klik ikon roda gigi → isi token GitHub (lihat di bawah) → **Tes koneksi**.
3. Ubah isi lewat form. Pratinjau di kanan langsung berubah.
4. Klik **Simpan ke GitHub**. Situs live terbarui dalam ±1 menit.

Draf tersimpan otomatis di browser, jadi aman kalau tab tertutup sebelum menyimpan.

### B. Edit file langsung di GitHub

Buka `data/profile.json` di GitHub → ikon pensil → ubah → **Commit changes**. Jika ada salah ketik (misalnya koma kurang), tab **Actions** menandai merah dan menunjukkan barisnya.

## Membuat token GitHub (sekali saja)

1. Buka https://github.com/settings/personal-access-tokens/new
2. **Repository access** → *Only select repositories* → pilih `portofolio`.
3. **Permissions** → *Repository permissions* → **Contents: Read and write**.
4. Generate, salin token (`github_pat_…`), tempel di Pengaturan editor.

Token hanya disimpan di browser Anda, tidak pernah masuk ke repo. Halaman `admin.html` boleh publik: tanpa token tidak bisa mengubah apa pun.

## Yang dihitung otomatis

Tidak perlu diketik ulang setiap tahun:

| Kode di teks       | Hasil sekarang                     |
|--------------------|------------------------------------|
| `{years}`          | 14 (total pengalaman dari tanggal karier) |
| `{YearsWord}`      | Fourteen                           |
| `{current}`        | InfiniSoft Technology DMCC, UAE    |
| `{ProjectCount}`   | Four (jumlah proyek)               |
| `{rev}`            | tahun update terakhir              |

Juga otomatis: durasi tiap pekerjaan (“4 yrs 11 mos”), label “Present”, rentang tahun proyek, jumlah skill per kategori, menu navigasi (seksi kosong disembunyikan), tombol WhatsApp/Call/Email dari daftar kontak, jam lokal tiap nomor, tanggal “Updated” di footer (dari commit terakhir), dan data terstruktur untuk Google.

## Fitur untuk perekrut

- **Save CV as PDF**: tombol di atas mencetak CV rapi dari data yang sama, jadi CV selalu sama dengan situs.
- **Link langsung ke proyek**: `…/portofolio/#p-dc-build` membuka proyek itu. Tombol “Copy link to this project” ada di setiap proyek.
- **Link langsung ke karier**: `…/portofolio/#career-alibaba`.
- **Pencarian skill** dan filter per kategori; klik tag proyek untuk mencari skill terkait.

## Coba di komputer sendiri

Browser memblokir pembacaan JSON jika file dibuka dengan klik dua kali. Jalankan server kecil:

```bash
python3 -m http.server
# buka http://localhost:8000 dan http://localhost:8000/admin.html
node scripts/validate.mjs   # periksa data
```
