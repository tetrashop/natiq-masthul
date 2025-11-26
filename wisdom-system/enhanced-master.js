import { AdvancedResponseGenerator } from '../advanced-response/response-generator.js';

class EnhancedMasterNatiq {
    constructor() {
        this.responseGenerator = new AdvancedResponseGenerator();
        this.conversationHistory = [];
        this.userProfiles = new Map();
    }

    async ask(question, userId = 'default', context = {}) {
        const startTime = Date.now();
        
        try {
            // دریافت پروفایل کاربر
            const userProfile = this.getUserProfile(userId);
            
            // تولید پاسخ پیشرفته
            const enhancedResponse = await this.responseGenerator.generateResponse(
                question, 
                { ...context, ...userProfile }
            );
            
            // به‌روزرسانی تاریخچه
            this.updateConversationHistory(userId, question, enhancedResponse);
            
            // به‌روزرسانی پروفایل کاربر
            this.updateUserProfile(userId, question, enhancedResponse);
            
            const processingTime = Date.now() - startTime;
            
            return {
                success: true,
                question,
                response: enhancedResponse.response,
                analysis: enhancedResponse.analysis,
                metadata: {
                    ...enhancedResponse.metadata,
                    processingTime,
                    userId,
                    conversationLength: this.conversationHistory.length
                },
                scores: {
                    wisdomScore: enhancedResponse.metadata.depthLevel / 5,
                    personalizationScore: this.calculatePersonalizationScore(userId),
                    engagementScore: this.calculateEngagementScore(userId),
                    combinedScore: this.calculateCombinedScore(enhancedResponse, userId)
                }
            };
            
        } catch (error) {
            console.error('❌ خطا در پردازش پیشرفته:', error);
            
            // Fallback به سیستم ساده
            return await this.fallbackResponse(question, startTime);
        }
    }

    getUserProfile(userId) {
        if (!this.userProfiles.has(userId)) {
            this.userProfiles.set(userId, {
                interests: new Set(),
                conversationPatterns: [],
                preferredResponseStyle: 'comprehensive',
                engagementLevel: 1,
                lastActive: new Date()
            });
        }
        return this.userProfiles.get(userId);
    }

    updateUserProfile(userId, question, response) {
        const profile = this.getUserProfile(userId);
        
        // به‌روزرسانی علاقه‌مندی‌ها
        response.analysis.relatedConcepts.forEach(concept => {
            profile.interests.add(concept);
        });
        
        // تشخیص سبک پاسخ مورد علاقه
        if (response.metadata.confidence > 0.8) {
            profile.preferredResponseStyle = response.metadata.style;
        }
        
        profile.engagementLevel += 0.1;
        profile.lastActive = new Date();
    }

    updateConversationHistory(userId, question, response) {
        this.conversationHistory.push({
            userId,
            timestamp: new Date(),
            question,
            response: response.response,
            analysis: response.analysis,
            metadata: response.metadata
        });
        
        // حفظ تاریخچه معقول
        if (this.conversationHistory.length > 100) {
            this.conversationHistory = this.conversationHistory.slice(-50);
        }
    }

    calculatePersonalizationScore(userId) {
        const profile = this.getUserProfile(userId);
        return Math.min(profile.engagementLevel / 10, 1);
    }

    calculateEngagementScore(userId) {
        const userConversations = this.conversationHistory.filter(
            entry => entry.userId === userId
        ).length;
        return Math.min(userConversations / 20, 1);
    }

    calculateCombinedScore(response, userId) {
        const weights = {
            wisdom: 0.4,
            personalization: 0.3,
            engagement: 0.2,
            confidence: 0.1
        };
        
        return (
            response.metadata.depthLevel * weights.wisdom +
            this.calculatePersonalizationScore(userId) * weights.personalization +
            this.calculateEngagementScore(userId) * weights.engagement +
            response.metadata.confidence * weights.confidence
        );
    }

    async fallbackResponse(question, startTime) {
        // پاسخ ساده در صورت خطا
        const simpleResponses = {
            'تعادل': "برای ایجاد تعادل، پیشنهاد می‌کنم ابتدا حوزه‌های اصلی زندگی خود را شناسایی کنید و زمان‌بندی متعادلی ایجاد نمایید.",
            'بهره‌وری': "مدیریت انرژی مهم‌تر از مدیریت زمان است. بر کارهای با تاثیر بالا تمرکز کنید.",
            'default': "سوال جالبی است. پیشنهاد می‌کنم از زوایای مختلف به مسئله نگاه کنید و با افراد با تجربه مشورت نمایید."
        };
        
        let response = simpleResponses.default;
        for (const [key, value] of Object.entries(simpleResponses)) {
            if (question.includes(key)) {
                response = value;
                break;
            }
        }
        
        return {
            success: true,
            question,
            response,
            analysis: {},
            metadata: {
                style: 'fallback',
                depthLevel: 1,
                confidence: 0.6,
                processingTime: Date.now() - startTime
            },
            scores: {
                wisdomScore: 0.6,
                personalizationScore: 0.3,
                engagementScore: 0.5,
                combinedScore: 0.5
            }
        };
    }

    getUserInsights(userId) {
        const profile = this.getUserProfile(userId);
        const userHistory = this.conversationHistory.filter(
            entry => entry.userId === userId
        );
        
        return {
            profile: {
                interests: Array.from(profile.interests),
                preferredStyle: profile.preferredResponseStyle,
                engagementLevel: profile.engagementLevel,
                conversationCount: userHistory.length
            },
            patterns: this.analyzeConversationPatterns(userHistory),
            growthAreas: this.identifyGrowthAreas(userHistory)
        };
    }

    analyzeConversationPatterns(history) {
        if (history.length === 0) return [];
        
        const topics = history.flatMap(entry => 
            entry.analysis?.relatedConcepts || []
        );
        
        const topicFrequency = topics.reduce((acc, topic) => {
            acc[topic] = (acc[topic] || 0) + 1;
            return acc;
        }, {});
        
        return Object.entries(topicFrequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([topic, count]) => ({ topic, frequency: count }));
    }

    identifyGrowthAreas(history) {
        const allConcepts = new Set();
        history.forEach(entry => {
            if (entry.analysis?.relatedConcepts) {
                entry.analysis.relatedConcepts.forEach(concept => allConcepts.add(concept));
            }
        });
        
        return Array.from(allConcepts).slice(0, 5);
    }
}

export default EnhancedMasterNatiq;
