/**
 * مانیتورینگ پیشرفته بهره‌وری و حذف اسراف
 */

class EfficiencyMonitor {
    constructor() {
        this.metrics = {
            algorithmEfficiency: new Map(),
            resourceUsage: new Map(),
            wasteTracking: new Map(),
            performanceHistory: []
        };
        this.optimizationThresholds = {
            maxWastePercentage: 5, // حداکثر 5% اسراف مجاز
            minEfficiency: 85, // حداقل 85% بهره‌وری
            maxProcessingTime: 100 // حداکثر 100ms زمان پردازش
        };
    }

    // ردیابی بهره‌وری الگوریتم‌ها
    trackAlgorithmEfficiency(algorithmId, inputSize, outputQuality, processingTime, resourcesUsed) {
        const efficiency = this.calculateEfficiency(outputQuality, processingTime, resourcesUsed);
        const waste = this.calculateWaste(inputSize, outputQuality, resourcesUsed);

        this.metrics.algorithmEfficiency.set(algorithmId, {
            efficiency,
            waste,
            processingTime,
            resourcesUsed,
            timestamp: Date.now()
        });

        console.log(`📊 ${algorithmId}: بهره‌وری ${efficiency.toFixed(1)}% | اسراف ${waste.toFixed(1)}%`);

        return { efficiency, waste };
    }

    // محاسبه بهره‌وری
    calculateEfficiency(outputQuality, processingTime, resourcesUsed) {
        const qualityWeight = 0.6;
        const timeWeight = 0.25;
        const resourceWeight = 0.15;

        const qualityScore = outputQuality * 100;
        const timeScore = Math.max(0, 100 - (processingTime / 10)); // نمره زمان
        const resourceScore = Math.max(0, 100 - (resourcesUsed * 20)); // نمره منابع

        return (qualityScore * qualityWeight) + 
               (timeScore * timeWeight) + 
               (resourceScore * resourceWeight);
    }

    // محاسبه اسراف
    calculateWaste(inputSize, outputQuality, resourcesUsed) {
        const expectedResources = inputSize * 2; // منابع مورد انتظار
        const resourceWaste = Math.max(0, resourcesUsed - expectedResources) / resourcesUsed * 100;
        
        const qualityWaste = (1 - outputQuality) * 100; // اسراف ناشی از کیفیت پایین
        
        return (resourceWaste * 0.7) + (qualityWaste * 0.3);
    }

    // آنالیز الگوی اسراف
    analyzeWastePatterns() {
        const wastePatterns = [];
        let totalWaste = 0;
        let algorithmCount = 0;

        for (const [algoId, data] of this.metrics.algorithmEfficiency) {
            totalWaste += data.waste;
            algorithmCount++;

            if (data.waste > this.optimizationThresholds.maxWastePercentage) {
                wastePatterns.push({
                    algorithm: algoId,
                    wastePercentage: data.waste,
                    issue: this.identifyWasteIssue(algoId, data),
                    recommendation: this.generateWasteReductionRecommendation(algoId)
                });
            }
        }

        const averageWaste = algorithmCount > 0 ? totalWaste / algorithmCount : 0;

        return {
            averageWaste,
            wastePatterns,
            optimizationRequired: wastePatterns.length > 0,
            overallStatus: averageWaste <= this.optimizationThresholds.maxWastePercentage ? 
                         'بهینه' : 'نیاز به بهبود'
        };
    }

    // شناسایی علت اسراف
    identifyWasteIssue(algorithmId, data) {
        if (data.processingTime > 50) return 'زمان پردازش بالا';
        if (data.resourcesUsed > 5) return 'مصرف منابع زیاد';
        if (data.efficiency < 70) return 'بهره‌وری پایین';
        return 'اسراف عمومی';
    }

    // تولید توصیه‌های کاهش اسراف
    generateWasteReductionRecommendation(algorithmId) {
        const recommendations = {
            'pattern_analysis': 'استفاده از کش الگو و حذف مقایسه‌های تکراری',
            'logical_inference': 'هرس زنجیره استنتاج و حذف استنتاج‌های حلقوی',
            'knowledge_fusion': 'ترکیب انتخابی و فیلترگذاری ارتباط',
            'response_optimization': 'بهینه‌سازی progressive و حذف over-engineering'
        };

        return recommendations[algorithmId] || 'بازبینی الگوریتم و حذف مراحل غیرضروری';
    }

    // گزارش جامع بهره‌وری
    generateEfficiencyReport() {
        const wasteAnalysis = this.analyzeWastePatterns();
        const overallEfficiency = this.calculateOverallEfficiency();

        return {
            timestamp: Date.now(),
            overallEfficiency: overallEfficiency,
            wasteAnalysis: wasteAnalysis,
            algorithmDetails: Array.from(this.metrics.algorithmEfficiency.entries())
                .map(([id, data]) => ({
                    algorithm: id,
                    efficiency: data.efficiency,
                    waste: data.waste,
                    processingTime: data.processingTime,
                    status: data.waste <= this.optimizationThresholds.maxWastePercentage ? 
                           '✅ بهینه' : '⚠️ نیاز به بهبود'
                })),
            recommendations: this.generateOptimizationRecommendations(wasteAnalysis)
        };
    }

    // محاسبه بهره‌وری کلی
    calculateOverallEfficiency() {
        let totalEfficiency = 0;
        let totalWaste = 0;
        let count = 0;

        for (const [_, data] of this.metrics.algorithmEfficiency) {
            totalEfficiency += data.efficiency;
            totalWaste += data.waste;
            count++;
        }

        return count > 0 ? {
            averageEfficiency: totalEfficiency / count,
            averageWaste: totalWaste / count,
            netEfficiency: Math.max(0, (totalEfficiency / count) - (totalWaste / count))
        } : { averageEfficiency: 0, averageWaste: 0, netEfficiency: 0 };
    }

    // تولید توصیه‌های بهینه‌سازی
    generateOptimizationRecommendations(wasteAnalysis) {
        const recommendations = [];

        if (wasteAnalysis.averageWaste > this.optimizationThresholds.maxWastePercentage) {
            recommendations.push(`کاهش اسراف از ${wasteAnalysis.averageWaste.toFixed(1)}% به ${this.optimizationThresholds.maxWastePercentage}%`);
        }

        wasteAnalysis.wastePatterns.forEach(pattern => {
            recommendations.push(`${pattern.algorithm}: ${pattern.recommendation}`);
        });

        const overallEff = this.calculateOverallEfficiency();
        if (overallEff.netEfficiency < this.optimizationThresholds.minEfficiency) {
            recommendations.push(`افزایش بهره‌وری خالص از ${overallEff.netEfficiency.toFixed(1)}% به ${this.optimizationThresholds.minEfficiency}%`);
        }

        return recommendations.length > 0 ? recommendations : ['سیستم در وضعیت بهینه قرار دارد'];
    }

    // پاک‌سازی معیارهای قدیمی
    cleanupOldMetrics(maxAgeMinutes = 60) {
        const cutoffTime = Date.now() - (maxAgeMinutes * 60 * 1000);
        let cleanedCount = 0;

        for (const [algoId, data] of this.metrics.algorithmEfficiency) {
            if (data.timestamp < cutoffTime) {
                this.metrics.algorithmEfficiency.delete(algoId);
                cleanedCount++;
            }
        }

        console.log(`🧹 ${cleanedCount} معیار قدیمی پاک‌سازی شد`);
        return cleanedCount;
    }
}

module.exports = EfficiencyMonitor;
