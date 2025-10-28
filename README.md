# Todo App (static)

A minimal, accessible Todo single-file app using plain HTML/CSS/JS and browser localStorage for persistence.

Files:

Run / Try it (Windows PowerShell):

PowerShell command to serve the folder (requires Python):
```powershell
cd "c:\Users\anura\Desktop\Test\todo-app"
python -m http.server 8000; # then open http://localhost:8000 in your browser
```

Usage:

Notes:
- `index.html` — main UI
- `styles.css` — styles
- `app.js` — app logic, uses `localStorage` with key `todos-v1`

Run / Try it (Windows PowerShell):
- Option 1: Open `index.html` directly in your browser (double-click or right-click -> Open with)
- Option 2: Start a simple local server and navigate to http://localhost:8000

PowerShell command to serve the folder (requires Python):
```powershell
cd "c:\Users\anura\Desktop\Test\todo-app"
python -m http.server 8000; # then open http://localhost:8000 in your browser
```

Usage:
- Type a todo and press Enter or click Add.
- Double-click a todo (or press Enter while focused) to edit. Press Esc to cancel.
- Use filter buttons to view All / Active / Completed.
- Click Clear completed to remove finished todos.

Import / Export
- Use the Export button to download your todos as `todos.json`.
- Use the Import button to replace the current todos with a previously exported `todos.json` file. The import validates basic structure before replacing.
- Use Clear all to remove all todos (asks for confirmation).

Notes:
- Data persists in localStorage under key `todos-v1`.
- Works in modern browsers.
