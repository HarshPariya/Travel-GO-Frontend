# Frontend Deployment

Environment variables (set in your hosting dashboard):

```
NEXT_PUBLIC_API_BASE_URL=https://travel-go-backend.onrender.com/api
# Optional; if unset will fall back to base URL above
NEXT_PUBLIC_API_URL=https://travel-go-backend.onrender.com/api
```

Local development:

```
npm install
npm run dev
```

Build and run locally:

```
npm run build
npm start
```

Notes:
- In production, the app will default to the Render backend URL above if no env is set.
- During local dev, requests proxy to `http://localhost:4000/api` via `next.config.js` rewrites when no env is set.


