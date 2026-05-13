# Project Management Quiz — PMBOK® 7th Edition

Веб-додаток для підготовки до іспиту PMP на основі PMBOK 7-го видання. 100 питань, 5 категорій, два мови (UA/EN), Apple-стиль дизайн.

## Локальний запуск

```bash
# 1. Встановити залежності
npm install

# 2. Запустити dev-сервер
npm run dev
# → http://localhost:5173
```

## Збірка

```bash
npm run build
# Результат у папці /dist
```

## Деплой на Cloudflare Pages

### Варіант 1 — Автоматично через GitHub Actions

1. Залити репозиторій на GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pm-quiz.git
   git push -u origin main
   ```

2. Створити проєкт на [Cloudflare Pages](https://pages.cloudflare.com/):
   - Dashboard → Pages → Create a project → Connect to Git
   - Вибрати репозиторій
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - Зберегти

3. Додати секрети до GitHub репозиторію (Settings → Secrets → Actions):
   - `CLOUDFLARE_API_TOKEN` — API токен з правами `Cloudflare Pages:Edit`
   - `CLOUDFLARE_ACCOUNT_ID` — ID аккаунту Cloudflare (Dashboard → правий бік)

4. Кожен push до `main` автоматично деплоїть нову версію.

### Варіант 2 — Вручну через Cloudflare Dashboard

1. `npm run build`
2. Cloudflare Dashboard → Pages → Create a project → Upload assets
3. Завантажити папку `dist`

## Структура проєкту

```
├── index.html
├── package.json
├── vite.config.js
├── .github/
│   └── workflows/
│       └── deploy.yml
└── src/
    ├── js/
    │   ├── app.js        # ініціалізація та навігація
    │   ├── quiz.js       # логіка квізу, Fisher-Yates shuffle
    │   └── i18n.js       # перемикання мов
    ├── styles/
    │   ├── main.css      # Apple-стиль
    │   └── animations.css # spring/shake/pulse анімації
    └── locales/
        ├── uk.json       # 100 питань (UA) + UI тексти
        └── en.json       # 100 питань (EN) + UI тексти
```

## Категорії питань

| # | Категорія | Питань |
|---|-----------|--------|
| 1 | Система постачання цінності | 20 |
| 2 | 12 принципів управління | 20 |
| 3 | 8 сфер виконання | 20 |
| 4 | Припасування | 20 |
| 5 | Моделі, методи та артефакти | 20 |

Кожен раунд: **20 рандомних питань** (4 з кожної категорії, Fisher-Yates shuffle).
