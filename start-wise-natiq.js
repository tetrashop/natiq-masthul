/**
 * 🚀 راه‌انداز سیستم خردمند نطق مصطلح
 */

import masterNatiq from './wisdom-system/master-natiq.js';

console.log('🌟 سیستم نطق مصطلح - نسخه خردمند');
console.log('================================\n');

// منتظر راه‌اندازی سیستم بمانیم
setTimeout(async () => {
    try {
        const status = masterNatiq.getStatus();
        
        if (status.system.status === 'ready') {
            console.log('🎉 سیستم کاملاً آماده است!\n');
            
            // نمایش وضعیت
            console.log('📊 وضعیت سیستم:');
            console.log(`   نام: ${status.system.name}`);
            console.log(`   نسخه: ${status.system.version}`);
            console.log(`   سطح خرد: ${status.system.wisdomLevel}`);
            console.log(`   رضایت کاربر: ${status.interface.userSatisfaction}`);
            console.log(`   کارایی: ${(status.performance.efficiency * 100).toFixed(1)}%`);
            
            console.log('\n🎯 قابلیت‌های فعال:');
            Object.entries(status.capabilities).forEach(([capability, active]) => {
                console.log(`   ${active ? '✅' : '❌'} ${capability}`);
            });
            
            console.log('\n💡 برای استفاده:');
            console.log('   await masterNatiq.ask("سوال شما")');
            console.log('   یا import { ask } from "./wisdom-system/master-natiq.js"');
            
        } else {
            console.log('⏳ سیستم در حال راه‌اندازی...');
            console.log('لطفاً چند لحظه صبر کنید و مجدداً تلاش کنید.');
        }
        
    } catch (error) {
        console.error('❌ خطا در بررسی وضعیت سیستم:', error);
    }
}, 2000);
