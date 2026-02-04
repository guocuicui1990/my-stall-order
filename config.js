// ============================================
// 动态商家配置加载器
// ============================================

// 从本地存储或 Supabase 加载已注册的商家
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
                    qrcode: localShops[shopId].qrcode || 'images/qrcode.jpg',
                    dishes: localShops[shopId].dishes || []
                };
            }
        });
        
        console.log('✅ 动态加载商家配置:', Object.keys(window.shopConfigs));
        
    } catch (error) {
        console.error('❌ 加载商家配置失败:', error);
    }
}

// ============================================
// 商家配置文件 - 多商家支持
// ============================================

// 支持的商家列表
window.shopConfigs = {
    'default_shop': {
        name: '我的摊位',
        themeColor: '#E63946',
        logo: 'images/logo.png',
        qrcode: 'images/qrcode.jpg',
        dishes: [
            { id: 1, name: '招牌炸酱面', price: 15, emoji: '🍜', category: '主食', tags: ['招牌'] },
            { id: 2, name: '麻辣烫套餐', price: 18, emoji: '🥘', category: '热菜', tags: ['套餐'] },
            { id: 3, name: '烤冷面', price: 10, emoji: '🥞', category: '小吃', tags: [] },
            { id: 4, name: '煎饼果子', price: 12, emoji: '🌯', category: '小吃', tags: ['招牌'] },
            { id: 5, name: '凉拌黄瓜', price: 8, emoji: '🥒', category: '凉菜', tags: [] },
            { id: 6, name: '米饭', price: 2, emoji: '🍚', category: '主食', tags: [] },
            { id: 7, name: '可乐', price: 4, emoji: '🥤', category: '饮料', tags: [] },
        ]
    }
,
    'l_ml3jkn76b6qp': {
    "name": "老王油泼面",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/l_ml3jkn76b6qp_wechat_qrcode_1769938313587.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'm_ml3jormkbviz': {
    "name": "苗家烧鹅",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/m_ml3jormkbviz_wechat_qrcode_1769938505950.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌鹅",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "招牌虾尾",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'z_ml3kuxhsgwk8': {
    "name": "张家凉茶",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/z_ml3kuxhsgwk8_wechat_qrcode_1769940473105.png",
    "dishes": [
        {
            "id": 1,
            "name": "大碗茶",
            "price": 8,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "小碗茶",
            "price": 5,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'l_ml3lqjmvr9dt': {
    "name": "李家凉菜",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/l_ml3lqjmvr9dt_wechat_qrcode_1769941948136.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'w_ml3lyhqmsrrg': {
    "name": "王家臭豆腐",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/w_ml3lyhqmsrrg_wechat_qrcode_1769942318927.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'w_ml3medbiq9ry': {
    "name": "王家烧烤",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/w_ml3medbiq9ry_wechat_qrcode_1769943059695.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'm_ml3o4k6o6r6y': {
    "name": "苗家烧鸡",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/m_ml3o4k6o6r6y_wechat_qrcode_1769945961266.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'm_ml3rcqmyiezf': {
    "name": "苗家烧鸡",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/m_ml3rcqmyiezf_wechat_qrcode_1769951381724.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌烧鸡",
            "price": 28,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "鸡腿",
            "price": 8,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'm_ml3rxrpqczqh': {
    "name": "苗家烧鸡",
    "themeColor": "#32c759",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/m_ml3rxrpqczqh_wechat_qrcode_1769952362899.png",
    "dishes": [
        {
            "id": 1,
            "name": "特色烧鸡",
            "price": 28,
            "emoji": "🐓",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "特色烤鸭",
            "price": 24,
            "emoji": "🦆",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'z_ml3sy0kfhaua': {
    "name": "张家炒面",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/z_ml3sy0kfhaua_wechat_qrcode_1769954053989.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'shop_ml6dlonkmynr': {
    "name": "老崔凉皮",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/shop_ml6dlonkmynr_wechat_qrcode_1770109682987.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'l_ml6tdqi8fy8p': {
    "name": "老李辣条",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/l_ml6tdqi8fy8p_alipay_qrcode_1770136185977.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'wan_ml7feuo4n803': {
    "name": "老王烧饼",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/wan_ml7feuo4n803_wechat_qrcode_1770173189575.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'l_ml7fstcnr4pk': {
    "name": "l老王煎饼",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/l_ml7fstcnr4pk_alipay_qrcode_1770173841051.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'lwa_ml7hjecxyw5c': {
    "name": "l老王煎饼",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/lwa_ml7hjecxyw5c_wechat_qrcode_1770176760948.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    't_ml7jfncg4zox': {
    "name": "田家麻辣烫",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/t_ml7jfncg4zox_wechat_qrcode_1770179945207.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
,
    'sha_ml7kakjxfb4t': {
    "name": "梁家烧烤",
    "themeColor": "#e63946",
    "logo": "images/logo.png",
    "qrcode": "https://slonbvmhsxqgpoodwazj.supabase.co/storage/v1/object/public/shop-qrcodes/sha_ml7kakjxfb4t_wechat_qrcode_1770181387933.png",
    "dishes": [
        {
            "id": 1,
            "name": "招牌炸酱面",
            "price": 15,
            "emoji": "🍜",
            "category": "主食",
            "tags": []
        },
        {
            "id": 2,
            "name": "麻辣烫套餐",
            "price": 18,
            "emoji": "🥘",
            "category": "主食",
            "tags": []
        }
    ]
}
};

// 获取当前商家ID
function getCurrentShopId() {
    // 从URL参数获取，如 ?shop=老王煎饼
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

// 页面加载时自动合并
document.addEventListener('DOMContentLoaded', function() {
    loadRegisteredShops();
    console.log('✅ 商家配置加载完成');
});
