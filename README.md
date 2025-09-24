# Temtseen

## Орчны хувьсагчид

`.env.example` файлыг хуулж `.env` болгон өөрчлөөд доорх утгуудыг бөглөнө үү.

```bash
OPENAI_API_KEY=your_openai_api_key_here
MANDAX_PROMPT_ID=pmpt_68d3f38ef4048196adfa404d6e7eb56d0602415a6bfbe225
SESSION_SECRET=change_me
```

## API тест

```bash
curl -i http://0.0.0.0:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"тэтгэлэг"}]}'
```

`200 OK` ба `{ "reply": "..." }` хариу авбал сервер зөв ажиллаж байна.
