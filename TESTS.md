# Tests / Manual verification

This file describes quick manual test steps and a small smoke-test you can run from PowerShell to confirm the app serves and basic functionality works.

Manual steps
1. Open `index.html` in a browser (double-click or right-click -> Open with).
2. Add a todo by typing text and pressing Enter or clicking "Add".
3. Verify the todo appears in the list and the counts update.
4. Toggle completion by clicking the checkbox — the item should show as completed and counts update.
5. Double-click the todo text (or press Enter while focused) to edit. Press Enter to save or Esc to cancel.
6. Click "Delete" to remove an item; use "Clear completed" to remove all completed todos.
7. Refresh the page — todos should persist (localStorage key: `todos-v1`).
8. Export todos: Click the Export button. A file `todos.json` should download containing the current todos.
9. Import todos: Click Import and select a previously exported `todos.json` file. Confirm replacement when prompted; the UI should reflect the imported list.

Quick smoke test (PowerShell)

Open PowerShell and run these commands to start a simple server and make a quick GET request (requires Python installed):

```powershell
cd "c:\Users\anura\Desktop\Test\todo-app"
# start server in a separate terminal or background
python -m http.server 8000; # stops when you Ctrl+C the terminal
# In another terminal run a simple header check:
Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing | Select-Object -Property StatusCode, StatusDescription
```

Alternative one-liner (start server in background, then request headers, then stop Python processes):

```powershell
cd "c:\Users\anura\Desktop\Test\todo-app"; Start-Process -NoNewWindow -FilePath python -ArgumentList '-m','http.server','8000'; Start-Sleep -Seconds 1; Invoke-WebRequest -Uri http://localhost:8000 -UseBasicParsing | Select-Object -Property StatusCode, StatusDescription; Get-Process -Name python | Stop-Process
```

Expected results
- StatusCode should be 200 and StatusDescription should be "OK" for the GET request.
- Manual tests above should behave as described and data should persist across reloads.

Notes
- Data is saved in localStorage under key `todos-v1`.
- If you want an automated test harness (Puppeteer/Playwright) I can add it, but that requires adding dev dependencies. Let me know if you want that.
