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
