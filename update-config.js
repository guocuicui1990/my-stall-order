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

// 读取现有配置
let content = fs.readFileSync(configFile, 'utf8');

// 获取新商家的ID
const newShopId = Object.keys(newConfig)[0];
const newShopConfig = newConfig[newShopId];

// 检查是否已存在
if (content.includes(`'${newShopId}':`)) {
  console.log(`商家 ${newShopId} 已存在，更新配置...`);
  // 更新逻辑
  const pattern = new RegExp(`'${newShopId}':\\s*{[^}]+}`, 's');
  content = content.replace(pattern, `'${newShopId}': ${JSON.stringify(newShopConfig, null, 4)}`);
} else {
  console.log(`添加新商家 ${newShopId}...`);
  // 在最后一个商家后添加
  const lastEntryPattern = /('([^']+)':\s*{[^}]+},?\s*)(\n\s*)(};)/s;
  if (content.match(lastEntryPattern)) {
    content = content.replace(lastEntryPattern, `$1,\n    '${newShopId}': ${JSON.stringify(newShopConfig, null, 4)}$3$4`);
  }
}

// 保存更新
fs.writeFileSync(configFile, content);
console.log('✅ config.js 已更新！');