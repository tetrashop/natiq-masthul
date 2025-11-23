#!/bin/bash

echo "🚀 FINAL SYSTEM MANAGER"
echo "======================"

KNOWLEDGE_PORT=3018
NLP_PORT=3004

case "$1" in
    "start")
        echo "Starting Knowledge Base on port $KNOWLEDGE_PORT..."
        if ! curl -s http://localhost:$KNOWLEDGE_PORT/health > /dev/null; then
            node knowledge-base-simple.js &
            echo "✅ Knowledge Base started"
        else
            echo "⚠️ Knowledge Base already running"
        fi
        
        echo "Starting NLP Server on port $NLP_PORT..."
        if ! curl -s http://localhost:$NLP_PORT/health > /dev/null; then
            if [ -f "stable-nlp-server.js" ]; then
                node stable-nlp-server.js &
                echo "✅ NLP Server started"
            else
                echo "❌ stable-nlp-server.js not found"
            fi
        else
            echo "⚠️ NLP Server already running"
        fi
        ;;
        
    "stop")
        echo "Stopping all servers..."
        pkill -f "knowledge-base-simple" 2>/dev/null
        pkill -f "stable-nlp-server" 2>/dev/null
        sleep 2
        echo "✅ All servers stopped"
        ;;
        
    "status")
        echo "📊 SYSTEM STATUS"
        echo "---------------"
        
        # Knowledge Base
        echo -n "🧠 Knowledge Base ($KNOWLEDGE_PORT): "
        if curl -s http://localhost:$KNOWLEDGE_PORT/health > /dev/null; then
            echo "✅ RUNNING"
            ITEMS=$(curl -s http://localhost:$KNOWLEDGE_PORT/api/analytics | grep -o '"totalItems":[0-9]*' | cut -d: -f2)
            echo "   📚 Items: $ITEMS"
        else
            echo "❌ STOPPED"
        fi
        
        # NLP Server
        echo -n "📝 NLP Server ($NLP_PORT): "
        if curl -s http://localhost:$NLP_PORT/health > /dev/null; then
            echo "✅ RUNNING"
            POSTS=$(curl -s http://localhost:$NLP_PORT/health | grep -o '"postsCount":[0-9]*' | cut -d: -f2)
            echo "   📄 Posts: $POSTS"
        else
            echo "❌ STOPPED"
        fi
        ;;
        
    "test")
        echo "🧪 COMPREHENSIVE TEST"
        echo "--------------------"
        
        # Test Knowledge Base
        echo "1. Testing Knowledge Base:"
        curl -s http://localhost:$KNOWLEDGE_PORT/health | grep -o '"status":"[^"]*"' || echo "❌ Failed"
        
        echo "2. Testing Knowledge Base API:"
        curl -s http://localhost:$KNOWLEDGE_PORT/api/items | grep -o '"success":true' && echo "✅ API Working" || echo "❌ API Failed"
        
        echo "3. Testing Search:"
        curl -s "http://localhost:$KNOWLEDGE_PORT/api/search?q=طبیعی" | grep -o '"resultsCount":[0-9]*' || echo "❌ Search Failed"
        
        # Test NLP Server
        echo "4. Testing NLP Server:"
        curl -s http://localhost:$NLP_PORT/health | grep -o '"status":"[^"]*"' || echo "❌ NLP Server Failed"
        
        echo ""
        echo "✅ Test completed"
        ;;
        
    "logs")
        echo "📋 ACTIVE SERVERS"
        echo "----------------"
        ps aux | grep -E "node.*(knowledge-base-simple|stable-nlp-server)" | grep -v grep
        ;;
        
    "urls")
        echo "🌐 ACCESS URLs"
        echo "-------------"
        echo "🧠 Knowledge Base: http://localhost:$KNOWLEDGE_PORT"
        echo "📝 NLP Server:     http://localhost:$NLP_PORT"
        echo ""
        echo "🔗 Quick links:"
        echo "  Knowledge Health: curl http://localhost:$KNOWLEDGE_PORT/health"
        echo "  Knowledge Items:  curl http://localhost:$KNOWLEDGE_PORT/api/items"
        echo "  NLP Health:       curl http://localhost:$NLP_PORT/health"
        ;;
        
    *)
        echo "Usage: $0 {start|stop|status|test|logs|urls}"
        echo ""
        echo "Commands:"
        echo "  start  - Start all servers"
        echo "  stop   - Stop all servers"
        echo "  status - Show system status" 
        echo "  test   - Run comprehensive tests"
        echo "  logs   - Show active servers"
        echo "  urls   - Show access URLs"
        ;;
esac
