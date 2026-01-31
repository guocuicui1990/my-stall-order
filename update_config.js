#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取新配置
const newConfigPath = process.argv[2];
if (!newConfigPath) {
  console.error('请提供新配置JSON文件路径');
  process.exit(1);
}

const newConfig = JSON.parse(fs.readFileSync(newConfigPath, 'utf8'));
const configFile = path.join(__dirname, 'config.js');

console.log('新的配置:', JSON.stringify(newConfig, null, 2));

// 读取现有配置
let content = fs.readFileSync(configFile, 'utf8');

// 获取新商家的ID
const newShopId = Object.keys(newConfig)[0];
const newShopConfig = newConfig[newShopId];

console.log(`处理商家: ${newShopId}`);

// 查找window.shopConfigs对象
const configMatch = content.match(/window\.shopConfigs\s*=\s*(\{[\s\S]*?\});/);
if (!configMatch) {
  console.error('在config.js中找不到window.shopConfigs对象');
  process.exit(1);
}

// 准备新的商家配置字符串
const newShopConfigStr = `'${newShopId}': {
    name: '${newShopConfig.name}',
    themeColor: '${newShopConfig.themeColor || '#E63946'}',
    logo: '${newShopConfig.logo || 'images/logo.png'}',
    qrcode: '${newShopConfig.qrcode || 'images/qrcode.jpg'}',
    dishes: ${JSON.stringify(newShopConfig.dishes || [], null, 4)}
}`;

// 检查是否已存在该商家
if (content.includes(`'${newShopId}':`)) {
  console.log(`更新现有商家: ${newShopId}`);
  // 更新逻辑 - 找到并替换
  const pattern = new RegExp(`'${newShopId}'\\s*:\\s*\\{[^}]+\\}`, 's');
  content = content.replace(pattern, newShopConfigStr);
} else {
  console.log(`添加新商家: ${newShopId}`);
  
  // 找到最后一个商家配置的末尾
  const lastEntryPattern = /('([^']+)':\s*\{[^}]+\},?\s*)(\n\s*)(\};)/s;
  const match = content.match(lastEntryPattern);
  
  if (match) {
    // 在最后一个商家后添加新配置
    content = content.replace(lastEntryPattern, `$1,\n    ${newShopConfigStr}$3$4`);
  } else {
    console.error('无法找到合适的位置添加新商家配置');
    process.exit(1);
  }
}

// 保存更新
fs.writeFileSync(configFile, content);
console.log('✅ config.js 已成功更新！');
