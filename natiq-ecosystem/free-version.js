const crypto = require('crypto');

class FreeTierSystem {
    constructor() {
        this.users = new Map();
        this.dailyLimits = {
            free: 50,
            waitlist: 100
        };
    }

    generateFreeToken(email) {
        const token = crypto.randomBytes(16).toString('hex');
        this.users.set(token, {
            email: email,
            requestsToday: 0,
            totalRequests: 0,
            joinDate: new Date(),
            tier: 'free',
            maxDaily: this.dailyLimits.free,
            lastRequestDate: new Date().toDateString()
        });
        return token;
    }

    canMakeRequest(token) {
        const user = this.users.get(token);
        if (!user) return false;
        
        const today = new Date().toDateString();
        if (user.lastRequestDate !== today) {
            user.requestsToday = 0;
            user.lastRequestDate = today;
        }
        
        return user.requestsToday < user.maxDaily;
    }

    trackRequest(token) {
        const user = this.users.get(token);
        if (user) {
            user.requestsToday++;
            user.totalRequests++;
        }
    }

    getUserStats(token) {
        const user = this.users.get(token);
        if (!user) return null;
        
        return {
            tier: user.tier,
            requestsToday: user.requestsToday,
            maxDaily: user.maxDaily,
            totalRequests: user.totalRequests,
            remainingToday: user.maxDaily - user.requestsToday
        };
    }
}

module.exports = FreeTierSystem;
