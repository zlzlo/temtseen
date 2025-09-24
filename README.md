# Temtseen

## API тест

```bash
curl -i http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"тэтгэлэг"}]}'
```

200 OK ба `{ "reply": "..." }` ирвэл сервер зөв ажиллаж байна.
