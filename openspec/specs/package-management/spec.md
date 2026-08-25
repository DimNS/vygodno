## Purpose

Управление зависимостями проекта через пакетный менеджер bun вместо npm.

## Requirements

### Requirement: Установка зависимостей

Команда `bun install` должна устанавливать все зависимости из `package.json` и создавать файл блокировки `bun.lock`.

#### Scenario: Чистая установка
- **WHEN** разработчик выполняет `bun install` в корне проекта
- **THEN** зависимости устанавливаются в `node_modules/` и создаётся файл `bun.lock`

#### Scenario: Установка после обновления package.json
- **WHEN** `package.json` изменён и выполнен `bun install`
- **THEN** зависимости обновляются согласно изменениям в `package.json`

### Requirement: Запуск скриптов

Команда `bun run <script>` должна выполнять скрипты, определённые в `package.json` → `scripts`.

#### Scenario: Запуск dev-сервера
- **WHEN** разработчик выполняет `bun run dev`
- **THEN** запускается dev-сервер Vite (аналог `npm run dev`)

#### Scenario: Запуск сборки
- **WHEN** разработчик выполняет `bun run build`
- **THEN** выполняется production-сборка через Vite

### Requirement: Формат блокировки

Проект SHALL использовать `bun.lock` вместо `package-lock.json` для фиксации версий зависимостей.

#### Scenario: Версионирование зависимостей
- **WHEN** `bun.lock` присутствует в репозитории
- **THEN** версии зависимостей фиксируются и воспроизводимы для всех разработчиков
