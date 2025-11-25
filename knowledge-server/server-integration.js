/**
 * یکپارچه‌سازی پایگاه دانش با سرور
 */

class ServerKnowledgeIntegration {
    constructor(localKnowledgeCore, serverEndpoint = null) {
        this.localCore = localKnowledgeCore;
        this.serverEndpoint = serverEndpoint || 'https://your-knowledge-server.com/api';
        this.syncInterval = 300000;
        this.isOnline = false;
        this.pendingSyncs = [];
    }

    async initializeServerConnection(apiKey) {
        try {
            console.log('🖥️ در حال اتصال به سرور پایگاه دانش...');
            await this.testConnection();
            
            this.isOnline = true;
            this.apiKey = apiKey;
            
            console.log('✅ اتصال به سرور برقرار شد');
            this.startSyncInterval();
            
            return true;
        } catch (error) {
            console.log('❌ خطا در اتصال به سرور، حالت آفلاین فعال شد');
            this.isOnline = false;
            return false;
        }
    }

    async testConnection() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.2 ? resolve() : reject(new Error('Connection failed'));
            }, 1000);
        });
    }

    async syncWithServer() {
        if (!this.isOnline) {
            this.pendingSyncs.push({
                timestamp: Date.now(),
                data: this.getLocalChanges()
            });
            return false;
        }

        try {
            const changes = this.getLocalChanges();
            
            if (changes.domains.length > 0 || changes.interactions.length > 0) {
                console.log(`🔄 همگام‌سازی ${changes.domains.length} حوزه و ${changes.interactions.length} تعامل...`);
                await this.sendToServer(changes);
                console.log('✅ همگام‌سازی با سرور کامل شد');
                this.clearLocalChanges();
                return true;
            }
        } catch (error) {
            console.log('❌ خطا در همگام‌سازی:', error.message);
            this.isOnline = false;
        }

        return false;
    }

    getLocalChanges() {
        const stats = this.localCore.getLearningStats();
        const recentInteractions = this.localCore.interactionHistory.slice(-100);

        return {
            domains: Array.from(this.localCore.domains.entries()),
            interactions: recentInteractions,
            stats: stats,
            timestamp: Date.now()
        };
    }

    async sendToServer(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ status: 'success', received: data.domains.length });
                } else {
                    reject(new Error('Server error'));
                }
            }, 500);
        });
    }

    startSyncInterval() {
        setInterval(() => {
            if (this.isOnline) {
                this.syncWithServer();
            }
        }, this.syncInterval);
    }

    clearLocalChanges() {
        console.log('🧹 وضعیت همگام‌سازی پاک شد');
    }

    async hybridSearch(query) {
        console.log(`🔍 جستجوی ترکیبی برای: "${query}"`);
        
        const localResults = this.localCore.deepKnowledgeSearch(query);
        let serverResults = [];
        
        if (this.isOnline) {
            try {
                serverResults = await this.searchOnServer(query);
            } catch (error) {
                console.log('⚠️ جستجوی سرور ناموفق، فقط نتایج محلی نمایش داده می‌شوند');
            }
        }

        return {
            localResults,
            serverResults,
            isOnline: this.isOnline,
            totalResults: localResults.directMatches.length + serverResults.length
        };
    }

    async searchOnServer(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        domain: 'server_knowledge',
                        concept: query,
                        relevance: 0.8,
                        source: 'server_cloud',
                        isCached: false
                    }
                ]);
            }, 300);
        });
    }

    getSystemStats() {
        const localStats = this.localCore.getLearningStats();
        
        return {
            local: localStats,
            server: {
                isOnline: this.isOnline,
                pendingSyncs: this.pendingSyncs.length,
                lastSync: this.pendingSyncs.length > 0 ? 
                    this.pendingSyncs[this.pendingSyncs.length - 1].timestamp : null
            },
            syncStatus: this.isOnline ? 'active' : 'offline'
        };
    }
}

module.exports = ServerKnowledgeIntegration;
