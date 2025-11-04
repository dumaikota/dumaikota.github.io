// =======================================
// Daftar Pengguna Resmi Kecamatan Dumai Kota
// Versi: Barang Baru Rasa Lama (update final)
// Password disimpan dalam Base64
// =======================================

const USERS = {
  "camat": { "role": "Camat Dumai Kota", "password": "aWNvbm1hbnRhcA==" },
  "sekcam": { "role": "Sekretaris Camat Dumai Kota", "password": "a290YWlkYW1hbg==" },

  "subbag_tu": { "role": "Subbag Umum dan Kepegawaian", "password": "a290YWlkYW1hbg==" },
  "subbag_program": { "role": "Subbag Perencanaan dan Keuangan", "password": "a290YWlkYW1hbg==" },

  "kasi_pem": { "role": "Kasi Pemerintahan", "password": "a290YWlkYW1hbg==" },
  "kasi_pm": { "role": "Kasi Pemberdayaan Masyarakat", "password": "a290YWlkYW1hbg==" },
  "kasi_ekbang": { "role": "Kasi Ekonomi dan Pembangunan", "password": "a290YWlkYW1hbg==" },
  "kasi_kesos": { "role": "Kasi Kesejahteraan Sosial", "password": "a290YWlkYW1hbg==" },
  "kasi_trantib": { "role": "Kasi Ketentraman dan Ketertiban Umum", "password": "a290YWlkYW1hbg==" },

  "lurah_bintan": { "role": "Lurah Bintan", "password": "a290YWlkYW1hbg==" },
  "seklur_bintan": { "role": "Sekretaris Kelurahan Bintan", "password": "a290YWlkYW1hbg==" },
  "kasi_pem_bintan": { "role": "Kasi Pemerintahan", "password": "a290YWlkYW1hbg==" },
  "kasi_trantib_bintan": { "role": "Kasi Ketentraman dan Ketertiban", "password": "a290YWlkYW1hbg==" },
  "kasi_pm_kesos_bintan": { "role": "Kasi Pemberdayaan Masyarakat dan Kesejahteraan Sosial", "password": "a290YWlkYW1hbg==" },

  "lurah_du_kot": { "role": "Lurah Dumai Kota", "password": "a290YWlkYW1hbg==" },
  "seklur_du_kot": { "role": "Sekretaris Kelurahan Dumai Kota", "password": "a290YWlkYW1hbg==" },
  "kasi_pem_du_kot": { "role": "Kasi Pemerintahan", "password": "a290YWlkYW1hbg==" },
  "kasi_trantib_du_kot": { "role": "Kasi Ketentraman dan Ketertiban", "password": "a290YWlkYW1hbg==" },
  "kasi_pm_kesos_du_kot": { "role": "Kasi Pemberdayaan Masyarakat dan Kesejahteraan Sosial", "password": "a290YWlkYW1hbg==" },

  "lurah_laksamana": { "role": "Lurah Laksamana", "password": "a290YWlkYW1hbg==" },
  "seklur_laksamana": { "role": "Sekretaris Kelurahan Laksamana", "password": "a290YWlkYW1hbg==" },
  "kasi_pem_laksamana": { "role": "Kasi Pemerintahan", "password": "a290YWlkYW1hbg==" },
  "kasi_trantib_laksamana": { "role": "Kasi Ketentraman dan Ketertiban", "password": "a290YWlkYW1hbg==" },
  "kasi_pm_kesos_laksamana": { "role": "Kasi Pemberdayaan Masyarakat dan Kesejahteraan Sosial", "password": "a290YWlkYW1hbg==" },

  "lurah_rimbas": { "role": "Lurah Rimba Sekampung", "password": "a290YWlkYW1hbg==" },
  "seklur_rimbas": { "role": "Sekretaris Kelurahan Rimba Sekampung", "password": "a290YWlkYW1hbg==" },
  "kasi_pem_rimbas": { "role": "Kasi Pemerintahan", "password": "a290YWlkYW1hbg==" },
  "kasi_trantib_rimbas": { "role": "Kasi Ketentraman dan Ketertiban", "password": "a290YWlkYW1hbg==" },
  "kasi_pm_kesos_rimbas": { "role": "Kasi Pemberdayaan Masyarakat dan Kesejahteraan Sosial", "password": "a290YWlkYW1hbg==" },

  "lurah_sukajadi": { "role": "Lurah Sukajadi", "password": "a290YWlkYW1hbg==" },
  "seklur_sukajadi": { "role": "Sekretaris Kelurahan Sukajadi", "password": "a290YWlkYW1hbg==" },
  "kasi_pem_sukajadi": { "role": "Kasi Pemerintahan", "password": "a290YWlkYW1hbg==" },
  "kasi_trantib_sukajadi": { "role": "Kasi Ketentraman dan Ketertiban", "password": "a290YWlkYW1hbg==" },
  "kasi_pm_kesos_sukajadi": { "role": "Kasi Pemberdayaan Masyarakat dan Kesejahteraan Sosial", "password": "a290YWlkYW1hbg==" },

  "operator_kecamatan": { "role": "Operator Kecamatan", "password": "a290YWlkYW1hbg==" },
  "operator_kelurahan": { "role": "Operator Kelurahan", "password": "a290YWlkYW1hbg==" },
  "admin": { "role": "Administrator Sistem", "password": "a290YWlkYW1hbg==" }
};
