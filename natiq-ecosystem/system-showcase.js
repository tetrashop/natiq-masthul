/**
 * 🎪 نمایشگاه قابلیت‌های نطق مصطلح
 * نمایش تمام الگوریتم‌های توسعه یافته
 */

const { getStatus } = require('./NAtiQ-ENHANCED.js');
const UnifiedNatiqSystem = require('./natiq-unified-system.js').UnifiedNatiqSystem;

class SystemShowcase {
    constructor() {
        this.modules = {
            'هسته اصلی': './NAtiQ-ENHANCED.js',
            'API رایگان': './free-api-server.js',
            'رابط وب': './web-interface-simple.js',
            'مدیریت کش': './free-version.js',
            'سیستم یکپارچه': './natiq-unified-system.js'
        };
    }

    async demonstrateAllCapabilities() {
        console.log('🎪 نمایشگاه قابلیت‌های نطق مصطلح\n');
        
        for (const [name, modulePath] of Object.entries(this.modules)) {
            try {
                console.log(`\n🔹 ${name}:`);
                
                if (name === 'هسته اصلی') {
                    const status = getStatus();
                    console.log(`   • عملکرد: ${(status.performance * 100).toFixed(1)}%`);
                    console.log(`   • تعاملات: ${status.interactionCount}`);
                    console.log(`   • کش: ${status.cacheSizes.analysis}/${status.cacheSizes.validation}`);
                }
                
                console.log(`   ✅ فایل فعال: ${modulePath}`);
                
            } catch (error) {
                console.log(`   ❌ خطا در بارگذاری: ${error.message}`);
            }
        }

        console.log('\n🎯 دستورات قابل اجرا:');
        console.log('node system-showcase.js              (این نمایشگاه)');
        console.log('node master-launcher.js              (راه‌انداز اصلی)');
        console.log('node natiq-unified-system.js         (همه در یک)');
        console.log('node free-api-server.js              (API مستقل)');
        
        this.showUsageExamples();
    }

    showUsageExamples() {
        console.log('\n💡 مثال‌های استفاده:');
        
        const examples = [
            'curl -X POST http://localhost:3000/api/free/ask -d \'{"question":"سلام"}\'',
            '// استفاده در کد: const { ask } = require("./NAtiQ-ENHANCED.js")',
            '// رابط وب: http://localhost:3001/web'
        ];
        
        examples.forEach(example => {
            console.log(`   📝 ${example}`);
        });
    }
}

// اجرای نمایشگاه
if (require.main === module) {
    const showcase = new SystemShowcase();
    showcase.demonstrateAllCapabilities();
}

module.exports = SystemShowcase;
