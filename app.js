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
