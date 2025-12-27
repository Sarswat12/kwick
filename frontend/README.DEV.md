Run the development server (PowerShell)

cd 'c:\xampp\htdocs\kwick\kwckf\app'
# Install dependencies (only needed once)
npm install

# Start dev server (foreground)
npm run dev

# Start dev server (explicit port, background behavior depends on terminal)
npm run dev:bg

Notes:
- Vite opens the browser automatically by default because `server.open` is set in `vite.config.ts`.
- If the editor still shows type errors for React, ensure `@types/react` and `@types/react-dom` are installed as devDependencies (they were installed automatically).
