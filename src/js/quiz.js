// Логіка квізу: рандомізація, підрахунок, UI

import confetti from 'canvas-confetti';
import { getQuestions, t } from './i18n.js';

const ROUND_SIZE = 20;       // питань за раунд
const PER_CATEGORY = 4;      // питань з кожної категорії

const CATEGORIES = {
  value_delivery:      { uk: 'Система постачання цінності', en: 'Value Delivery System' },
  principles:          { uk: '12 принципів управління',    en: '12 Principles' },
  performance_domains: { uk: '8 сфер виконання',           en: '8 Performance Domains' },
  tailoring:           { uk: 'Припасування',               en: 'Tailoring' },
  models_artifacts:    { uk: 'Моделі, методи, артефакти',  en: 'Models, Methods & Artifacts' },
};

let round = [];
let current = 0;
let score = 0;
let answered = false;

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Формуємо раунд: 4 рандомних питання з кожної категорії
export function buildRound() {
  const questions = getQuestions();
  const byCategory = {};
  for (const q of questions) {
    (byCategory[q.category] = byCategory[q.category] || []).push(q);
  }
  round = Object.keys(CATEGORIES).flatMap(cat =>
    shuffle(byCategory[cat] || []).slice(0, PER_CATEGORY)
  );
  round = shuffle(round);
  current = 0;
  score = 0;
}

export function getCurrentQuestion() {
  return round[current];
}

export function getRoundLength() {
  return round.length;
}

export function getScore() {
  return score;
}

// Рендеримо поточне питання
export function renderQuestion(lang) {
  const q = getCurrentQuestion();
  if (!q) return;

  answered = false;

  // Прогрес
  const pct = (current / ROUND_SIZE) * 100;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('progress-text').textContent = `${current + 1} / ${ROUND_SIZE}`;
  document.getElementById('score-display').textContent = score;

  // Категорія
  const catInfo = CATEGORIES[q.category];
  document.getElementById('category-tag').textContent =
    catInfo ? (lang === 'uk' ? catInfo.uk : catInfo.en) : q.category;

  // Питання
  const wrap = document.getElementById('question-wrap');
  wrap.classList.remove('question-enter');
  void wrap.offsetWidth; // reflow для перезапуску анімації
  wrap.classList.add('question-enter');

  document.getElementById('question-text').textContent = q.question;

  // Пояснення — скидаємо
  const exBox = document.getElementById('explanation-box');
  exBox.classList.add('hidden');
  document.getElementById('explanation-text').textContent = '';

  // Кнопка "Наступне" — скидаємо
  document.getElementById('btn-next').classList.add('hidden');

  // Варіанти відповідей
  const list = document.getElementById('options-list');
  list.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const li = document.createElement('li');
    li.className = 'option-item';
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.innerHTML = `
      <span class="option-letter">${letters[i]}</span>
      <span class="option-text">${opt}</span>
    `;

    li.addEventListener('click', () => handleAnswer(i, q));
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') handleAnswer(i, q);
    });

    list.appendChild(li);
  });
}

// Обробка вибору відповіді
function handleAnswer(selectedIdx, q) {
  if (answered) return;
  answered = true;

  const items = document.querySelectorAll('.option-item');
  items.forEach(el => el.classList.add('disabled'));

  const isCorrect = selectedIdx === q.correct;

  if (isCorrect) {
    score++;
    items[selectedIdx].classList.add('correct');
    document.getElementById('score-display').textContent = score;
    animateScore();
    launchMiniConfetti();
  } else {
    items[selectedIdx].classList.add('wrong');
    items[q.correct].classList.add('correct');

    // Показуємо пояснення лише при помилці
    const exBox = document.getElementById('explanation-box');
    document.getElementById('explanation-text').textContent = q.explanation || '';
    exBox.classList.remove('hidden');
  }

  document.getElementById('btn-next').classList.remove('hidden');
}

function animateScore() {
  const el = document.getElementById('score-display');
  el.classList.remove('score-pop');
  void el.offsetWidth;
  el.classList.add('score-pop');
}

function launchMiniConfetti() {
  confetti({
    particleCount: 60,
    spread: 55,
    origin: { y: 0.65 },
    colors: ['#34C759', '#007AFF', '#5AC8FA', '#FFD60A'],
    ticks: 120,
  });
}

// Перехід до наступного питання або до результату
export function nextQuestion(onFinish) {
  current++;
  if (current >= ROUND_SIZE) {
    onFinish(score);
  } else {
    const lang = localStorage.getItem('pm-quiz-lang') || 'uk';
    renderQuestion(lang);
  }
}

// Великий конфеті при фінальному результаті
export function launchFinalConfetti(score) {
  if (score < 10) return;
  const count = score >= 16 ? 200 : score >= 12 ? 120 : 60;
  confetti({ particleCount: count, spread: 80, origin: { y: 0.55 } });
}

// Формуємо повідомлення залежно від результату
export function getResultEmoji(score) {
  if (score >= 18) return '🏆';
  if (score >= 14) return '🎉';
  if (score >= 10) return '👍';
  return '📚';
}
