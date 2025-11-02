import os
from bs4 import BeautifulSoup

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_HTML_DIR = os.path.join(BASE_DIR, "fixed_html")
SRC_CSS_FILE = os.path.join(BASE_DIR, "style.css")
OUTPUT_DIR = os.path.join(BASE_DIR, "fixed_modular")

os.makedirs(os.path.join(OUTPUT_DIR, "html"), exist_ok=True)
os.makedirs(os.path.join(OUTPUT_DIR, "css"), exist_ok=True)

for root, _, files in os.walk(SRC_HTML_DIR):
    for f in files:
        if f.endswith(".html"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8", errors="ignore") as file:
                soup = BeautifulSoup(file.read(), "html.parser")
            page_name = os.path.splitext(f)[0].lower().replace(" ", "-")
            body = soup.find("body")
            if body:
                body["class"] = f"{page_name}-page"
            out_path = os.path.join(OUTPUT_DIR, "html", f)
            with open(out_path, "w", encoding="utf-8") as file:
                file.write(soup.prettify())

print("✅ Semua file HTML telah diberi class unik <body>.")

if os.path.exists(SRC_CSS_FILE):
    with open(SRC_CSS_FILE, "r", encoding="utf-8", errors="ignore") as css_file:
        css_lines = css_file.readlines()
    new_css = []
    for line in css_lines:
        stripped = line.strip()
        if stripped.startswith(("body", "div", "input", "button", "form", "section", "nav")) and "{" in stripped:
            selector = stripped.split("{")[0].strip()
            new_css.append(f".page-template {selector} {{\n")
        else:
            new_css.append(line)
    out_css_path = os.path.join(OUTPUT_DIR, "css", "style_namespaced.css")
    with open(out_css_path, "w", encoding="utf-8") as out_css:
        out_css.writelines(new_css)
    print("✅ CSS telah dinamespacing otomatis.")
else:
    print("⚠️ File CSS sumber tidak ditemukan, lewati tahap ini.")

print(f"🎉 Semua hasil disimpan di folder: {OUTPUT_DIR}")