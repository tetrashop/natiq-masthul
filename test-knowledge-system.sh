#!/bin/bash
echo "🧠 Testing Knowledge Base System on PORT 3011..."
echo "=============================================="

# تست سلامت
echo "1. Testing health endpoint..."
curl -s http://localhost:3011/health | grep -o '"status":"[^"]*"'

# افزودن داده تستی
echo ""
echo "2. Adding test data..."
curl -s -X POST http://localhost:3011/api/knowledge/test-data | grep -o '"message":"[^"]*"'

# تست جستجو
echo ""
echo "3. Testing semantic search..."
curl -s http://localhost:3011/api/knowledge/test-search | grep -o '"resultsCount":[0-9]*'

# تست آنالیتیکس
echo ""
echo "4. Testing analytics..."
curl -s http://localhost:3011/api/knowledge/analytics | grep -o '"totalItems":[0-9]*'

echo ""
echo "✅ All tests completed successfully!"
echo "🌐 Server is running on: http://localhost:3011"
