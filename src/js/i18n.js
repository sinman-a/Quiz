// Модуль інтернаціоналізації

let currentLang = localStorage.getItem('pm-quiz-lang') || 'uk';
let locales = {};

export async function loadLocale(lang) {
  if (!locales[lang]) {
    const res = await fetch(`/src/locales/${lang}.json`);
    locales[lang] = await res.json();
  }
  currentLang = lang;
  localStorage.setItem('pm-quiz-lang', lang);
  applyTranslations();
}

export function getLang() {
  return currentLang;
}

export function getLocale() {
  return locales[currentLang] || {};
}

export function t(key) {
  const locale = getLocale();
  return locale.ui?.[key] ?? key;
}

export function getQuestions() {
  return getLocale().questions ?? [];
}

// Замінює data-i18n атрибути на перекладені тексти
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
}

export function initLangButtons(onSwitch) {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    // Відновити активний стан
    if (btn.dataset.lang === currentLang) btn.classList.add('active');
    else btn.classList.remove('active');

    btn.addEventListener('click', async () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      await loadLocale(btn.dataset.lang);
      onSwitch?.();
    });
  });
}
