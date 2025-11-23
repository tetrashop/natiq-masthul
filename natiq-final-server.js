const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = 3030; // پورت جدید برای نطق مصطلح

// استفاده از Web App credentials با redirect_uri صحیح
const oauth2Client = new google.auth.OAuth2(
    '1085618464424-3fabimbjb5ps75vjepqle234usb6lr1p.apps.googleusercontent.com',
    'REDACTED',
    'http://localhost:3030/oauth2callback' // مطمئن شوید این آدرس در Google Console ثبت شده
);

// بقیه کدها مانند قبل...
console.log('🧠 سرور نطق مصطلح راه‌اندازی شد...');
