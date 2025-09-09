# MCP — Memory (server_name=memory)

Этот документ описывает инструменты сервера Memory для работы с графом знаний: сущности, отношения, наблюдения, поиск и чтение.

Источник правды: [.kilocode/mcp.json](../mcp.json)

---

## Назначение

- Хранение и эволюция знаний проекта в виде графа (entities/relations/observations).
- Быстрое добавление новых фактов и связей.
- Поиск по графу с учетом имен, типов и содержимого наблюдений.

---

## Инструменты

### create_entities
Описание: Создать несколько сущностей в графе знаний.
Параметры:
- entities (array<object>, required)
  - name (string, required)
  - entityType (string, required)
  - observations (array<string>, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>create_entities</tool_name>
<arguments>
{
  "entities": [
    {
      "name": "TeacherService",
      "entityType": "Service",
      "observations": ["Handles teacher CRUD", "Emits domain events"]
    }
  ]
}
</arguments>
</use_mcp_tool>
```

### create_relations
Описание: Создать связи между сущностями (активный залог).
Параметры:
- relations (array<object>, required)
  - from (string, required)
  - to (string, required)
  - relationType (string, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>create_relations</tool_name>
<arguments>
{
  "relations": [
    { "from": "TeacherService", "to": "NotificationService", "relationType": "triggers" }
  ]
}
</arguments>
</use_mcp_tool>
```

### add_observations
Описание: Добавить наблюдения к существующим сущностям.
Параметры:
- observations (array<object>, required)
  - entityName (string, required)
  - contents (array<string>, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>add_observations</tool_name>
<arguments>
{
  "observations": [
    { "entityName": "TeacherService", "contents": ["Validates unique email", "Logs creation"] }
  ]
}
</arguments>
</use_mcp_tool>
```

### delete_entities
Описание: Удалить сущности и их связи.
Параметры:
- entityNames (array<string>, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>delete_entities</tool_name>
<arguments>
{ "entityNames": ["LegacyModule"] }
</arguments>
</use_mcp_tool>
```

### delete_observations
Описание: Удалить конкретные наблюдения у сущностей.
Параметры:
- deletions (array<object>, required)
  - entityName (string, required)
  - observations (array<string>, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>delete_observations</tool_name>
<arguments>
{
  "deletions": [
    { "entityName": "TeacherService", "observations": ["Temporary workaround"] }
  ]
}
</arguments>
</use_mcp_tool>
```

### delete_relations
Описание: Удалить связи между сущностями.
Параметры:
- relations (array<object>, required)
  - from (string, required)
  - to (string, required)
  - relationType (string, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>delete_relations</tool_name>
<arguments>
{
  "relations": [
    { "from": "TeacherService", "to": "LegacyNotifier", "relationType": "uses" }
  ]
}
</arguments>
</use_mcp_tool>
```

### read_graph
Описание: Прочитать весь граф знаний.
Параметры: нет
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>read_graph</tool_name>
<arguments>{}</arguments>
</use_mcp_tool>
```

### search_nodes
Описание: Поиск по узлам графа (имя, тип, наблюдения).
Параметры:
- query (string, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>search_nodes</tool_name>
<arguments>
{ "query": "NotificationService" }
</arguments>
</use_mcp_tool>
```

### open_nodes
Описание: Открыть конкретные узлы по именам.
Параметры:
- names (array<string>, required)
Пример:
```xml
<use_mcp_tool>
<server_name>memory</server_name>
<tool_name>open_nodes</tool_name>
<arguments>
{ "names": ["TeacherService", "NotificationService"] }
</arguments>
</use_mcp_tool>