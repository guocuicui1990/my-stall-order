// ============================================
// 动态商家配置加载器
// ============================================

// 从本地存储或Supabase加载已注册的商家
async function loadRegisteredShops() {
    try {
        // 1. 先从本地存储加载
        const localShops = JSON.parse(localStorage.getItem('registered_shops') || '{}');
        
        // 2. 如果有本地商家数据，合并到配置中
        Object.keys(localShops).forEach(shopId => {
            if (!window.shopConfigs[shopId]) {
                window.shopConfigs[shopId] = {
                    name: localShops[shopId].name,
                    themeColor: localShops[shopId].themeColor || '#E63946',
                    logo: 'images/logo.png',
                    qrcode: 'images/qrcode.jpg',
                    dishes: [] // 菜品从Supabase动态加载
                };
            }
        });
        
        console.log('✅ 动态加载商家配置:', Object.keys(window.shopConfigs));
        
    } catch (error) {
        console.error('❌ 加载商家配置失败:', error);
    }
}

// ============================================
// 从Supabase动态加载商家菜品
// ============================================
async function loadShopDishesFromSupabase(shopId) {
    try {
        console.log('📋 从Supabase加载商家菜品，商家ID:', shopId);
        
        // 检查Supabase是否已初始化
        if (!window.supabaseClient) {
            console.log('📝 Supabase客户端未初始化，使用默认菜品');
            return [];
        }
        
        // 从Supabase加载商家的菜品
        const { data: dishes, error } = await window.supabaseClient
            .from('dishes')
            .select('*')
            .eq('tenant_id', shopId)
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        
        if (error) throw error;
        
        if (dishes && dishes.length > 0) {
            console.log('✅ 从Supabase加载到菜品:', dishes.length, '个');
            
            // 转换数据格式
            const formattedDishes = dishes.map(dish => ({
                id: dish.id,
                name: dish.name,
                price: parseFloat(dish.price),
                emoji: dish.emoji || '🍽️',
                category: dish.category || '未分类',
                tags: dish.tags || [],
                description: dish.description || ''
            }));
            
            return formattedDishes;
        }
        
        console.log('📝 Supabase中没有找到菜品，返回空数组');
        return [];
        
    } catch (error) {
        console.error('❌ 从Supabase加载菜品失败:', error);
        return [];
    }
}

// ============================================
// 更新菜品数据的函数（供外部调用）
// ============================================
async function updateShopDishes(shopId) {
    try {
        console.log('🔄 更新商家菜品数据，商家ID:', shopId);
        
        // 从Supabase加载菜品
        const supabaseDishes = await loadShopDishesFromSupabase(shopId);
        
        // 获取当前商家配置
        const shopConfig = window.shopConfigs[shopId] || window.shopConfigs['default_shop'];
        
        if (supabaseDishes.length > 0) {
            // 使用Supabase中的菜品数据
            shopConfig.dishes = supabaseDishes;
            console.log('✅ 已更新商家菜品数据（来自Supabase）:', shopConfig.name);
        } else if (!shopConfig.dishes || shopConfig.dishes.length === 0) {
            // 如果Supabase没有数据且配置中也没有菜品，使用默认菜品
            console.log('📝 使用默认菜品数据');
            shopConfig.dishes = window.shopConfigs['default_shop'].dishes || [];
        }
        
        return shopConfig.dishes;
        
    } catch (error) {
        console.error('❌ 更新菜品数据失败:', error);
        return [];
    }
}

// 修改获取当前商家的函数
function getCurrentShopConfig() {
    const shopId = getCurrentShopId();
    
    // 如果配置中不存在，尝试从本地存储加载
    if (!window.shopConfigs[shopId]) {
        const localShops = JSON.parse(localStorage.getItem('registered_shops') || '{}');
        if (localShops[shopId]) {
            window.shopConfigs[shopId] = {
                name: localShops[shopId].name,
                themeColor: localShops[shopId].themeColor || '#E63946',
                logo: 'images/logo.png',
                qrcode: 'images/qrcode.jpg',
                dishes: [] // 初始为空，稍后从Supabase加载
            };
        }
    }
    
    return window.shopConfigs[shopId] || window.shopConfigs['default_shop'];
}

// 页面加载时调用
document.addEventListener('DOMContentLoaded', async function() {
    // 加载已注册的商家
    await loadRegisteredShops();
    
    // 如果是顾客端或管理端页面，初始化Supabase并加载菜品
    if (typeof window.supabaseClient !== 'undefined') {
        // 获取当前商家ID
        const currentShopId = getCurrentShopId();
        
        // 更新当前商家的菜品数据
        if (currentShopId) {
            await updateShopDishes(currentShopId);
        }
    }
    
    console.log('✅ 商家配置加载完成');
});

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

// 获取当前商家ID - 管理员专用版本（完全从URL获取）
function getCurrentShopId() {
    // 只从URL参数获取，如 ?shop=老王煎饼
    const urlParams = new URLSearchParams(window.location.search);
    let shopId = urlParams.get('shop');
    
    // 如果没有URL参数，使用默认
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
    if (shopConfig && shopConfig.themeColor) {
        document.documentElement.style.setProperty('--primary-color', shopConfig.themeColor);
    }
    
    // 更新页面标题
    if (shopConfig && shopConfig.name) {
        document.title = `${shopConfig.name} - 扫码点餐`;
    }
    
    // 更新Logo（如果有）
    if (shopConfig && shopConfig.logo) {
        const logoImg = document.querySelector('.logo-image');
        if (logoImg) {
            logoImg.src = shopConfig.logo;
            logoImg.alt = shopConfig.name;
        }
    }
}

console.log('✅ 商家配置加载完成');