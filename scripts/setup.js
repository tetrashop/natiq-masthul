const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const logger = require('../src/utils/logger');

class ProjectSetup {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.requiredDirs = [
      'src/controllers',
      'src/services', 
      'src/models',
      'src/middleware',
      'src/utils',
      'src/config',
      'src/routes',
      'data',
      'logs',
      'tests/unit',
      'tests/integration',
      'docs/api',
      'docs/deployment',
      'public/static',
      'scripts'
    ];
  }

  async initialize() {
    console.log('🎯 شروع راه‌اندازی پروژه نطق مصطلح...\n');
    
    try {
      await this.createDirectories();
      await this.checkDependencies();
      await this.createEnvFile();
      await this.setPermissions();
      
      console.log('\n✅ راه‌اندازی با موفقیت completed!');
      console.log('📝下一步:');
      console.log('   1. ویرایش فایل .env با مقادیر واقعی');
      console.log('   2. اجرای دستور: npm install');
      console.log('   3. اجرای دستور: npm start');
      console.log('   4. استقرار روی ورسل: npx vercel --prod');
      
    } catch (error) {
      logger.error('خطا در راه‌اندازی:', error);
      process.exit(1);
    }
  }

  async createDirectories() {
    console.log('📁 ایجاد ساختار پوشه‌ها...');
    
    for (const dir of this.requiredDirs) {
      const fullPath = path.join(this.rootDir, dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
        console.log(`   ✅ ${dir}`);
      } catch (error) {
        if (error.code !== 'EEXIST') {
          throw error;
        }
      }
    }
  }

  async checkDependencies() {
    console.log('📦 بررسی وابستگی‌ها...');
    
    return new Promise((resolve, reject) => {
      exec('npm list --depth=0', (error, stdout, stderr) => {
        if (error) {
          console.log('   ℹ️  وابستگی‌ها نیاز به نصب دارند');
        } else {
          console.log('   ✅ وابستگی‌ها نصب شده‌اند');
        }
        resolve();
      });
    });
  }

  async createEnvFile() {
    const envExamplePath = path.join(this.rootDir, '.env.example');
    const envPath = path.join(this.rootDir, '.env');
    
    try {
      await fs.access(envPath);
      console.log('   ℹ️  فایل .env از قبل وجود دارد');
    } catch {
      try {
        await fs.copyFile(envExamplePath, envPath);
        console.log('   ✅ فایل .env ایجاد شد');
      } catch {
        console.log('   ℹ️  فایل .env.example یافت نشد');
      }
    }
  }

  async setPermissions() {
    console.log('🔐 تنظیم مجوزها...');
    
    try {
      await fs.chmod(path.join(this.rootDir, 'scripts/setup.js'), '755');
      console.log('   ✅ مجوزهای اسکریپت تنظیم شد');
    } catch (error) {
      console.log('   ℹ️  تنظیم مجوزها انجام نشد');
    }
  }
}

// اجرای راه‌اندازی
if (require.main === module) {
  const setup = new ProjectSetup();
  setup.initialize();
}

module.exports = ProjectSetup;
