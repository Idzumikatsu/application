# MCP — Context7 (server_name=context7)

Этот документ описывает инструменты сервера Context7 для получения актуальной документации и примеров кода по библиотекам.

Источник правды: [.kilocode/mcp.json](../mcp.json)

Важно:
- Перед вызовом get-library-docs необходимо получить корректный Context7-совместимый ID через resolve-library-id, если только ID не указан явно в формате /org/project или /org/project/version.
- При неоднозначных названиях библиотек используйте краткую проверку результата resolve-library-id.

---

## Инструменты

### resolve-library-id
Описание: Находит Context7-совместимый ID библиотеки по названию. Возвращает наиболее релевантное соответствие.
Параметры:
- libraryName (string, required) — Название библиотеки/пакета
Рекомендации:
- Используйте максимально точное имя (например, next.js вместо next)
- При множественных подходящих вариантах выбирается наиболее релевантный по описанию и доверию

Пример:
```xml
<use_mcp_tool>
<server_name>context7</server_name>
<tool_name>resolve-library-id</tool_name>
<arguments>
{
  "libraryName": "next.js"
}
</arguments>
</use_mcp_tool>
```

Ожидаемый ответ (пример):
- Основной ID: /vercel/next.js
- Пояснение: выбран на основе наибольшей релевантности и покрытия документации

---

### get-library-docs
Описание: Получает актуальную документацию/фрагменты кода по библиотеке.
Требование: предварительно нужно иметь точный context7CompatibleLibraryID.
Параметры:
- context7CompatibleLibraryID (string, required) — Точный ID, например /vercel/next.js или /vercel/next.js/v14.3.0
- topic (string, optional) — Узкая тема, например routing, hooks, configuration
- tokens (number, optional, default 10000) — Максимальный объем возвращаемой документации

Примеры:
```xml
<!-- Общая документация без фильтра по теме -->
<use_mcp_tool>
<server_name>context7</server_name>
<tool_name>get-library-docs</tool_name>
<arguments>
{
  "context7CompatibleLibraryID": "/vercel/next.js",
  "tokens": 8000
}
</arguments>
</use_mcp_tool>

<!-- Документация по конкретной теме -->
<use_mcp_tool>
<server_name>context7</server_name>
<tool_name>get-library-docs</tool_name>
<arguments>
{
  "context7CompatibleLibraryID": "/vercel/next.js",
  "topic": "routing",
  "tokens": 6000
}
</arguments>
</use_mcp_tool>
```

---

## Практические советы

1) Сначала всегда выполняйте resolve-library-id, если нет точного ID.
2) При большой библиотеке используйте topic и уменьшайте tokens, чтобы получить релевантные разделы.
3) Для стабильности версий можно фиксировать конкретный version-сегмент в ID.