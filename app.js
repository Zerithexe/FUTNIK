const boot = document.getElementById('bootScreen');
const app = document.getElementById('app');
const bar = document.getElementById('bootBar');
const status = document.getElementById('bootStatus');
const enterBtn = document.getElementById('enterBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

let cart = [];
const bootMessages = [
  'Tesis bağlantısı kuruluyor…',
  'Fındık hattı senkronize ediliyor…',
  'Hamsi lojistik protokolü açılıyor…',
  'İnek sağım modülü kalibre ediliyor…',
  'E-spor akademisi hazır…',
  'Kurumsal ciddiyet seviyesi: %94…',
  'Futnık çekirdeği hazır.'
];
let progress = 0;
const bootTimer = setInterval(() => {
  progress += Math.floor(Math.random() * 9) + 7;
  if (progress >= 100) {
    progress = 100;
    clearInterval(bootTimer);
    status.textContent = bootMessages.at(-1);
    enterBtn.disabled = false;
    enterBtn.textContent = 'Sisteme Giriş';
  } else {
    status.textContent = bootMessages[Math.min(Math.floor(progress / 16), bootMessages.length - 2)];
  }
  bar.style.width = `${progress}%`;
}, 240);

enterBtn.addEventListener('click', () => {
  boot.style.opacity = '0';
  boot.style.transition = 'opacity .55s ease';
  setTimeout(() => {
    boot.remove();
    app.classList.remove('is-hidden');
    revealNow();
    showToast('Futnık sistemine hoş geldiniz. Her şey kontrol altında.');
  }, 560);
});

function revealNow() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function updateCart() {
  cartCount.textContent = cart.length;
  cartTotal.textContent = `₺${cart.reduce((s, item) => s + item.price, 0).toLocaleString('tr-TR')}`;
  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart">Henüz hiçbir şey seçmedin.<br /><small>Futnık ekonomisi seni bekliyor.</small></div>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>Futnık hizmet paketi</small></div>
      <div><strong>₺${item.price.toLocaleString('tr-TR')}</strong><button class="remove-item" data-index="${index}">Sil</button></div>
    </div>`).join('');
  cartItems.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', () => {
    cart.splice(Number(btn.dataset.index), 1);
    updateCart();
    showToast('Ürün sepetten çıkarıldı.');
  }));
}

document.addEventListener('click', (event) => {
  const add = event.target.closest('.add-service');
  if (!add) return;
  const name = add.dataset.name;
  const price = Number(add.dataset.price);
  cart.push({ name, price });
  updateCart();
  showToast(`${name} sepete eklendi.`);
});

document.getElementById('cartBtn').addEventListener('click', () => {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
});
document.getElementById('closeCart').addEventListener('click', () => {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
});
cartDrawer.addEventListener('click', (e) => {
  if (e.target === cartDrawer) {
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }
});
document.getElementById('fakeCheckout').addEventListener('click', () => {
  if (!cart.length) return showToast('Sepet boş. Önce Futnık ekonomisini hareketlendir.');
  cart = [];
  updateCart();
  cartDrawer.classList.remove('open');
  showToast('Sipariş onaylandı! Ödeme alınmadı, çünkü bu bir şaka sitesi.');
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.unit-card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

document.getElementById('systemBtn').addEventListener('click', () => showToast('FUTNIK CORE: Tüm sistemler çalışıyor. Kahve hariç.'));
document.getElementById('briefingBtn').addEventListener('click', () => showToast('Yönetim brifingi: Önce fındık, sonra e-spor. Diğerleri operasyon ekibinde.'));
document.getElementById('secretBtn').addEventListener('click', () => showToast('AR-GE dosyası açıldı: “İneğin kendine aim öğreteceği” proje beklemede.'));
document.getElementById('panicBtn').addEventListener('click', () => showToast('ACİL DURUM: Birisi son fındık paketini yemiş. Yönetim kuruluna haber verildi.'));

setInterval(() => {
  const clock = document.getElementById('clock');
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString('tr-TR');
}, 1000);

window.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'f' && e.altKey) {
    showToast('FUTNIK kısayolu aktif: F = Fındık, tabii ki.');
  }
});
