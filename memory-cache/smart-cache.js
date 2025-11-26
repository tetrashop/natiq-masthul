class SmartCache {
    constructor(options = {}) {
        this.options = {
            maxSize: options.maxSize || 1000,
            ttl: options.ttl || 3600000, // 1 hour default
            cleanupInterval: options.cleanupInterval || 600000 // 10 minutes
        };
        
        this.cache = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0,
            size: 0
        };
        
        this.startCleanupInterval();
    }

    // ذخیره در کش
    set(key, value, customTTL = null) {
        const ttl = customTTL || this.options.ttl;
        const expiry = Date.now() + ttl;
        
        if (this.cache.size >= this.options.maxSize) {
            this.evictLRU();
        }
        
        this.cache.set(key, {
            value,
            expiry,
            lastAccessed: Date.now(),
            accessCount: 0
        });
        
        this.stats.sets++;
        this.stats.size = this.cache.size;
        
        return true;
    }

    // بازیابی از کش
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            this.stats.misses++;
            return null;
        }
        
        // بررسی انقضا
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            this.stats.misses++;
            this.stats.size = this.cache.size;
            return null;
        }
        
        // به‌روزرسانی آمار دسترسی
        item.lastAccessed = Date.now();
        item.accessCount++;
        this.stats.hits++;
        
        return item.value;
    }

    // حذف از کش
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.stats.deletes++;
            this.stats.size = this.cache.size;
        }
        return deleted;
    }

    // پاک‌سازی کش
    clear() {
        const previousSize = this.cache.size;
        this.cache.clear();
        this.stats.deletes += previousSize;
        this.stats.size = 0;
        return previousSize;
    }

    // حذف موارد منقضی شده
    cleanup() {
        const now = Date.now();
        let deletedCount = 0;
        
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expiry) {
                this.cache.delete(key);
                deletedCount++;
            }
        }
        
        this.stats.deletes += deletedCount;
        this.stats.size = this.cache.size;
        
        return deletedCount;
    }

    // حذف کم‌استفاده‌ترین موارد (LRU)
    evictLRU() {
        if (this.cache.size === 0) return;
        
        let lruKey = null;
        let lruTime = Date.now();
        
        for (const [key, item] of this.cache.entries()) {
            if (item.lastAccessed < lruTime) {
                lruTime = item.lastAccessed;
                lruKey = key;
            }
        }
        
        if (lruKey) {
            this.cache.delete(lruKey);
            this.stats.deletes++;
            this.stats.size = this.cache.size;
        }
    }

    // شروع تمیزکاری دوره‌ای
    startCleanupInterval() {
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.options.cleanupInterval);
    }

    // توقف تمیزکاری
    stopCleanupInterval() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }

    // دریافت آمار
    getStats() {
        return {
            ...this.stats,
            currentSize: this.cache.size,
            hitRate: this.stats.hits + this.stats.misses > 0 
                ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100 
                : 0,
            utilization: (this.cache.size / this.options.maxSize) * 100
        };
    }

    // دریافت کلیدهای موجود
    getKeys() {
        return Array.from(this.cache.keys());
    }

    // بررسی وجود کلید
    has(key) {
        const item = this.cache.get(key);
        if (!item) return false;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return false;
        }
        
        return true;
    }
}

module.exports = SmartCache;
