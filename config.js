// ============================================
// 商家配置文件 - 多商家支持
// ============================================

// 支持的商家列表
window.shopConfigs = {
    // 默认商家（兼容旧版本）
    'default_shop': {
        name: '我的摊位',
        themeColor: '#E63946',
        logo: 'images/logo.png',
        qrcode: 'images/qrcode.jpg',
        // 菜品数据（每个商家可以有自己的菜品）
        dishes: [
            { id: 1, name: '招牌炸酱面', price: 15, emoji: '🍜', category: '主食', tags: ['招牌'] },
            { id: 2, name: '麻辣烫套餐', price: 18, emoji: '🥘', category: '热菜', tags: ['套餐'] },
            { id: 3, name: '烤冷面', price: 10, emoji: '🥞', category: '小吃', tags: [] },
            { id: 4, name: '煎饼果子', price: 12, emoji: '🌯', category: '小吃', tags: ['招牌'] },
            { id: 5, name: '凉拌黄瓜', price: 8, emoji: '🥒', category: '凉菜', tags: [] },
            { id: 6, name: '米饭', price: 2, emoji: '🍚', category: '主食', tags: [] },
            { id: 7, name: '可乐', price: 4, emoji: '🥤', category: '饮料', tags: [] },
        ]
    },
    
    // 新增商家：老王煎饼
    '老王煎饼': {
        name: '老王煎饼',
        themeColor: '#FF6B35',
        logo: 'images/shops/老王煎饼/logo.png',
        qrcode: 'images/shops/老王煎饼/qrcode.jpg',
        dishes: [
            { id: 101, name: '经典煎饼果子', price: 12, emoji: '🌯', category: '煎饼', tags: ['招牌'] },
            { id: 102, name: '豪华煎饼套餐', price: 18, emoji: '🥞', category: '煎饼', tags: ['套餐'] },
            { id: 103, name: '豆浆', price: 3, emoji: '🥛', category: '饮料', tags: [] },
            { id: 104, name: '油条', price: 2, emoji: '🥖', category: '小吃', tags: [] },
        ]
    },
    
    // 新增商家：小李烧烤
    '小李烧烤': {
        name: '小李烧烤',
        themeColor: '#FF9A00',
        logo: 'images/shops/小李烧烤/logo.png',
        qrcode: 'images/shops/小李烧烤/qrcode.jpg',
        dishes: [
            { id: 201, name: '羊肉串', price: 5, emoji: '🍖', category: '烤串', tags: ['招牌'] },
            { id: 202, name: '烤鸡翅', price: 8, emoji: '🍗', category: '烤串', tags: [] },
            { id: 203, name: '烤玉米', price: 6, emoji: '🌽', category: '素食', tags: [] },
            { id: 204, name: '啤酒', price: 10, emoji: '🍺', category: '酒水', tags: [] },
        ]
    }
};

// 获取当前商家ID
function getCurrentShopId() {
    // 方法1：从URL参数获取，如 ?shop=老王煎饼
    const urlParams = new URLSearchParams(window.location.search);
    let shopId = urlParams.get('shop');
    
    // 方法2：从本地存储获取（商家后台用）
    if (!shopId) {
        shopId = localStorage.getItem('current_shop_id');
    }
    
    // 方法3：默认商家
    if (!shopId || !window.shopConfigs[shopId]) {
        shopId = 'default_shop';
    }
    
    return shopId;
}

// 获取当前商家配置
function getCurrentShopConfig() {
    const shopId = getCurrentShopId();
    return window.shopConfigs[shopId] || window.shopConfigs['default_shop'];
}

// 更新页面主题
function updateThemeForShop(shopConfig) {
    // 更新CSS变量
    document.documentElement.style.setProperty('--primary-color', shopConfig.themeColor);
    
    // 更新页面标题
    document.title = `${shopConfig.name} - 扫码点餐`;
    
    // 更新Logo（如果有）
    if (shopConfig.logo) {
        const logoImg = document.querySelector('.logo-image');
        if (logoImg) {
            logoImg.src = shopConfig.logo;
            logoImg.alt = shopConfig.name;
        }
    }
}

console.log('✅ 商家配置加载完成');