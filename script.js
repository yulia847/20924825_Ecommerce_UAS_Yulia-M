function tambahKeKeranjang(nama, harga, gambar) {
  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

  let index = keranjang.findIndex(item => item.nama === nama);
  if (index !== -1) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ nama, harga, gambar, jumlah: 1 });
  }

  localStorage.setItem('keranjang', JSON.stringify(keranjang));
  updateCartCount();
  alert(`${nama} ditambahkan ke keranjang!`);
}

function updateCartCount() {
  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
  let total = keranjang.reduce((sum, item) => sum + item.jumlah, 0);
  
  const cartBadge = document.getElementById('cart-count');
  console.log("Keranjang:", keranjang);
  console.log("Total:", total);
  console.log("cartBadge:", cartBadge);

  if (cartBadge) {
    cartBadge.textContent = total;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});

function tampilkanKeranjang() {
  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
  let list = document.getElementById('daftar-keranjang');
  list.innerHTML = '';

  if (keranjang.length === 0) {
    list.innerHTML = "<li>Keranjang kosong</li>";
    return;
  }

  keranjang.forEach((item, index) => {
    let li = document.createElement('li');
    li.classList.add("product");

    li.innerHTML = `
      <img src="${item.gambar}" alt="${item.nama}" style="width:100px; height:auto; border-radius:6px; margin-right: 10px;">
      <div style="flex: 1">
        <h3>${item.nama}</h3>
        <p>Harga: Rp ${item.harga.toLocaleString()}</p>
        <p>Jumlah: ${item.jumlah}</p>
        <div style="display:flex; align-items:center; gap:8px;">
          <button onclick="ubahJumlahKeranjang(${index}, -1)">−</button>
          <button onclick="ubahJumlahKeranjang(${index}, 1)">+</button>
          <button class="btn-beli" onclick="tampilkanFormPesanan('${item.nama}', ${item.harga * item.jumlah})" style="margin-left:auto;">Beli</button>
        </div>
      </div>
    `;

    li.style.display = "flex";
    li.style.gap = "15px";
    li.style.alignItems = "center";

    list.appendChild(li);
  });

  let totalHarga = keranjang.reduce((total, item) => total + item.harga * item.jumlah, 0);
  document.getElementById("total-harga").textContent = "Total: Rp " + totalHarga.toLocaleString();
}

function ubahJumlahKeranjang(index, delta) {
  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];

  keranjang[index].jumlah += delta;
  if (keranjang[index].jumlah <= 0) {
    keranjang.splice(index, 1); 
  }

  localStorage.setItem('keranjang', JSON.stringify(keranjang));
  tampilkanKeranjang();
  updateCartCount();
}

function tampilkanModalKeranjang(nama, harga, gambar) {

  let keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
  let index = keranjang.findIndex(item => item.nama === nama);

  if (index !== -1) {
    keranjang[index].jumlah += 1;
  } else {
    keranjang.push({ nama, harga, gambar, jumlah: 1 });
  }

  localStorage.setItem('keranjang', JSON.stringify(keranjang));
  updateCartCount();

  const container = document.getElementById('modal-keranjang-content');
  container.innerHTML = `
    <img src="${gambar}" alt="${nama}" style="width:120px; height:auto; border-radius:8px; margin-bottom:10px;">
    <h4>${nama}</h4>
    <p>Produk berhasil ditambahkan ke keranjang!</p>
    <button class="btn-kirim" onclick="tutupModalKeranjang()">Tutup</button>
  `;

  document.getElementById('modal-keranjang').style.display = 'flex';
  
  setTimeout(() => {
  window.location.href = 'keranjang.html';
}, 2000);
}

function tampilkanFormPesanan(namaProduk, harga) {
  const modal = document.getElementById('form-pesanan-modal');
  document.getElementById('produk-terpilih').value = `${namaProduk} - Rp ${harga.toLocaleString()}`;
  modal.style.display = 'flex';
}

function tutupFormPesanan() {
  document.getElementById('form-pesanan-modal').style.display = 'none';
}

function kirimPesanan(event) {
  event.preventDefault();

  const nama = document.getElementById('nama').value;
  const email = document.getElementById('email').value;
  const alamat = document.getElementById('alamat').value;
  const metode = document.getElementById('metode').value;
  const produk = document.getElementById('produk-terpilih').value;
  const catatan = document.getElementById('catatan')?.value || '';

  const pesan = `Halo, saya ingin pesan:
Produk: ${produk}
Nama: ${nama}
Email: ${email}
Alamat: ${alamat}
Metode Pembayaran: ${metode}
Catatan: ${catatan ? catatan : '(Tidak ada)'}`;

  const url = `https://wa.me/6285794303865?text=${encodeURIComponent(pesan)}`;
  window.open(url, '_blank');

  tutupFormPesanan();
}