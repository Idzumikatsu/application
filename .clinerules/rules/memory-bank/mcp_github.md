# MCP — GitHub (server_name=github)

Этот документ содержит подробную спецификацию инструментов GitHub MCP: параметры, типы, обязательность и примеры вызовов.

Источник правды: [.kilocode/mcp.json](../mcp.json)

---

## Базовые

### get_me
Описание: Информация об аутентифицированном пользователе
Параметры: нет
Пример:
```xml
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>get_me</tool_name>
<arguments>{}</arguments>
</use_mcp_tool>
```

### list_tools
Описание: Список инструментов сервера
Параметры: нет
Пример:
```xml
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>list_tools</tool_name>
<arguments>{}</arguments>
</use_mcp_tool>
```

### get_file_contents
Описание: Содержимое файла/директории
Параметры: owner (string, req), repo (string, req), path (string, opt, default "/"), ref (string, opt), sha (string, opt)
Примеры:
```xml
<!-- Файл из default branch -->
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>get_file_contents</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "path": ".github/workflows/ci.yml" }
</arguments>
</use_mcp_tool>

<!-- Директория из ветки main -->
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>get_file_contents</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "path": "/", "ref": "main" }
</arguments>
</use_mcp_tool>
```

---

## Workflows и логи

### get_workflow_run
Описание: Детали workflow run
Параметры: owner (string, req), repo (string, req), run_id (number, req)
Пример:
```xml
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>get_workflow_run</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "run_id": 16770742268 }
</arguments>
</use_mcp_tool>
```

### cancel_workflow_run
Описание: Отменить workflow run
Параметры: owner, repo, run_id — required
Пример:
```xml
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>cancel_workflow_run</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "run_id": 16770742268 }
</arguments>
</use_mcp_tool>
```

### get_workflow_run_logs
Описание: Скачать все логи run (объемно)
Параметры: owner, repo, run_id — required
Пример:
```xml
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>get_workflow_run_logs</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "run_id": 16770742268 }
</arguments>
</use_mcp_tool>
```

### get_job_logs
Описание: Логи конкретной job (job_id) или всех упавших (failed_only=true, нужен run_id)
Параметры: owner (req), repo (req), return_content (opt, default false), failed_only (opt), run_id (req when failed_only), job_id (req for single job), tail_lines (opt, default 500)
Примеры:
```xml
<!-- Одна job -->
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>get_job_logs</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "job_id": 123456789, "return_content": true, "tail_lines": 1000 }
</arguments>
</use_mcp_tool>

<!-- Все упавшие -->
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>get_job_logs</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "failed_only": true, "run_id": 16770742268, "return_content": true }
</arguments>
</use_mcp_tool>
```

---

## Репозитории и Pull Requests

### create_branch
Параметры: owner, repo, branch — required; from_branch — optional
Пример:
```xml
<use_mcp_tool>
<server_name>github</server_name>
<tool_name>create_branch</tool_name>
<arguments>
{ "owner": "Idzumikatsu", "repo": "crm-synergy", "branch": "docs/mcp-update", "from_branch": "main" }
</arguments>
</use_mcp_tool>
```

### create_or_update_file
Параметры: owner, repo, path, content, message, branch — required

### delete_file
Параметры: owner, repo, path, message, branch — required

### create_pull_request
Параметры: owner, repo, title, head, base — required; body, draft, maintainer_can_modify — optional

### get_pull_request / update_pull_request / merge_pull_request
- get_pull_request: owner, repo, pullNumber — required
- update_pull_request: owner, repo, pullNumber — required; title/body/base/state/maintainer_can_modify — optional
- merge_pull_request: owner, repo, pullNumber — required; merge_method, commit_title, commit_message — optional

### Ревью PR (основные)
- create_pending_pull_request_review
- add_comment_to_pending_review
- submit_pending_pull_request_review
- delete_pending_pull_request_review