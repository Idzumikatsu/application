# MCP — Playwright (server_name=playwright)

Этот документ содержит подробную спецификацию инструментов Playwright MCP: параметры, обязательность и примеры.

Источник правды: [.kilocode/mcp.json](../mcp.json)

Важно:
- Для большинства действий используется адресация элементов через пару element + ref, где ref берется из browser_snapshot.
- Используйте browser_snapshot для получения стабильных ref перед кликами/вводом.

---

## Навигация и ожидания

### browser_navigate
Описание: Перейти по указанному URL.
Параметры: 
- url (string, required)
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_navigate</tool_name>
<arguments>{ "url": "https://example.com" }</arguments>
</use_mcp_tool>
```

### browser_wait_for
Описание: Ждать появления/исчезновения текста или таймаут.
Параметры:
- time (number, optional) — время в секундах
- text (string, optional) — ждать появления текста
- textGone (string, optional) — ждать исчезновения текста
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_wait_for</tool_name>
<arguments>{ "text": "Welcome" }</arguments>
</use_mcp_tool>
```

---

## Взаимодействия с элементами

### browser_click
Описание: Клик по элементу.
Параметры:
- element (string, required)
- ref (string, required)
- doubleClick (boolean, optional)
- button (string, optional; one of: "left"|"right"|"middle")
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_click</tool_name>
<arguments>{ "element": "Login button", "ref": "page:button#login" }</arguments>
</use_mcp_tool>
```

### browser_type
Описание: Ввод текста.
Параметры:
- element (string, required)
- ref (string, required)
- text (string, required)
- submit (boolean, optional)
- slowly (boolean, optional)
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_type</tool_name>
<arguments>{ "element": "Email input", "ref": "page:input#email", "text": "user@example.com", "submit": false, "slowly": true }</arguments>
</use_mcp_tool>
```

### browser_press_key
Описание: Нажатие клавиши.
Параметры:
- key (string, required) — например Enter, Escape, ArrowLeft
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_press_key</tool_name>
<arguments>{ "key": "Enter" }</arguments>
</use_mcp_tool>
```

### browser_select_option
Описание: Выбор значения в select.
Параметры:
- element (string, required)
- ref (string, required)
- values (array<string>, required)
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_select_option</tool_name>
<arguments>{ "element": "Role select", "ref": "page:select#role", "values": ["admin"] }</arguments>
</use_mcp_tool>
```

### browser_drag
Описание: Drag and Drop между элементами.
Параметры:
- startElement (string, required), startRef (string, required)
- endElement (string, required), endRef (string, required)
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_drag</tool_name>
<arguments>{
  "startElement": "Task card",
  "startRef": "page:div#card-1",
  "endElement": "Done column",
  "endRef": "page:div#col-done"
}</arguments>
</use_mcp_tool>
```

---

## Снимки, скриншоты и отладка

### browser_snapshot
Описание: Снимок структуры страницы, возвращает доступные ref элементов.
Параметры: нет
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_snapshot</tool_name>
<arguments>{}</arguments>
</use_mcp_tool>
```

### browser_take_screenshot
Описание: Скриншот экрана или элемента.
Параметры:
- raw (boolean, optional) — PNG без сжатия
- filename (string, optional)
- element (string, optional, вместе с ref)
- ref (string, optional, вместе с element)
- fullPage (boolean, optional)
Примеры:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_take_screenshot</tool_name>
<arguments>{ "filename": "page.jpg", "fullPage": true }</arguments>
</use_mcp_tool>

<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_take_screenshot</tool_name>
<arguments>{ "element": "Profile", "ref": "page:div#profile", "filename": "profile.png", "raw": true }</arguments>
</use_mcp_tool>
```

### browser_console_messages
Описание: Получить все сообщения консоли страницы.
Параметры: нет
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_console_messages</tool_name>
<arguments>{}</arguments>
</use_mcp_tool>
```

### browser_network_requests
Описание: Получить сетевые запросы со страницы.
Параметры: нет
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_network_requests</tool_name>
<arguments>{}</arguments>
</use_mcp_tool>
```

---

## Управление окнами и вкладками

### browser_resize
Описание: Изменить размер окна.
Параметры:
- width (number, required), height (number, required)
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_resize</tool_name>
<arguments>{ "width": 1280, "height": 800 }</arguments>
</use_mcp_tool>
```

### browser_tab_list
Описание: Список вкладок.
Параметры: нет

### browser_tab_new
Описание: Открыть новую вкладку.
Параметры:
- url (string, optional)
Пример:
```xml
<use_mcp_tool>
<server_name>playwright</server_name>
<tool_name>browser_tab_new</tool_name>
<arguments>{ "url": "https://example.com" }</arguments>
</use_mcp_tool>
```

### browser_tab_select
Описание: Выбрать вкладку по индексу.
Параметры:
- index (number, required)

### browser_tab_close
Описание: Закрыть вкладку по индексу (или активную).
Параметры:
- index (number, optional)

---

## Прочее

### browser_hover
Описание: Наведение курсора на элемент.
Параметры:
- element (string, required)
- ref (string, required)

### browser_install
Описание: Установка бинарей браузера, если не установлены.
Параметры: нет

### browser_file_upload
Описание: Загрузка одного или нескольких файлов в input[type=file].
Параметры:
- paths (array<string>, required)

### browser_handle_dialog
Описание: Обработка диалоговых окон.
Параметры:
- accept (boolean, required)
- promptText (string, optional)