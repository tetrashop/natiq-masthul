/**
 * تأیید نهایی عملکرد سیستم قبل از آپلود به گیت‌هاب
 */

const fs = require('fs');
const path = require('path');

class SystemVerifier {
    constructor() {
        this.verificationResults = [];
        this.systemComponents = [
            'knowledge-graph/core-knowledge.js',
            'reasoning-engine/multi-algorithm-processor.js',
            'response-generator/enhanced-response-builder.js',
            'monitoring/performance-monitor.js',
            'optimized-system/core-optimizer.js',
            'optimized-system/efficiency-monitor.js',
            'optimized-system/natiq-optimized.js',
            'main.js',
            'main-enhanced.js',
            'main-final.js'
        ];
    }

    async verifySystem() {
        console.log('🔍 شروع تأیید عملکرد سیستم نطق مصطلح');
        console.log('='.repeat(60));

        // 1. بررسی وجود فایل‌های ضروری
        await this.verifyEssentialFiles();

        // 2. بررسی قابلیت بارگذاری ماژول‌ها
        await this.verifyModuleLoading();

        // 3. تست عملکرد پایه
        await this.verifyBasicFunctionality();

        // 4. تست بهینه‌سازی
        await this.verifyOptimization();

        // 5. تولید گزارش نهایی
        this.generateFinalReport();
    }

    async verifyEssentialFiles() {
        console.log('\n📁 بررسی فایل‌های ضروری...');
        
        let missingFiles = [];
        for (const component of this.systemComponents) {
            if (fs.existsSync(component)) {
                const stats = fs.statSync(component);
                this.verificationResults.push({
                    component,
                    status: '✅ موجود',
                    size: `${(stats.size / 1024).toFixed(2)} KB`,
                    type: 'file'
                });
            } else {
                missingFiles.push(component);
                this.verificationResults.push({
                    component,
                    status: '❌ مفقود',
                    error: 'فایل یافت نشد'
                });
            }
        }

        if (missingFiles.length > 0) {
            console.log(`❌ ${missingFiles.length} فایل مفقود:`);
            missingFiles.forEach(file => console.log(`   - ${file}`));
        } else {
            console.log('✅ تمام فایل‌های ضروری موجود هستند');
        }
    }

    async verifyModuleLoading() {
        console.log('\n🔄 بررسی بارگذاری ماژول‌ها...');
        
        const modulesToTest = [
            { name: 'Core Knowledge Graph', path: './knowledge-graph/core-knowledge' },
            { name: 'Performance Monitor', path: './monitoring/performance-monitor' },
            { name: 'Zero Waste Optimizer', path: './optimized-system/core-optimizer' }
        ];

        for (const module of modulesToTest) {
            try {
                const loadedModule = require(module.path);
                this.verificationResults.push({
                    component: module.name,
                    status: '✅ بارگذاری موفق',
                    type: 'module'
                });
                console.log(`   ✅ ${module.name} - بارگذاری موفق`);
            } catch (error) {
                this.verificationResults.push({
                    component: module.name,
                    status: '❌ خطای بارگذاری',
                    error: error.message,
                    type: 'module'
                });
                console.log(`   ❌ ${module.name} - خطا: ${error.message}`);
            }
        }
    }

    async verifyBasicFunctionality() {
        console.log('\n🧪 تست عملکرد پایه سیستم...');
        
        try {
            // تست سیستم اصلی
            const MainSystem = require('./main');
            const system = new MainSystem();
            
            // تست پردازش سوال ساده
            const testQuestion = "چگونه بهره‌وری سیستم را افزایش دهم؟";
            const result = await system.processQuestion(testQuestion);
            
            this.verificationResults.push({
                component: 'سیستم اصلی',
                status: '✅ عملکرد正常',
                confidence: `${(result.performance.overallAverageConfidence * 100).toFixed(1)}%`,
                processingTime: 'آماده'
            });
            console.log(`   ✅ سیستم اصلی - اعتماد: ${(result.performance.overallAverageConfidence * 100).toFixed(1)}%`);

        } catch (error) {
            this.verificationResults.push({
                component: 'سیستم اصلی',
                status: '❌ خطای عملکرد',
                error: error.message
            });
            console.log(`   ❌ سیستم اصلی - خطا: ${error.message}`);
        }
    }

