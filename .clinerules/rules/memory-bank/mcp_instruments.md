# CRM Synergy — MCP инструменты: обзор и структура документации

Этот файл содержит высокоуровневое описание доступных MCP-серверов и инструментов, их назначение и ссылки на подробные документы. Подробные спецификации вынесены в отдельные файлы в этой же папке для удобной поэтапной доработки и чтения.

Источник правды по составу серверов/инструментов: [.kilocode/mcp.json](.kilocode/mcp.json)

Важно:
- Все примеры вызовов оформляются в XML-формате MCP: см. разделы конкретных инструментов.
- Подробные разделы со списком команд, параметров, примерами и примечаниями размещаются в отдельных файлах, ссылки ниже.

---

## Содержание (обзор)
1) GitHub (server_name=github) — работа с репозиториями, PR/Issues, Actions/Workflows, логами, уведомлениями, сканированием
   - Подробно: ./mcp_github.md
2) Filesystem (server_name=filesystem) — операции с файлами/директориями в разрешенных путях
   - Подробно: ./mcp_filesystem.md
3) Playwright (server_name=playwright) — управление браузером, навигация, ввод, клики, скриншоты, сеть
   - Подробно: ./mcp_playwright.md
4) Context7 (server_name=context7) — получение актуальной документации и примеров библиотек
   - Подробно: ./mcp_context7.md
5) Fetch (server_name=fetch) — доступ в интернет, получение HTML/Markdown контента
   - Подробно: ./mcp_fetch.md
6) Memory (server_name=memory) — граф знаний: сущности, отношения, наблюдения, поиск
   - Подробно: ./mcp_memory.md
7) Sequential Thinking (server_name=sequentialthinking) — поэтапное мышление/планирование
   - Подробно: ./mcp_sequentialthinking.md

---

## 1) GitHub (github) — обзор

Назначение: доступ к операциям GitHub API: репозитории, ветки, файлы, PR/Issues, комментарии, ревью, Actions/Workflows, логи, уведомления, сканирование (code/dependabot/secret) и др.

Краткое использование:
- Получить информацию о себе: см. get_me в [./mcp_github.md](./mcp_github.md)
- Просмотреть инструменты сервера: list_tools
- Работать с файлами: get_file_contents, create_or_update_file, delete_file
- Действия с PR: create_pull_request, get/update/merge PR, ревью-инструменты
- Actions/Workflows: run_workflow, list_workflow_runs, get_job_logs, get_workflow_run_logs

См. подробную спецификацию и примеры: [./mcp_github.md](./mcp_github.md)

---

## 2) Filesystem (filesystem) — обзор

Назначение: чтение/запись, правки и навигация по файлам/каталогам в разрешенных директориях.

Краткое использование:
- Базовые операции: read_file, write_file, read_multiple_files, edit_file
- Навигация и метаданные: list_directory, list_directory_with_sizes, directory_tree, get_file_info
- Управление: create_directory, move_file, list_allowed_directories, search_files
- Точечные правки: search_and_replace, apply_diff, insert_content

См. подробную спецификацию и примеры: [./mcp_filesystem.md](./mcp_filesystem.md)

---

## 3) Playwright (playwright) — обзор

Назначение: управление браузером для e2e-навигации и интеракций.

Краткое использование:
- Навигация: browser_navigate
- Взаимодействия: browser_click, browser_type, browser_press_key
- Наблюдаемость: browser_take_screenshot, browser_snapshot, browser_console_messages, browser_network_requests
- Синхронизация: browser_wait_for
- Управление вкладками/размером: browser_tab_*, browser_resize, browser_close

См. подробную спецификацию и примеры: [./mcp_playwright.md](./mcp_playwright.md)

---

## 4) Context7 (context7) — обзор

Назначение: получение актуальной документации по библиотекам/пакетам.

Краткое использование:
- Сначала resolve-library-id, затем get-library-docs
- Настройка темы через параметр topic, ограничение размера через tokens

См. подробную спецификацию и примеры: [./mcp_context7.md](./mcp_context7.md)

---

## 5) Fetch (fetch) — обзор

Назначение: HTTP(S)-запросы в интернет, получение данных, опционально сырых HTML.

Краткое использование:
- fetch с параметрами url, max_length, start_index, raw
- Подходит для загрузки JSON, HTML, Markdown; поддерживает частичное чтение длинных страниц

См. подробную спецификацию и примеры: [./mcp_fetch.md](./mcp_fetch.md)

---

## 6) Memory (memory) — обзор

Назначение: работа с графом знаний: сущности, отношения, наблюдения, поиск и чтение.

Краткое использование:
- Создание/обновление: create_entities, add_observations, create_relations
- Удаление: delete_entities, delete_observations, delete_relations
- Чтение/поиск: read_graph, search_nodes, open_nodes

См. подробную спецификацию и примеры: [./mcp_memory.md](./mcp_memory.md)

---

## 7) Sequential Thinking (sequentialthinking) — обзор

Назначение: пошаговое планирование, рефлексия и ветвления мыслительного процесса.

Краткое использование:
- Инструмент sequentialthinking с параметрами thought, nextThoughtNeeded, thoughtNumber, totalThoughts, и опциональными флагами пересмотра

См. подробную спецификацию и примеры: [./mcp_sequentialthinking.md](./mcp_sequentialthinking.md)

---

## Примечания по формату примеров

- Все примеры вызовов MCP оформляются тегами:
  - Для инструментов MCP-серверов: формат [`xml.use_mcp_tool()`](mcp_instruments.md:1)
- При вставке кода/путей в других документах используйте кликабельные ссылки формата:
  - Файлы: [`relative/path.md`](./relative/path.md)
  - Конструкции/вызовы: [`server.tool_name()`](./mcp_instruments.md:1)
