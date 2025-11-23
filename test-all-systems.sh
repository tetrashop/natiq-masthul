#!/bin/bash

echo "🔍 COMPREHENSIVE SYSTEM TEST"
echo "============================"

# تست سرور دانش
echo ""
echo "1. 🧠 KNOWLEDGE BASE SERVERS:"
echo "----------------------------"

for port in 3015 3020; do
    echo "Testing port $port:"
    curl -s http://localhost:$port/health | grep -o '"status":"[^"]*"' || echo "❌ Not responding"
done

# تست سرور NLP
echo ""
echo "2. 📝 NLP SERVER:"
echo "----------------"
curl -s http://localhost:3004/health | grep -o '"status":"[^"]*"' || echo "❌ Not running"

# پیدا کردن سرور دانش جدید
echo ""
echo "3. 🔍 FINDING NEW KNOWLEDGE SERVERS:"
echo "-----------------------------------"
ps aux | grep "knowledge-server" | grep -v grep | while read line; do
    port=$(echo $line | grep -o "301[0-9]" | head -1)
    if [ ! -z "$port" ]; then
        echo "Testing knowledge server on port $port:"
        curl -s http://localhost:$port/test | grep -o '"success":true' && echo "✅ Active" || echo "❌ Failed"
    fi
done

echo ""
echo "🎯 TEST COMPLETED!"
