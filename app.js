const UnifiedDashboard = require('./frontend/unified-dashboard');
const { getStatus } = require('./backend/core/NAtiQ-ENHANCED');

console.log('🚀 نطق مصطلح - سیستم یکپارچه و بهینه');
console.log('📊 وضعیت سیستم:', getStatus());

// راه‌اندازی داشبورد اصلی
const dashboard = new UnifiedDashboard(8080);
dashboard.start();
