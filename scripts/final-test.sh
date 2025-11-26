#!/bin/bash
echo "🧪 تست نهایی سیستم خودآگاه..."

# تست سلامت
echo "1. تست سلامت:"
curl "https://natiq-masthul.ramin-edjlal1359.workers.dev/health"

echo -e "\n\n2. تست سوال نامرتبط:"
curl -X POST "https://natiq-masthul.ramin-edjlal1359.workers.dev/api/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "همسر رامین اجلال کیست؟"}'

echo -e "\n\n3. تست سوال مرتبط:"
curl -X POST "https://natiq-masthul.ramin-edjlal1359.workers.dev/api/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "تحصیلات رامین اجلال چیست؟"}'
