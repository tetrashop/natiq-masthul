const express = require('express');
const fetch = require('node-fetch');

class SystemIntegrator {
    constructor() {
        this.app = express();
        this.port = 3021;
        this.knowledgeBaseUrl = 'http://localhost:3018';
        this.gmailSystemUrl = 'http://localhost:3020';
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.use(express.json());

        // Route اصلی
        this.app.get('/', (req, res) => {
            res.json({
                message: '🔗 سیستم یکپارچه نطق مصطلح',
                status: 'فعال',
                subsystems: {
                    knowledgeBase: this.knowledgeBaseUrl,
                    gmailProcessor: this.gmailSystemUrl,
                    nlpProcessor: 'http://localhost:3004'
                },
                endpoints: [
                    'GET /status - وضعیت تمام سامانه‌ها',
                    'POST /sync/approved - همگام‌سازی آیتم‌های تأیید شده',
                    'GET /stats - آمار کامل سیستم'
                ]
            });
        });

        // وضعیت تمام سامانه‌ها
        this.app.get('/status', async (req, res) => {
            try {
                const [knowledgeStatus, gmailStatus, nlpStatus] = await Promise.all([
                    this.checkKnowledgeBaseStatus(),
                    this.checkGmailSystemStatus(),
                    this.checkNLPStatus()
                ]);

                res.json({
                    success: true,
                    systems: {
                        knowledgeBase: knowledgeStatus,
                        gmailProcessor: gmailStatus,
                        nlpProcessor: nlpStatus
                    },
                    overall: this.calculateOverallStatus(knowledgeStatus, gmailStatus, nlpStatus)
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // همگام‌سازی آیتم‌های تأیید شده با پایگاه دانش اصلی
        this.app.post('/sync/approved', async (req, res) => {
            try {
                // دریافت آیتم‌های تأیید شده از سیستم Gmail
                const gmailResponse = await fetch(`${this.gmailSystemUrl}/knowledge?status=approved`);
                const gmailData = await gmailResponse.json();

                if (!gmailData.success) {
                    throw new Error('خطا در دریافت داده از سیستم Gmail');
                }

                const syncedItems = [];

                // اضافه کردن هر آیتم به پایگاه دانش اصلی
                for (const item of gmailData.items) {
                    const syncResult = await this.syncItemToKnowledgeBase(item);
                    if (syncResult.success) {
                        syncedItems.push(syncResult.item);
                    }
                }

                res.json({
                    success: true,
                    syncedCount: syncedItems.length,
                    items: syncedItems
                });

            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // آمار کامل سیستم
        this.app.get('/stats', async (req, res) => {
            try {
                const [knowledgeStats, gmailStats] = await Promise.all([
                    this.getKnowledgeBaseStats(),
                    this.getGmailSystemStats()
                ]);

                res.json({
                    success: true,
                    stats: {
                        knowledgeBase: knowledgeStats,
                        gmailSystem: gmailStats,
                        integration: {
                            totalIntegratedItems: knowledgeStats.totalItems + gmailStats.totalItems,
                            activeSystems: 2
                        }
                    }
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }

    async checkKnowledgeBaseStatus() {
        try {
            const response = await fetch(`${this.knowledgeBaseUrl}/health`);
            const data = await response.json();
            return { status: 'active', data };
        } catch (error) {
            return { status: 'inactive', error: error.message };
        }
    }

    async checkGmailSystemStatus() {
        try {
            const response = await fetch(`${this.gmailSystemUrl}/`);
            const data = await response.json();
            return { status: 'active', data };
        } catch (error) {
            return { status: 'inactive', error: error.message };
        }
    }

    async checkNLPStatus() {
        try {
            const response = await fetch('http://localhost:3004/health');
            const data = await response.json();
            return { status: 'active', data };
        } catch (error) {
            return { status: 'inactive', error: error.message };
        }
    }

    calculateOverallStatus(kbStatus, gmailStatus, nlpStatus) {
        const activeSystems = [kbStatus, gmailStatus, nlpStatus].filter(sys => sys.status === 'active').length;
        return {
            activeSystems,
            totalSystems: 3,
            health: activeSystems >= 2 ? 'good' : 'degraded'
        };
    }

    async syncItemToKnowledgeBase(item) {
        try {
            const response = await fetch(`${this.knowledgeBaseUrl}/api/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: item.title,
                    content: item.content,
                    category: item.category,
                    tags: item.tags
                })
            });

            const result = await response.json();

            return {
                success: result.success,
                item: result.item,
                message: result.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getKnowledgeBaseStats() {
        try {
            const response = await fetch(`${this.knowledgeBaseUrl}/api/analytics`);
            const data = await response.json();
            return data.analytics || { totalItems: 0, totalViews: 0 };
        } catch (error) {
            return { totalItems: 0, totalViews: 0, error: error.message };
        }
    }

    async getGmailSystemStats() {
        try {
            const response = await fetch(`${this.gmailSystemUrl}/knowledge`);
            const data = await response.json();
            
            if (data.success) {
                const items = data.items || [];
                const approved = items.filter(item => item.status === 'approved').length;
                const pending = items.filter(item => item.status === 'pending').length;
                const rejected = items.filter(item => item.status === 'rejected').length;

                return {
                    totalItems: items.length,
                    approved: approved,
                    pending: pending,
                    rejected: rejected
                };
            }
            
            return { totalItems: 0, approved: 0, pending: 0, rejected: 0 };
        } catch (error) {
            return { totalItems: 0, approved: 0, pending: 0, rejected: 0, error: error.message };
        }
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log('🎉 =================================');
            console.log('🔗 سیستم یکپارچه راه‌اندازی شد!');
            console.log('📍 پورت:', this.port);
            console.log('🌐 آدرس: http://localhost:' + this.port);
            console.log('🎉 =================================');
        });
    }
}

const integrator = new SystemIntegrator();
integrator.start();
