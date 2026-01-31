#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 检查参数
if (process.argv.length < 3) {
  console.error('Usage: node update_config.js <new_config_file>');
  process.exit(1);
}

const newConfigFile = process.argv[2];
const configFile = path.join(__dirname, 'config.js');

console.log('📋 Updating config.js with data from:', newConfigFile);

try {
  // 读取新配置
  const newConfigData = fs.readFileSync(newConfigFile, 'utf8');
  const newConfig = JSON.parse(newConfigData);
  
  console.log('New config:', Object.keys(newConfig));
  
  const shopId = Object.keys(newConfig)[0];
  const shopConfig = newConfig[shopId];
  
  console.log(`Processing shop: ${shopId}`);
  console.log('Shop name:', shopConfig.name);
  console.log('Theme color:', shopConfig.themeColor);
  console.log('Number of dishes:', shopConfig.dishes?.length || 0);
  
  // 读取现有的config.js
  let content = fs.readFileSync(configFile, 'utf8');
  
  // 准备新的商家配置字符串
  const newShopConfigStr = `'${shopId}': {
    name: '${shopConfig.name}',
    themeColor: '${shopConfig.themeColor || '#E63946'}',
    logo: '${shopConfig.logo || 'images/logo.png'}',
    qrcode: '${shopConfig.qrcode || 'images/qrcode.jpg'}',
    dishes: ${JSON.stringify(shopConfig.dishes || [], null, 4)}
}`;
  
  // 查找window.shopConfigs对象
  const configMatch = content.match(/window\.shopConfigs\s*=\s*(\{[\s\S]*?\};)/);
  
  if (!configMatch) {
    console.error('❌ Could not find window.shopConfigs object in config.js');
    console.error('Make sure config.js contains: window.shopConfigs = { ... };');
    process.exit(1);
  }
  
  const fullConfig = configMatch[1];
  console.log('Found shopConfigs object');
  
  // 检查是否已存在该商家
  if (content.includes(`'${shopId}':`)) {
    console.log(`🔄 Updating existing shop: ${shopId}`);
    
    // 创建正则表达式匹配现有配置
    const existingPattern = new RegExp(`'${shopId}'\\s*:\\s*\\{[^}]+\\}`, 's');
    
    if (content.match(existingPattern)) {
      content = content.replace(existingPattern, newShopConfigStr);
      console.log(`✅ Updated shop ${shopId}`);
    } else {
      console.error(`❌ Could not find existing shop pattern for ${shopId}`);
      process.exit(1);
    }
  } else {
    console.log(`➕ Adding new shop: ${shopId}`);
    
    // 找到最后一个商家配置后添加
    // 查找最后一个商家配置的结束位置
    const lastShopPattern = /('([^']+)':\s*\{[^}]+\},?\s*)(\n\s*)(\};)/s;
    
    if (content.match(lastShopPattern)) {
      // 在最后一个商家后添加新配置
      content = content.replace(lastShopPattern, `$1,\n    ${newShopConfigStr}$3$4`);
      console.log(`✅ Added new shop ${shopId} after last existing shop`);
    } else {
      // 如果没有找到，直接在对象末尾添加
      const beforeEnd = content.lastIndexOf('};');
      if (beforeEnd !== -1) {
        content = content.substring(0, beforeEnd) + 
                 `,\n    ${newShopConfigStr}\n` + 
                 content.substring(beforeEnd);
        console.log(`✅ Added new shop ${shopId} at the end of shopConfigs`);
      } else {
        console.error('❌ Could not find end of shopConfigs object');
        process.exit(1);
      }
    }
  }
  
  // 保存更新
  fs.writeFileSync(configFile, content);
  console.log('✅ config.js updated successfully!');
  
  // 显示更新后的部分
  console.log('\n📄 Updated section preview:');
  const updatedMatch = content.match(new RegExp(`'${shopId}'[\\s\\S]*?\\n\\s*}`, 'm'));
  if (updatedMatch) {
    console.log(updatedMatch[0]);
  }
  
} catch (error) {
  console.error('❌ Error updating config.js:', error.message);
  console.error(error.stack);
  process.exit(1);
}