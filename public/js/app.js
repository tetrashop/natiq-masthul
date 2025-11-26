class NatiqChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.questionInput = document.getElementById('questionInput');
        this.sendButton = document.getElementById('sendButton');
        this.questionsCount = 0;
        this.totalScore = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSystemStatus();
        this.updateTime();
        
        // به‌روزرسانی زمان هر ثانیه
        setInterval(() => this.updateTime(), 1000);
        
        // به‌روزرسانی وضعیت سیستم هر 30 ثانیه
        setInterval(() => this.updateSystemStatus(), 30000);
    }

    setupEventListeners() {
        // ارسال با کلیک
        this.sendButton.addEventListener('click', () => this.sendQuestion());
        
        // ارسال با Enter
        this.questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendQuestion();
            }
        });
        
        // سوالات سریع
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.questionInput.value = btn.dataset.question;
                this.sendQuestion();
            });
        });
        
        // اتو ریزایز textarea
        this.questionInput.addEventListener('input', this.autoResize.bind(this));
    }

    autoResize() {
        this.questionInput.style.height = 'auto';
        this.questionInput.style.height = this.questionInput.scrollHeight + 'px';
    }

    async sendQuestion() {
        const question = this.questionInput.value.trim();
        if (!question) return;

        // غیرفعال کردن دکمه
        this.sendButton.disabled = true;
        
        // نمایش سوال کاربر
        this.addUserMessage(question);
        this.questionInput.value = '';
        this.autoResize();
        
        // نمایش تایپینگ
        const typingId = this.showTypingIndicator();
        
        try {
            const response = await this.apiRequest(question);
            this.removeTypingIndicator(typingId);
            
            if (response.success) {
                this.addSystemMessage(response.answer, response.scores);
                this.updateStats(response.scores.combinedScore);
            } else {
                this.addSystemMessage('خطا در پردازش سوال: ' + response.error);
            }
        } catch (error) {
            this.removeTypingIndicator(typingId);
            this.addSystemMessage('خطا در ارتباط با سرور');
            console.error('Error:', error);
        }
        
        // فعال کردن دکمه
        this.sendButton.disabled = false;
        this.questionInput.focus();
    }

    async apiRequest(question) {
        // استفاده از POST برای ارسال سوال
        const response = await fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });
        
        return await response.json();
    }

    addUserMessage(text) {
        const messageHtml = `
            <div class="message user-message">
                <div class="message-avatar">👤</div>
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(text)}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
        this.questionsCount++;
        this.updateQuestionsCount();
    }

    addSystemMessage(text, scores = null) {
        let scoreHtml = '';
        if (scores) {
            scoreHtml = `<span class="score-badge">خرد: ${(scores.wisdomScore * 100).toFixed(0)}%</span>`;
        }
        
        const messageHtml = `
            <div class="message system-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="message-text">${scoreHtml}${this.escapeHtml(text)}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', messageHtml);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingId = 'typing-' + Date.now();
        const typingHtml = `
            <div class="message system-message" id="${typingId}">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', typingHtml);
        this.scrollToBottom();
        return typingId;
    }

    removeTypingIndicator(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async updateSystemStatus() {
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            document.getElementById('wisdomLevel').textContent = (data.system.wisdomLevel * 100).toFixed(0) + '%';
            document.getElementById('efficiencyLevel').textContent = (data.performance.efficiency * 100).toFixed(0) + '%';
            
            // آپدیت وضعیت سیستم
            const statusElement = document.querySelector('.status-dot');
            const statusText = document.querySelector('.status span:last-child');
            
            if (data.system.status === 'ready') {
                statusElement.style.background = '#48bb78';
                statusText.textContent = 'سیستم آماده';
            } else {
                statusElement.style.background = '#ed8936';
                statusText.textContent = 'در حال راه‌اندازی';
            }
        } catch (error) {
            console.error('Error updating system status:', error);
        }
    }

    updateStats(score) {
        this.totalScore += score;
        const avgScore = this.questionsCount > 0 ? (this.totalScore / this.questionsCount) : 0;
        
        document.getElementById('avgScore').textContent = (avgScore * 100).toFixed(1) + '%';
    }

    updateQuestionsCount() {
        document.getElementById('questionsCount').textContent = this.questionsCount;
    }

    updateTime() {
        document.getElementById('currentTime').textContent = this.getCurrentTime();
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// راه‌اندازی سیستم زمانی که DOM لود شد
document.addEventListener('DOMContentLoaded', () => {
    new NatiqChat();
});

// سرویس ورکر برای آفلاین
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed'));
}
