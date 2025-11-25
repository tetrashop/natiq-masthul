const fs = require('fs');

console.log('🔧 ادغام هوشمند package.json...\n');

const mainPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const ecoPackage = JSON.parse(fs.readFileSync('natiq-ecosystem/package.json', 'utf8'));

// ادغام هوشمند
const mergedPackage = {
    ...mainPackage,
    ...ecoPackage,
    dependencies: {
        ...mainPackage.dependencies,
        ...ecoPackage.dependencies
    },
    scripts: {
        ...mainPackage.scripts,
        ...ecoPackage.scripts
    }
};

// حذف فیلدهای تکراری
delete mergedPackage.main;
delete mergedPackage.directories;

fs.writeFileSync('package.json', JSON.stringify(mergedPackage, null, 2));
console.log('✅ package.json با موفقیت ادغام شد!');

// نمایش تغییرات
console.log('\n📦 وابستگی‌های اضافه شده:');
Object.keys(ecoPackage.dependencies || {}).forEach(dep => {
    if (!mainPackage.dependencies?.[dep]) {
        console.log(`   + ${dep}: ${ecoPackage.dependencies[dep]}`);
    }
});

console.log('\n🎯 اسکریپت‌های اضافه شده:');
Object.keys(ecoPackage.scripts || {}).forEach(script => {
    if (!mainPackage.scripts?.[script]) {
        console.log(`   + ${script}: ${ecoPackage.scripts[script]}`);
    }
});
