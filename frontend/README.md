
# NexLearn Frontend (Next.js + Tailwind)

- `npm i`
- `npm run dev` (runs on http://localhost:3000)
- API routes under `/pages/api/*` proxy to the real server (`https://nexlearn.noviindusdemosites.in`), so CORS is bypassed.
- Screens: phone -> verify -> profile -> instructions -> exam -> result.

> Note: For `create-profile` proxy we used formidable to forward multipart. If you see build errors, run:
`npm i formidable form-data`

