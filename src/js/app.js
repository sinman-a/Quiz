// Ініціалізація та управління екранами

import { loadLocale, getLang, initLangButtons, t } from './i18n.js';
import {
  buildRound, renderQuestion, nextQuestion,
  getScore, launchFinalConfetti, getResultEmoji,
} from './quiz.js';

// ===== УТИЛІТИ ЕКРАНІВ =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ===== СТАРТ =====
async function init() {
  await loadLocale(getLang());

  initLangButtons(() => {
    // При перемиканні мови на стартовому екрані — лише перерендерити текст
  });

  document.getElementById('btn-start').addEventListener('click', startQuiz);
  document.getElementById('btn-next').addEventListener('click', handleNext);
  document.getElementById('btn-restart').addEventListener('click', restart);
}

// ===== ЗАПУСК КВІЗУ =====
function startQuiz() {
  buildRound();
  showScreen('screen-quiz');
  renderQuestion(getLang());
}

// ===== НАСТУПНЕ ПИТАННЯ =====
function handleNext() {
  nextQuestion(onFinish);
}

// ===== РЕЗУЛЬТАТ =====
function onFinish(score) {
  const lang = getLang();

  document.getElementById('final-score').textContent = score;
  document.getElementById('result-emoji').textContent = getResultEmoji(score);

  // Повідомлення за результатом
  const msgs = {
    uk: [
      { min: 18, text: 'Відмінно! Ви — справжній експерт PMBOK 7!' },
      { min: 14, text: 'Чудово! Дуже сильний результат.' },
      { min: 10, text: 'Непогано! Є куди зростати.' },
      { min: 0,  text: 'Продовжуйте вчитися — ви на правильному шляху!' },
    ],
    en: [
      { min: 18, text: 'Excellent! You are a true PMBOK 7 expert!' },
      { min: 14, text: 'Great job! A very strong result.' },
      { min: 10, text: 'Not bad! There is room to grow.' },
      { min: 0,  text: 'Keep learning — you are on the right path!' },
    ],
  };

  const list = msgs[lang] || msgs.uk;
  const msg = list.find(m => score >= m.min)?.text ?? '';
  document.getElementById('result-msg').textContent = msg;

  showScreen('screen-result');
  launchFinalConfetti(score);
}

// ===== РЕСТАРТ =====
function restart() {
  showScreen('screen-start');
}

// ===== СТАРТ =====
init();
