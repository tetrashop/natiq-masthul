const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 شروع استقرار خودکار نطق مصطلح روی GitHub...\n');

class AutoDeploy {
    constructor() {
        this.repoPath = process.cwd();
        this.hasErrors = false;
    }

    runCommand(command, errorMessage) {
        try {
            console.log(`🔧 اجرا: ${command}`);
            const result = execSync(command, { cwd: this.repoPath, encoding: 'utf8' });
            console.log(`✅ موفق: ${command}`);
            return result;
        } catch (error) {
            console.log(`❌ ${errorMessage}: ${error.message}`);
            this.hasErrors = true;
            return null;
        }
    }

    async deploy() {
        console.log('📁 بررسی وضعیت مخزن Git...\n');

        // 1. بررسی وجود پوشه .git
        if (!fs.existsSync(path.join(this.repoPath, '.git'))) {
            console.log('❌ مخزن Git یافت نشد. در حال راه‌اندازی...');
            this.runCommand('git init', 'خطا در git init');
            this.runCommand('git add .', 'خطا در اضافه کردن فایل‌ها');
            this.runCommand('git commit -m "اولین commit: راه‌اندازی نطق مصطلح"', 'خطا در commit اول');
        }

        // 2. بررسی وضعیت فعلی
        const status = this.runCommand('git status --porcelain', 'خطا در بررسی وضعیت');
        
        if (!status || status.trim() === '') {
            console.log('📭 هیچ تغییری برای commit وجود ندارد.');
        } else {
            console.log('📦 تغییرات یافت شد. در حال ثبت...');
            this.runCommand('git add .', 'خطا در اضافه کردن فایل‌ها');
            this.runCommand('git commit -m "🚀 بروزرسانی خودکار: ' + new Date().toLocaleString('fa-IR') + '"', 'خطا در commit');
        }

        // 3. بررسی remote
        const remotes = this.runCommand('git remote -v', 'خطا در بررسی remote');
        
        if (!remotes || !remotes.includes('origin')) {
            console.log('🌐 تنظیم remote repository...');
            // کاربر باید آدرس مخزن خود را وارد کند
            console.log('⚠️ لطفاً آدرس مخزن GitHub خود را وارد کنید:');
            console.log('   git remote add origin https://github.com/YOUR_USERNAME/natiq-masthul.git');
            console.log('   سپس این اسکریپت را دوباره اجرا کنید.');
            return;
        }

        // 4. دریافت آخرین تغییرات
        console.log('\n📥 دریافت تغییرات از سرور...');
        this.runCommand('git pull origin main --rebase', 'خطا در pull');

        // 5. آپلود تغییرات
        console.log('\n📤 آپلود تغییرات به GitHub...');
        this.runCommand('git push -u origin main', 'خطا در push');

        // 6. ایجاد tag
        console.log('\n🏷️ ایجاد برچسب نسخه...');
        const version = 'v1.' + new Date().toISOString().slice(0, 10).replace(/-/g, '.');
        this.runCommand(`git tag ${version}`, 'خطا در ایجاد tag');
        this.runCommand('git push origin --tags', 'خطا در آپلود tags');

        if (!this.hasErrors) {
            console.log('\n🎉 استقرار خودکار با موفقیت完成 شد!');
            console.log('📊 خلاصه عملیات:');
            console.log('   ✅ فایل‌ها اضافه شدند');
            console.log('   ✅ تغییرات ثبت شدند');
            console.log('   ✅ بروزرسانی از سرور انجام شد');
            console.log('   ✅ آپلود به GitHub انجام شد');
            console.log('   ✅ برچسب نسخه ایجاد شد');
            console.log('\n🌐 مخزن شما در دسترس است:');
            console.log('   https://github.com/YOUR_USERNAME/natiq-masthul');
        } else {
            console.log('\n⚠️ برخی عملیات با خطا مواجه شدند. لطفاً دستی ادامه دهید.');
        }
    }
}

// اجرای خودکار
new AutoDeploy().deploy().catch(console.error);
