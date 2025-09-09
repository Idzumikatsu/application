# MCP — Fetch (server_name=fetch)

Этот документ описывает инструмент fetch, предоставляющий доступ в интернет для получения HTML/Markdown/JSON контента.

Источник правды: [.kilocode/mcp.json](../mcp.json)

Важно:
- Инструмент теперь дает доступ к сети: можно получать актуальную информацию с внешних URL.
- Для длинных страниц используйте start_index и max_length, чтобы извлекать содержимое частями.
- Для сырого HTML установите raw=true.

---

## Инструмент

### fetch
Описание: Выполняет HTTP(S)-запрос к указанному URL и возвращает содержимое. Может возвращать упрощенный контент (Markdown) или сырой HTML.

Параметры:
- url (string, required) — URL ресурса (должен быть корректным URI)
- max_length (integer, optional, default 5000, exclusiveMax 1000000) — Максимальный размер возвращаемых данных
- start_index (integer, optional, default 0) — Смещение начала вывода (полезно для постраничного чтения длинного документа)
- raw (boolean, optional, default false) — Вернуть сырой HTML (true) вместо упрощенного контента (false)

Примеры:
```xml
<!-- Получить JSON -->
<use_mcp_tool>
<server_name>fetch</server_name>
<tool_name>fetch</tool_name>
<arguments>
{
  "url": "https://api.github.com/rate_limit"
}
</arguments>
</use_mcp_tool>

<!-- Длинный документ частями -->
<use_mcp_tool>
<server_name>fetch</server_name>
<tool_name>fetch</tool_name>
<arguments>
{
  "url": "https://example.com/docs/long",
  "max_length": 10000,
  "start_index": 10000
}
</arguments>
</use_mcp_tool>

<!-- Сырой HTML -->
<use_mcp_tool>
<server_name>fetch</server_name>
<tool_name>fetch</tool_name>
<arguments>
{
  "url": "https://example.com",
  "raw": true
}
</arguments>
</use_mcp_tool>