// update_config_fixed.js
const fs = require('fs');
const path = require('path');

// 检查参数
if (process.argv.length < 3) {
  console.error('Usage: node update_config_fixed.js <new_config_file>');
  process.exit(1);
}

const newConfigFile = process.argv[2];
const configFile = path.join(__dirname, 'config.js');

console.log('📋 Updating config.js with data from:', newConfigFile);

try {
  // 读取新配置
  const newConfigData = fs.readFileSync(newConfigFile, 'utf8');
  console.log('Raw config data:', newConfigData.substring(0, 200));
  
  // 清理 JSON 数据
  let cleanedData = newConfigData
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
  
  console.log('Cleaned config data:', cleanedData.substring(0, 200));
  
  const newConfig = JSON.parse(cleanedData);
  
  const shopId = Object.keys(newConfig)[0];
  const shopConfig = newConfig[shopId];
  
  console.log(`Processing shop: ${shopId}`);
  console.log('Shop name:', shopConfig.name);
  
  // 读取现有的 config.js
  let content = fs.readFileSync(configFile, 'utf8');
  
  // 准备新的商家配置字符串
  const dishesStr = JSON.stringify(shopConfig.dishes || [], null, 4)
    .replace(/\n/g, '\n        ');
  
  const newShopConfigStr = `'${shopId}': {
    name: '${shopConfig.name.replace(/'/g, "\\'")}',
    themeColor: '${shopConfig.themeColor || '#E63946'}',
    logo: '${shopConfig.logo || 'images/logo.png'}',
    qrcode: '${shopConfig.qrcode || 'images/qrcode.jpg'}',
    dishes: ${dishesStr}
}`;
  
  console.log('New shop config string:', newShopConfigStr.substring(0, 200));
  
  // 查找 window.shopConfigs = { 的位置
  const configStart = content.indexOf('window.shopConfigs = {');
  
  if (configStart === -1) {
    console.error('❌ Could not find window.shopConfigs in config.js');
    process.exit(1);
  }
  
  // 查找 window.shopConfigs 对象的结束位置
  let braceCount = 0;
  let i = configStart;
  let foundStart = false;
  
  for (; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      foundStart = true;
    } else if (content[i] === '}') {
      braceCount--;
    }
    
    if (foundStart && braceCount === 0) {
      break;
    }
  }
  
  const configEnd = i;
  const beforeConfig = content.substring(0, configStart);
  const afterConfig = content.substring(configEnd + 1);
  const configContent = content.substring(configStart, configEnd + 1);
  
  // 检查是否已存在该商家
  if (configContent.includes(`'${shopId}':`)) {
    console.log(`🔄 Updating existing shop: ${shopId}`);
    
    // 创建正则表达式匹配现有配置
    const existingPattern = new RegExp(`'${shopId}'[\\s\\S]*?\\n\\s*},?`, 'm');
    
    if (configContent.match(existingPattern)) {
      const updatedConfig = configContent.replace(existingPattern, newShopConfigStr + ',');
      content = beforeConfig + updatedConfig + afterConfig;
      console.log(`✅ Updated shop ${shopId}`);
    } else {
      console.error(`❌ Could not find existing shop pattern for ${shopId}`);
      process.exit(1);
    }
  } else {
    console.log(`➕ Adding new shop: ${shopId}`);
    
    // 在最后一个商家配置前添加
    const lastBraceIndex = configContent.lastIndexOf('}');
    const insertPosition = lastBraceIndex;
    
    const newConfigContent = 
      configContent.substring(0, insertPosition) +
      (configContent[insertPosition - 1] !== '{' && configContent[insertPosition - 1] !== ',' ? ',\n    ' : '') +
      newShopConfigStr + ',\n    ' +
      configContent.substring(insertPosition);
    
    content = beforeConfig + newConfigContent + afterConfig;
    console.log(`✅ Added new shop ${shopId}`);
  }
  
  // 保存更新
  fs.writeFileSync(configFile, content);
  console.log('✅ config.js updated successfully!');
  
} catch (error) {
  console.error('❌ Error updating config.js:', error.message);
  console.error(error.stack);
  process.exit(1);
}
