# MCP — Sequential Thinking (server_name=sequentialthinking)

Этот документ описывает инструмент sequentialthinking для пошагового, рефлексивного мышления и планирования с возможностью пересмотра шагов, ветвления и изменения оценки общего числа шагов по мере продвижения.

Источник правды: [.kilocode/mcp.json](../mcp.json)

---

## Инструмент

### sequentialthinking
Описание: Выполнение одного мыслительного шага. Поддерживает:
- пометку, что требуется следующий шаг (nextThoughtNeeded)
- пересмотр предыдущего шага (isRevision + revisesThought)
- ветвление процесса (branchFromThought + branchId)
- корректировку оценки общего числа шагов (totalThoughts)
- сигнал о необходимости дополнительных шагов (needsMoreThoughts)

Параметры:
- thought (string, required) — Текущая мысль/шаг
- nextThoughtNeeded (boolean, required) — Нужен ли следующий шаг
- thoughtNumber (integer, required, min 1) — Номер текущего шага
- totalThoughts (integer, required, min 1) — Текущая оценка количества шагов
- isRevision (boolean, optional) — Пересматриваем ли предыдущие шаги
- revisesThought (integer, optional, min 1) — Какой шаг пересматривается (если isRevision=true)
- branchFromThought (integer, optional, min 1) — Идентификатор шага, от которого ветвимся
- branchId (string, optional) — Идентификатор ветви (свободная строка)
- needsMoreThoughts (boolean, optional) — Нужны ли дополнительные шаги сверх totalThoughts

Пример (обычный линейный шаг):
```xml
<use_mcp_tool>
<server_name>sequentialthinking</server_name>
<tool_name>sequentialthinking</tool_name>
<arguments>
{
  "thought": "Разбиваю задачу на подшаги",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 4
}
</arguments>
</use_mcp_tool>
```

Пример (пересмотр шага 2):
```xml
<use_mcp_tool>
<server_name>sequentialthinking</server_name>
<tool_name>sequentialthinking</tool_name>
<arguments>
{
  "thought": "Уточняю критерии успеха для шага 2",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 5,
  "isRevision": true,
  "revisesThought": 2
}
</arguments>
</use_mcp_tool>
```

Пример (ветвление от шага 3):
```xml
<use_mcp_tool>
<server_name>sequentialthinking</server_name>
<tool_name>sequentialthinking</tool_name>
<arguments>
{
  "thought": "Запускаю альтернативное исследование производительности",
  "nextThoughtNeeded": true,
  "thoughtNumber": 4,
  "totalThoughts": 6,
  "branchFromThought": 3,
  "branchId": "perf-branch-A"
}
</arguments>
</use_mcp_tool>
```

---

## Рекомендации по использованию

1) Начинайте с небольшой оценки totalThoughts и корректируйте по мере необходимости.
2) Фиксируйте пересмотры явно (isRevision=true, revisesThought=N), чтобы не терять историю решений.
3) Для параллельных гипотез используйте ветвление: branchFromThought + branchId.
4) Ставьте nextThoughtNeeded=true до тех пор, пока не достигнете устойчивого результата; затем установите false.
5) Если в конце процесса требуются дополнительные шаги — укажите needsMoreThoughts=true и увеличьте totalThoughts.