    async verifyOptimization() {
        console.log('\n⚡ بررسی سیستم بهینه‌سازی...');
        
        try {
            const OptimizedSystem = require('./optimized-system/natiq-optimized');
            const optimizedSystem = new OptimizedSystem();
            
            // تست سوال بهینه‌سازی شده
            const testQuestion = "روش‌های حذف اسراف الگوریتمی";
            const result = await optimizedSystem.processQuestion(testQuestion);
            
            this.verificationResults.push({
                component: 'سیستم بهینه‌سازی',
                status: '✅ فعال',
                efficiency: `${result.optimization.efficiencyGain.toFixed(1)}%`,
                wasteReduction: `${result.optimization.eliminatedWaste.toFixed(1)}%`
            });
            console.log(`   ✅ سیستم بهینه‌سازی - بهره‌وری: ${result.optimization.efficiencyGain.toFixed(1)}%`);

        } catch (error) {
            this.verificationResults.push({
                component: 'سیستم بهینه‌سازی',
                status: '❌ خطا',
                error: error.message
            });
            console.log(`   ❌ سیستم بهینه‌سازی - خطا: ${error.message}`);
        }
    }

    generateFinalReport() {
        console.log('\n📊 گزارش نهایی تأیید سیستم');
        console.log('='.repeat(60));

        const totalTests = this.verificationResults.length;
        const passedTests = this.verificationResults.filter(r => r.status.includes('✅')).length;
        const failedTests = this.verificationResults.filter(r => r.status.includes('❌')).length;

        console.log(`🎯 نتایج کلی:`);
        console.log(`   ✅ تست‌های موفق: ${passedTests}`);
        console.log(`   ❌ تست‌های ناموفق: ${failedTests}`);
        console.log(`   📈 نرخ موفقیت: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        // نمایش جزئیات
        console.log('\n🔍 جزئیات تأیید:');
        this.verificationResults.forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.component}: ${result.status}`);
            if (result.confidence) console.log(`      اعتماد: ${result.confidence}`);
            if (result.efficiency) console.log(`      بهره‌وری: ${result.efficiency}`);
            if (result.error) console.log(`      خطا: ${result.error}`);
        });

        // تصمیم نهایی
        console.log('\n🎯 تصمیم نهایی:');
        if (failedTests === 0) {
            console.log('   ✅ سیستم کاملاً operational است - آماده بروزرسانی در گیت‌هاب');
        } else if (failedTests <= 2) {
            console.log('   ⚠️ سیستم قابل استفاده است - برخی مشکلات جزئی نیاز به توجه دارند');
        } else {
            console.log('   ❌ سیستم نیاز به بازبینی اساسی قبل از آپلود دارد');
        }

        return {
            totalTests,
            passedTests,
            failedTests,
            successRate: (passedTests / totalTests) * 100,
            readyForUpload: failedTests === 0
        };
    }
}

// اجرای تأیید سیستم
async function main() {
    const verifier = new SystemVerifier();
    const report = await verifier.verifySystem();
    
    if (report.readyForUpload) {
        console.log('\n🚀 سیستم تأیید شد! حالا می‌توانید با دستورات زیر گیت‌هاب را بروز کنید:\n');
        console.log('git add .');
        console.log('git commit -m "تأیید و بروزرسانی کامل سیستم نطق مصطلح با قابلیت‌های پیشرفته"');
        console.log('git push origin main');
    } else {
        console.log('\n🔧 لطفاً قبل از بروزرسانی گیت‌هاب، مشکلات گزارش شده را رفع کنید.');
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = SystemVerifier;
