# MCP — Filesystem (server_name=filesystem)

Этот документ содержит подробную спецификацию инструментов Filesystem MCP: параметры, типы, обязательность и примеры.

Источник правды: [.kilocode/mcp.json](../mcp.json)

---

## Базовые операции

### read_file
- Назначение: прочитать содержимое одного файла
- Параметры: path (string, req), head (number, opt), tail (number, opt)
Примеры:
```xml
<use_mcp_tool>
<server_name>filesystem</server_name>
<tool_name>read_file</tool_name>
<arguments>{ "path": "README.md", "head": 50 }</arguments>
</use_mcp_tool>
```

### write_file
- Назначение: создать/полностью перезаписать файл
- Параметры: path (string, req), content (string, req)
```xml
<use_mcp_tool>
<server_name>filesystem</server_name>
<tool_name>write_file</tool_name>
<arguments>{ "path": "docs/example.txt", "content": "Hello" }</arguments>
</use_mcp_tool>
```

### read_multiple_files
- Назначение: прочитать несколько файлов
- Параметры: paths (array<string>, req)
```xml
<use_mcp_tool>
<server_name>filesystem</server_name>
<tool_name>read_multiple_files</tool_name>
<arguments>{ "paths": ["README.md", ".gitignore"] }</arguments>
</use_mcp_tool>
```

### edit_file
- Назначение: линейные правки (diff)
- Параметры: path (string, req), edits (array<{oldText,newText}>, req), dryRun (boolean, opt)
```xml
<use_mcp_tool>
<server_name>filesystem</server_name>
<tool_name>edit_file</tool_name>
<arguments>{
  "path": "docs/example.txt",
  "edits": [{ "oldText": "Hello", "newText": "Hello CRM" }],
  "dryRun": false
}</arguments>
</use_mcp_tool>
```

---

## Навигация и метаданные

### get_file_info
- Параметры: path (string, req)

### list_directory
- Параметры: path (string, req)

### list_directory_with_sizes
- Параметры: path (string, req), sortBy (string, opt: name|size, default name)

### directory_tree
- Параметры: path (string, req)

Пример:
```xml
<use_mcp_tool>
<server_name>filesystem</server_name>
<tool_name>directory_tree</tool_name>
<arguments>{ "path": "/opt/crm-synergy/apps" }</arguments>
</use_mcp_tool>
```

---

## Управление

### move_file
- Параметры: source (string, req), destination (string, req)

### create_directory
- Параметры: path (string, req)

### list_allowed_directories
- Параметры: нет

### search_files
- Назначение: поиск путей по шаблону имени (не содержимого)
- Параметры: path (string, req), pattern (string, req), excludePatterns (array<string>, opt)

---

## Точечные правки (режим VSCode инструментов)

### search_and_replace
- Назначение: поиск и замена текста/regex
- Параметры: path (string, req), search (string, req), replace (string, req), start_line (number, opt), end_line (number, opt), use_regex (string, opt), ignore_case (string, opt)
Пример:
```xml
<search_and_replace>
<path>example.ts</path>
<search>old\w+</search>
<replace>new$&</replace>
<use_regex>true</use_regex>
<ignore_case>true</ignore_case>
</search_and_replace>
```

### apply_diff
- Назначение: точечные изменения по SEARCH/REPLACE блокам
- Параметры: path (string, req), diff (string, req)
(См. пример в основном файле)

### insert_content
- Назначение: вставка новых строк без изменения существующих
- Параметры: path (string, req), line (number, req), content (string, req)
```xml
<insert_content>
<path>src/utils.ts</path>
<line>0</line>
<content>// конец файла</content>
</insert_content>