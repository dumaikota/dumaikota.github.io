const { jsPDF } = window.jspdf;
const form = document.getElementById("disposisiForm");
const tableBody = document.querySelector("#disposisiTable tbody");
const inputMode = document.getElementById("inputMode");
const uploadSection = document.getElementById("uploadSection");
const fileUpload = document.getElementById("fileUpload");
const extractBtn = document.getElementById("extractBtn");
const extractStatus = document.getElementById("extractStatus");
const ocrPreview = document.getElementById("ocrPreview");
const debugToggle = document.getElementById("debugOcr");

let disposisiList = JSON.parse(localStorage.getItem("disposisiList")) || [];

// ==== MODE INPUT ====
inputMode.addEventListener("change", () => {
  uploadSection.style.display = inputMode.value === "manual" ? "none" : "block";
  fileUpload.accept = inputMode.value === "srikandi" ? ".pdf" : "image/*";
});

// ==== TOMBOL EKSTRAK ====
extractBtn.addEventListener("click", async () => {
  const file = fileUpload.files[0];
  if (!file) return alert("Pilih file terlebih dahulu!");
  extractStatus.textContent = "🔄 Memproses...";
  if (inputMode.value === "gambar") processImage(file);
  else processPDF(file);
});

// ==== ADAPTIVE SCREENING OCR ====
async function processImage(file) {
  const img = document.createElement("canvas");
  const ctx = img.getContext("2d");
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    img.width = image.width;
    img.height = image.height;
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height);

    const blockSize = 8;
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const i = (y * img.width + x) * 4;
        const g = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
        const localAvgIndex = Math.min(
          data.data.length - 4,
          Math.max(0, i - blockSize * 4)
        );
        const localAvg =
          (data.data[localAvgIndex] +
            data.data[Math.min(data.data.length - 4, i + blockSize * 4)]) /
          2;
        const v = g > localAvg ? 255 : 0;
        data.data[i] = data.data[i + 1] = data.data[i + 2] = v;
      }
    }
    ctx.putImageData(data, 0, 0);

    Tesseract.recognize(img, "eng+ind", {
      logger: (m) => (extractStatus.textContent = "🧠 " + m.status),
    }).then(({ data: { text, words } }) => {
      if (debugToggle && debugToggle.checked) drawOverlay(ctx, words);
      ocrPreview.value = text;
      parseText(text);
    });
  };
}

// ==== DRAW BOX DEBUG ====
function drawOverlay(ctx, words) {
  ctx.strokeStyle = "rgba(255,0,0,0.5)";
  ctx.lineWidth = 1;
  words.forEach((w) => {
    if (w.bbox) {
      ctx.strokeRect(w.bbox.x0, w.bbox.y0, w.bbox.x1 - w.bbox.x0, w.bbox.y1 - w.bbox.y0);
    }
  });
  alert("🔍 Mode Debug: kotak teks digambar di kanvas (lihat console).");
}

// ==== PDF OCR ====
async function processPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    fullText += text.items.map((it) => it.str).join(" ") + " ";
  }
  ocrPreview.value = fullText;
  parseText(fullText);
}

// ==== NORMALISASI TEKS + REGEX CERDAS ====
function parseText(text) {
  extractStatus.textContent = "✅ OCR selesai";
  text = text
    .replace(/\s+/g, " ")
    .replace(/Nomor\s+Surat/gi, "Nomor:")
    .replace(/Hal\s*[:\-]/gi, "Perihal:")
    .replace(/Asal\s*Surat/gi, "Dari:")
    .replace(/Tgl\.?|Tanggal/gi, "Tanggal:")
    .replace(/Dumai,/, "Tanggal:");

  const nomor = text.match(/(No\.?|Nomor)[:\s-]*([A-Z0-9/.\-]+)/i);
  const perihal = text.match(/(Perihal|Hal)[:\s-]*([^\n]+)/i);
  const dari = text.match(/(Dari|Asal|Instansi|Dinas)[:\s-]*([^\n]+)/i);
  const tanggal = text.match(
    /(?:Dumai,)?\s*(\d{1,2}\s*[A-Za-z]+?\s*\d{4}|\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/i
  );

  if (nomor) document.getElementById("noSurat").value = nomor[2].trim();
  if (perihal) document.getElementById("perihal").value = perihal[2].trim();
  if (dari) document.getElementById("dari").value = dari[2].trim();
  if (tanggal)
    document.getElementById("tanggalSurat").value = new Date(
      tanggal[1]
    ).toISOString().split("T")[0];
}

// ==== SIMPAN FORM ====
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = {
    noSurat: noSurat.value,
    tanggalSurat: tanggalSurat.value,
    dari: dari.value,
    perihal: perihal.value,
    sifat: sifat.value,
    tujuan: tujuan.value.split(",").map((x) => x.trim()),
    catatan: catatan.value,
  };
  disposisiList.push(d);
  localStorage.setItem("disposisiList", JSON.stringify(disposisiList));
  form.reset();
  renderTable();
});

// ==== RENDER TABEL ====
function renderTable() {
  tableBody.innerHTML = "";
  disposisiList.forEach((d, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.noSurat}</td>
      <td>${d.tanggalSurat}</td>
      <td>${d.perihal}</td>
      <td>${d.dari}</td>
      <td>${d.sifat}</td>
      <td>${d.tujuan.join(", ")}</td>
      <td>${d.catatan}</td>
      <td><button onclick="printOne(${i})">🖨</button> <button onclick="del(${i})">🗑</button></td>`;
    tableBody.appendChild(tr);
  });
}

function del(i) {
  if (confirm("Hapus disposisi ini?")) {
    disposisiList.splice(i, 1);
    localStorage.setItem("disposisiList", JSON.stringify(disposisiList));
    renderTable();
  }
}

// ==== CETAK PDF ====
function printOne(i) {
  const d = disposisiList[i];
  const doc = new jsPDF({ format: "a5" });
  doc.text(`Disposisi: ${d.noSurat}`, 20, 20);
  doc.text(`${d.perihal}`, 20, 30);
  doc.save(`Disp_${d.noSurat}.pdf`);
}

function printAllDisposisi() {
  if (!disposisiList.length) return alert("Tidak ada data.");
  const doc = new jsPDF({ format: "a5" });
  disposisiList.forEach((d, i) => {
    if (i > 0) doc.addPage();
    doc.text(`${d.noSurat} - ${d.perihal}`, 20, 20);
  });
  doc.save("Disposisi_Semua.pdf");
}

renderTable();
