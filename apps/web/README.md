# Фронтенд магазина

Каталог, корзина, оформление, оплата тестовой картой и наличными при получении.
Next.js 16 (App Router), TypeScript, TanStack Query.

Условия: [задание](../../docs/ASSIGNMENT.md) · [интеграция](../../docs/INTEGRATION.md) ·
[критерии](../../docs/EVALUATION.md).

## Запуск

Из корня репозитория, после `npm ci`, в двух терминалах:

```sh
npm run dev        # бэкенд, http://localhost:4000
npm run dev:web    # фронтенд, http://localhost:3000
```

Адрес API берётся из `NEXT_PUBLIC_API_URL`. Если бэкенд поднят на другом порту, скопируйте
`apps/web/.env.example` в `apps/web/.env.local` и поправьте значение.

```sh
npm run build:web       # сборка
npm run start:web       # запуск собранного
npm run typecheck:web   # tsc --noEmit
npm run test:web        # юнит-тесты (vitest)
npm run e2e:web         # сквозные сценарии (playwright)
```

Для e2e один раз нужен `npx playwright install chromium` — API и фронтенд Playwright поднимает
сам.

## Как устроено

Слои лежат в `src/`, зависимости направлены внутрь: `core → data → domain → features`.

```
core/      HttpClient, HttpError, Endpoint, журнал идемпотентности, хранилище;
           adapters/fetch — единственное место с fetch во всём приложении
data/      endpoints.ts — единственное место с URL; репозитории, dto/ собирает сущности
domain/    без React: entities/*.entity.ts (данные + правила) и *.service.ts
query/     кэш серверного состояния: <область>/*.queries.ts, ключи, клиент
features/  экраны: *.module.tsx + *.hooks.ts
providers/ сборка графа зависимостей, доступ к сервисам через useXxxService()
ui-kit/    Button, TextField, Fieldset, Alert, Modal, …
```

Поток данных: `страница → модуль фичи → *.hooks.ts → useXxxService() → доменный сервис →
репозиторий → HttpClient`. Компонент в сеть не ходит, заголовки не собирает и ошибки не
разбирает.

## Проверенные сценарии

`npm run e2e:web` — 14 сценариев в браузере, все проходят: оплата картой до подтверждённого
статуса, отказ карты и отмена с повторной оплатой, наличные при получении, курьерская доставка
со стоимостью из API, пустая корзина и товар без остатка, двойное нажатие «Оформить»,
перезагрузка во время ожидания оплаты, сбой сети при расчёте, потерянный ответ на создание
заказа, восстановление сессии после сброса токена, проход на 1280 и 390 px и оформление
с клавиатуры.

`npm run test:web` — 22 юнит-теста на доменные правила и мапперы.

## Затраченное время

Около 4 часов.
