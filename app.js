const tg = window.Telegram?.WebApp;
const OZON_URL = 'https://www.ozon.ru/seller/marinas-hm/';

function openExternal(url) {
  if (tg?.openLink) {
    tg.openLink(url, { try_instant_view: false });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

if (tg) {
  tg.ready();
  tg.expand();

  const bg = tg.themeParams.bg_color || '#f5efe8';
  const header = tg.themeParams.secondary_bg_color || '#efe6da';

  if (tg.setBackgroundColor) tg.setBackgroundColor(bg);
  if (tg.setHeaderColor) tg.setHeaderColor(header);

  if (tg.MainButton) {
    tg.MainButton.setText('Купить на Ozon');
    tg.MainButton.show();
    tg.MainButton.onClick(() => openExternal(OZON_URL));
  }
}

document.querySelectorAll('.js-ozon').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openExternal(el.getAttribute('href') || OZON_URL);
  });
});

const tabButtons = document.querySelectorAll('.tab-btn');
const cards = document.querySelectorAll('.collection-card');

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const color = btn.dataset.color;

    cards.forEach((card) => {
      if (color === 'all' || card.dataset.color === color) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
document.querySelectorAll('.slider').forEach((slider) => {
  const slides = slider.querySelectorAll('.slide');
  const dots = slider.querySelectorAll('.dot');
  const next = slider.querySelector('.next');
  const prev = slider.querySelector('.prev');

  let index = 0;
  let startX = 0;
  let endX = 0;

  function showSlide(i) {
    if (i >= slides.length) index = 0;
    if (i < 0) index = slides.length - 1;

    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('active'));

    slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
  }

  next.addEventListener('click', () => {
    index++;
    showSlide(index);
  });

  prev.addEventListener('click', () => {
    index--;
    showSlide(index);
  });

  slider.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].clientX;
  });

  slider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        index++;
      } else {
        index--;
      }
      showSlide(index);
    }
  });
});
const galleries = {
  khaki: [
    { src: "assets/khaki-1.jpg", caption: "Хаки — основное фото коллекции" },
    { src: "assets/khaki-2.jpg", caption: "Хаки — крупный ракурс изделия" },
    { src: "assets/khaki-3.jpg", caption: "Хаки — чехол с телефоном внутри" }
  ],
  yellow: [
    { src: "assets/yellow-1.jpg", caption: "Жёлтый — flat lay на светлом камне" },
    { src: "assets/yellow-2.jpg", caption: "Жёлтый — вертикальный каталожный ракурс" }
  ],
  dusty: [
    { src: "assets/dusty-1.png", caption: "Пудровый — фронтальный ракурс" },
    { src: "assets/dusty-2.jpg", caption: "Пудровый — интерьерная подача" }
  ],
  milk: [
    { src: "assets/milk-1.jpg", caption: "Молочный — мягкая натуральная сцена" },
    { src: "assets/milk-2.png", caption: "Молочный — flat lay с камнями" }
  ],
  beige: [
    { src: "assets/beige-1.png", caption: "Бежевый — коллаж с несколькими ракурсами" },
    { src: "assets/beige-2.png", caption: "Бежевый — flat lay с тканью и сухоцветами" },
    { src: "assets/beige-3.png", caption: "Бежевый — подвес на крючке" },
    { src: "assets/beige-4.png", caption: "Бежевый — интерьерный ракурс сбоку" }
  ]
};

const galleryModal = document.getElementById("galleryModal");
const galleryMainImage = document.getElementById("galleryMainImage");
const galleryThumbs = document.getElementById("galleryThumbs");
const galleryCaption = document.getElementById("galleryCaption");
const galleryClose = document.getElementById("galleryClose");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");

let currentGallery = [];
let currentIndex = 0;

function renderGalleryImage(index) {
  if (!currentGallery.length) return;

  currentIndex = index;
  const item = currentGallery[currentIndex];

  galleryMainImage.src = item.src;
  galleryMainImage.alt = item.caption || "Фото изделия";
  galleryCaption.textContent = item.caption || "";

  const thumbButtons = galleryThumbs.querySelectorAll(".gallery-thumb");
  thumbButtons.forEach((btn, i) => {
    btn.classList.toggle("active", i === currentIndex);
  });
}

function buildThumbs(items) {
  galleryThumbs.innerHTML = "";

  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "gallery-thumb";
    button.type = "button";
    button.setAttribute("aria-label", `Открыть фото ${index + 1}`);

    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.caption || `Миниатюра ${index + 1}`;

    button.appendChild(image);

    button.addEventListener("click", () => {
      renderGalleryImage(index);
    });

    galleryThumbs.appendChild(button);
  });
}

function openGallery(name) {
  const items = galleries[name];
  if (!items || !items.length) return;

  currentGallery = items;
  currentIndex = 0;

  buildThumbs(currentGallery);
  renderGalleryImage(0);

  galleryModal.classList.add("open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("gallery-open");
}

function closeGallery() {
  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("gallery-open");

  galleryMainImage.src = "";
  galleryThumbs.innerHTML = "";
  galleryCaption.textContent = "";
  currentGallery = [];
  currentIndex = 0;
}

function showNextImage() {
  if (!currentGallery.length) return;
  const nextIndex = (currentIndex + 1) % currentGallery.length;
  renderGalleryImage(nextIndex);
}

function showPrevImage() {
  if (!currentGallery.length) return;
  const prevIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  renderGalleryImage(prevIndex);
}

document.querySelectorAll(".gallery-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    openGallery(btn.dataset.gallery);
  });
});

galleryClose.addEventListener("click", closeGallery);
galleryNext.addEventListener("click", showNextImage);
galleryPrev.addEventListener("click", showPrevImage);

galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) {
    closeGallery();
  }
});

document.addEventListener("keydown", (e) => {
  if (!galleryModal.classList.contains("open")) return;

  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowRight") showNextImage();
  if (e.key === "ArrowLeft") showPrevImage();
});
