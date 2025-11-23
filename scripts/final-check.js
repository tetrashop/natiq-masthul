const fs = require('fs');
const path = require('path');

console.log('🔍 بررسی نهایی ساختار پروژه...\n');

const requiredFiles = [
  'package.json',
  'server.js',
  'src/main-server.js',
  'src/multi-tenant-server.js',
  'src/config/config.js',
  'src/controllers/AuthController.js',
  'src/controllers/MainController.js',
  'src/controllers/LicenseController.js',
  'src/services/GmailService.js',
  'src/services/NLPService.js',
  'src/services/KnowledgeService.js',
  'src/services/LicenseService.js',
  'src/models/User.js',
  'src/middleware/auth.js',
  'src/middleware/security.js',
  'src/utils/logger.js',
  'README.md',
  '.gitignore',
  'LICENSE',
  'vercel.json',
  '.env.example',
  'scripts/setup.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - یافت نشد`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 همه فایل‌های ضروری موجود هستند!');
  console.log('🚀 پروژه آماده Push به GitHub و Deploy است.');
} else {
  console.log('⚠️  برخی فایل‌ها缺失 هستند. لطفاً بررسی کنید.');
}
console.log('='.repeat(50));

// بررسی ساختار پوشه‌ها
console.log('\n📁 ساختار نهایی پروژه:');
const projectStructure = `
natiq-masthul/
├── 📄 README.md
├── 📄 package.json
├── 📄 server.js
├── 📄 vercel.json
├── 📄 .gitignore
├── 📄 LICENSE
├── 📄 .env.example
├── src/
│   ├── 📄 main-server.js
│   ├── 📄 multi-tenant-server.js
│   ├── config/
│   │   └── 📄 config.js
│   ├── controllers/
│   │   ├── 📄 AuthController.js
│   │   ├── 📄 MainController.js
│   │   └── 📄 LicenseController.js
│   ├── services/
│   │   ├── 📄 GmailService.js
│   │   ├── 📄 NLPService.js
│   │   ├── 📄 KnowledgeService.js
│   │   └── 📄 LicenseService.js
│   ├── models/
│   │   └── 📄 User.js
│   ├── middleware/
│   │   ├── 📄 auth.js
│   │   └── 📄 security.js
│   └── utils/
│       └── 📄 logger.js
├── scripts/
│   ├── 📄 setup.js
│   └── 📄 final-check.js
├── docs/
│   └── deployment/
│       └── 📄 vercel.md
└── tests/
    ├── unit/
    └── integration/
`;

console.log(projectStructure);
