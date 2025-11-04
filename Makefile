run:
	@echo "🚀 Menjalankan server lokal Barang Baru Rasa Lama..."
	python3 -m http.server 8000

open:
	@open "http://localhost:8000"

stop:
	@pkill -f "http.server" || true
