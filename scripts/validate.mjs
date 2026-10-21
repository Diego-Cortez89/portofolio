// Validator for data/profile.json
// Dipakai di dua tempat: admin.html (di browser) dan GitHub Action (Node).
// Jalankan manual:  node scripts/validate.mjs

export const ICONS = ["store", "app", "factory", "server", "shield", "rig", "clock", "doc", "hard", "net", "bolt", "cloud", "fiber"];
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export function validate(d) {
  const errors = [];
  const warn = [];
  const err = (path, msg) => errors.push({ path, msg });
  if (!d || typeof d !== "object") return { errors: [{ path: "(root)", msg: "Data bukan objek JSON." }], warnings: [] };

  if (!d.site?.name) err("site.name", "Nama wajib diisi.");
  if (!d.site?.role) err("site.role", "Peran/jabatan wajib diisi.");

  const arr = (k) => (Array.isArray(d[k]) ? d[k] : (err(k, "Harus berupa daftar (array)."), []));

  const ids = new Set();
  arr("career").forEach((c, i) => {
    const p = `career[${i}]`;
    if (!c.id) err(p + ".id", "ID wajib diisi (huruf kecil, tanpa spasi).");
    else if (!/^[a-z0-9-]+$/.test(c.id)) err(p + ".id", `ID “${c.id}” hanya boleh huruf kecil, angka dan tanda minus.`);
    else if (ids.has(c.id)) err(p + ".id", `ID “${c.id}” dipakai lebih dari sekali.`);
    ids.add(c.id);
    if (!c.title) err(p + ".title", "Jabatan wajib diisi.");
    if (!c.next) {
      if (!MONTH.test(c.start || "")) err(p + ".start", "Tanggal mulai wajib, format YYYY-MM (contoh 2021-01).");
      if (c.end && !MONTH.test(c.end)) err(p + ".end", "Tanggal selesai format YYYY-MM, atau kosongkan jika masih bekerja.");
      if (c.end && c.start && c.end < c.start) err(p + ".end", "Tanggal selesai lebih awal dari tanggal mulai.");
    }
    if (c.icon && !ICONS.includes(c.icon)) warn.push({ path: p + ".icon", msg: `Ikon “${c.icon}” tidak dikenal; ikon kosong akan dipakai.` });
    if (!Array.isArray(c.groups) || !c.groups.some((g) => g.items?.length)) warn.push({ path: p + ".groups", msg: "Belum ada poin pekerjaan." });
  });

  const pids = new Set();
  arr("projects").forEach((pr, i) => {
    const p = `projects[${i}]`;
    if (!pr.title) err(p + ".title", "Judul proyek wajib diisi.");
    if (!pr.id) err(p + ".id", "ID proyek wajib diisi (dipakai untuk link langsung).");
    else if (pids.has(pr.id)) err(p + ".id", `ID proyek “${pr.id}” dipakai lebih dari sekali.`);
    pids.add(pr.id);
    if (pr.start && !MONTH.test(pr.start)) err(p + ".start", "Format YYYY-MM.");
    if (pr.end && !MONTH.test(pr.end)) err(p + ".end", "Format YYYY-MM, atau kosongkan jika masih berjalan.");
  });

  arr("skills").forEach((s, i) => {
    if (!s.category) err(`skills[${i}].category`, "Nama kategori wajib diisi.");
    if (!Array.isArray(s.items)) err(`skills[${i}].items`, "Daftar skill harus array.");
  });

  (d.contact?.lines || []).forEach((l, i) => {
    const p = `contact.lines[${i}]`;
    if (!l.value) err(p + ".value", "Nomor/email wajib diisi.");
    if (l.type === "email" && l.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(l.value)) err(p + ".value", "Alamat email tidak valid.");
    if (l.type === "phone" && l.value && l.value.replace(/\D/g, "").length < 8) err(p + ".value", "Nomor telepon terlalu pendek.");
  });

  return { errors, warnings: warn };
}

// --- CLI mode (GitHub Action / terminal) ---
if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("validate.mjs")) {
  const { readFile } = await import("node:fs/promises");
  const file = process.argv[2] || "data/profile.json";
  let data;
  try {
    data = JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    console.error(`✗ ${file} bukan JSON yang valid:\n  ${e.message}`);
    process.exit(1);
  }
  const { errors, warnings } = validate(data);
  warnings.forEach((w) => console.warn(`! ${w.path}: ${w.msg}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`✗ ${e.path}: ${e.msg}`));
    console.error(`\n${errors.length} kesalahan ditemukan di ${file}.`);
    process.exit(1);
  }
  console.log(`✓ ${file} valid (${data.career.length} karier, ${data.projects.length} proyek, ${data.skills.reduce((n, s) => n + s.items.length, 0)} skill).`);
}
