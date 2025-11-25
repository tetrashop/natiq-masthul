/**
 * تست کیفیت سیستم نطق مصطلح
 */

const NatiqMasthulFinalSystem = require('./main-final');

class QualityTester {
    constructor() {
        this.system = new NatiqMasthulFinalSystem();
        this.testCases = this.createTestCases();
    }

    createTestCases() {
        return [
            {
                question: "چگونه مشتری حریصی که نرم‌افزار ما را کنار گذاشته بازگردانیم؟",
                expectedDomains: ['customer_recovery', 'psychology', 'software_business'],
                minConfidence: 0.7,
                description: "تست ترکیبی روانشناسی و نرم‌افزار"
            },
            {
                question: "استراتژی بازگشت سرمایه برای جذب مجدد مشتریان ناراضی چیست؟",
                expectedDomains: ['business_strategy', 'customer_recovery'],
                minConfidence: 0.6,
                description: "تست استراتژی کسب‌وکار"
            },
            {
                question: "روانشناسی مشتری حریص و راهکارهای عملی",
                expectedDomains: ['psychology', 'customer_recovery'],
                minConfidence: 0.75,
                description: "تست تخصصی روانشناسی"
            },
            {
                question: "ارتباط مؤثر با مشتریان از دست رفته",
                expectedDomains: ['communication', 'customer_recovery'],
                minConfidence: 0.65,
                description: "تست مهارت‌های ارتباطی"
            },
            {
                question: "ارزش‌آفرینی در کسب‌وکار نرم‌افزاری",
                expectedDomains: ['value_proposition', 'software_business'],
                minConfidence: 0.6,
                description: "تست ارزش‌آفرینی"
            }
        ];
    }

    async runQualityTests() {
        console.log('🧪 شروع تست کیفیت سیستم نطق مصطلح\n');
        
        let passedTests = 0;
        const results = [];

        for (let i = 0; i < this.testCases.length; i++) {
            const testCase = this.testCases[i];
            console.log(`\n${'='.repeat(70)}`);
            console.log(`تست ${i + 1}/${this.testCases.length}: ${testCase.description}`);
            console.log(`سوال: ${testCase.question}`);
            console.log(`${'='.repeat(70)}`);

            try {
                const result = await this.system.processQuestion(testCase.question);
                const testResult = this.evaluateTest(testCase, result);
                
                results.push(testResult);
                
                if (testResult.passed) {
                    passedTests++;
                    console.log('✅ تست موفق');
                } else {
                    console.log('❌ تست ناموفق');
                }

                console.log(testResult.details);

            } catch (error) {
                console.error('❌ خطا در اجرای تست:', error);
                results.push({
                    testCase: testCase.description,
                    passed: false,
                    error: error.message
                });
            }
        }

        this.printSummary(results, passedTests);
        return results;
    }

    evaluateTest(testCase, result) {
        const details = [];
        let passed = true;

        // بررسی اعتماد سیستم
        const confidence = result.analysisResults?.finalConfidence || 0;
        if (confidence < testCase.minConfidence) {
            details.push(`❌ اعتماد سیستم ${(confidence * 100).toFixed(1)}% کمتر از حداقل ${(testCase.minConfidence * 100).toFixed(1)}% مورد انتظار است`);
            passed = false;
        } else {
            details.push(`✅ اعتماد سیستم: ${(confidence * 100).toFixed(1)}% (حداقل مورد انتظار: ${(testCase.minConfidence * 100).toFixed(1)}%)`);
        }

        // بررسی حوزه‌های فعال
        const activeDomains = result.metadata?.activeDomains || [];
        const missingDomains = testCase.expectedDomains.filter(domain => !activeDomains.includes(domain));
        
        if (missingDomains.length > 0) {
            details.push(`❌ حوزه‌های مفقوده: ${missingDomains.join(', ')}`);
            passed = false;
        } else {
            details.push(`✅ تمام حوزه‌های مورد انتظار فعال شده‌اند: ${activeDomains.join(', ')}`);
        }

        // بررسی کیفیت پاسخ
        const response = result.response || '';
        const hasActionableContent = response.includes('راهکار') || response.includes('اقدام') || response.includes('برنامه');
        const hasMetrics = response.includes('معیار') || response.includes('سنجش') || response.includes('اندازه‌گیری');
        
        if (!hasActionableContent) {
            details.push('⚠️  پاسخ فاقد محتوای عملی قابل اجرا');
        } else {
            details.push('✅ پاسخ شامل راهکارهای عملی است');
        }

        if (!hasMetrics) {
            details.push('⚠️  پاسخ فاقد معیارهای سنجش موفقیت');
        } else {
            details.push('✅ پاسخ شامل معیارهای سنجش است');
        }

        return {
            testCase: testCase.description,
            passed,
            confidence,
            expectedDomains: testCase.expectedDomains,
            actualDomains: activeDomains,
            details: details.join('\n')
        };
    }

    printSummary(results, passedTests) {
        console.log(`\n${'📊'.repeat(25)}`);
        console.log('گزارش نهایی تست کیفیت');
        console.log(`${'📊'.repeat(25)}\n`);

        console.log(`✅ تست‌های موفق: ${passedTests}/${results.length}`);
        console.log(`📈 نرخ موفقیت: ${((passedTests / results.length) * 100).toFixed(1)}%`);

        const avgConfidence = results.reduce((sum, r) => sum + (r.confidence || 0), 0) / results.length;
        console.log(`🎯 میانگین اعتماد سیستم: ${(avgConfidence * 100).toFixed(1)}%`);

        // نمایش وضعیت کلی
        if (passedTests === results.length) {
            console.log('\n🎉 تمام تست‌ها با موفقیت گذرانده شدند! سیستم در وضعیت عالی قرار دارد.');
        } else if (passedTests >= results.length * 0.7) {
            console.log('\n👍 سیستم در وضعیت خوبی قرار دارد. برخی بهبودها لازم است.');
        } else {
            console.log('\n💡 سیستم نیاز به بازبینی و بهبود دارد.');
        }

        // پیشنهادات بهبود
        console.log('\n💡 پیشنهادات برای بهبود:');
        const lowConfidenceTests = results.filter(r => r.confidence < 0.7);
        if (lowConfidenceTests.length > 0) {
            console.log('• افزایش داده‌های آموزشی برای حوزه‌های با اعتماد پایین');
        }

        const missingDomainTests = results.filter(r => r.expectedDomains.some(ed => !r.actualDomains.includes(ed)));
        if (missingDomainTests.length > 0) {
            console.log('• گسترش الگوهای تشخیص برای حوزه‌های مفقوده');
        }
    }
}

// اجرای تست کیفیت
async function main() {
    const tester = new QualityTester();
    await tester.runQualityTests();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = QualityTester;
