const fs = require('fs');
const path = require('path');

class CleanupManager {
    constructor() {
        this.projectRoot = __dirname;
        this.essentialFiles = [
            'NAtiQ-ENHANCED.js',
            'free-api-server.js', 
            'simple-free-server.js',
            'start-free-version.js',
            'package.json',
            'cleanup-manager.js'
        ];
    }

    checkDiskUsage() {
        const files = fs.readdirSync(this.projectRoot);
        console.log('📁 فایل‌های موجود:');
        
        files.forEach(file => {
            const filePath = path.join(this.projectRoot, file);
            const stats = fs.statSync(filePath);
            const size = (stats.size / 1024).toFixed(2) + ' KB';
            
            const status = this.essentialFiles.includes(file) ? '✅ ضروری' : '⚠️  احتمالی اضافه';
            console.log(`${status} - ${file} (${size})`);
        });
    }

    suggestCleanup() {
        const files = fs.readdirSync(this.projectRoot);
        const unnecessary = files.filter(file => !this.essentialFiles.includes(file));
        
        if (unnecessary.length === 0) {
            console.log('🎉 سیستم شما بهینه است! فایل اضافه‌ای وجود ندارد.');
            return;
        }

        console.log('\n🗑️ فایل‌های پیشنهادی برای حذف:');
        unnecessary.forEach(file => {
            console.log(`rm -f ${file}`);
        });

        console.log('\n💡 برای حذف خودکار اجرا کنید:');
        console.log('node cleanup-manager.js --clean');
    }

    performCleanup() {
        const files = fs.readdirSync(this.projectRoot);
        const unnecessary = files.filter(file => !this.essentialFiles.includes(file));
        
        unnecessary.forEach(file => {
            try {
                fs.unlinkSync(path.join(this.projectRoot, file));
                console.log(`✅ حذف شد: ${file}`);
            } catch (error) {
                console.log(`❌ خطا در حذف ${file}: ${error.message}`);
            }
        });
        
        console.log(`🎯 ${unnecessary.length} فایل اضافه حذف شد.`);
    }
}

const manager = new CleanupManager();

if (process.argv[2] === '--clean') {
    console.log('🧹 شروع پاکسازی...');
    manager.performCleanup();
} else {
    console.log('🔍 بررسی وضعیت فایل‌ها...');
    manager.checkDiskUsage();
    manager.suggestCleanup();
}
