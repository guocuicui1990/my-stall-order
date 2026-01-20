// ============================================
// 配置区域 - 替换为你的GitHub信息
// ============================================
const GITHUB_USERNAME = 'guocuicui1990';
const GITHUB_REPO = 'my-stall-order';
const GITHUB_TOKEN = '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';

// ============================================
// 全局变量
// ============================================
let currentTable = '';
let currentOrderNumber = '';
let cart = [];
let isSubmitting = false;

// 菜品数据
const dishes = [
    { id: '1', name: '宫保鸡丁', price: 38, category: '热菜', image: './images/宫保鸡丁.jpg' },
    { id: '2', name: '鱼香肉丝', price: 35, category: '热菜', image: './images/鱼香肉丝.jpg' },
    { id: '3', name: '麻婆豆腐', price: 28, category: '热菜', image: './images/麻婆豆腐.jpg' },
    { id: '4', name: '拍黄瓜', price: 18, category: '凉菜', image: './images/拍黄瓜.jpg' },
    { id: '5', name: '口水鸡', price: 32, category: '凉菜', image: './images/口水鸡.jpg' },
    { id: '6', name: '白米饭', price: 2, category: '主食', image: './images/白米饭.jpg' },
    { id: '7', name: '扬州炒饭', price: 25, category: '主食', image: './images/扬州炒饭.jpg' },
    { id: '8', name: '可乐', price: 5, category: '饮料', image: './images/可乐.jpg' },
    { id: '9', name: '雪碧', price: 5, category: '饮料', image: './images/雪碧.jpg' },
    { id: '10', name: '酸梅汤', price: 8, category: '饮料', image: './images/酸梅汤.jpg' }
];

// ============================================
// 页面切换函数
// ============================================

// 切换页面函数
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 进入菜单页面
function enterMenu() {
    const tableNumber = document.getElementById('tableNumber').value.trim();
    
    if (!tableNumber) {
        alert('请输入桌号');
        document.getElementById('tableNumber').focus();
        return;
    }
    
    currentTable = tableNumber;
    
    // 显示当前桌号
    document.getElementById('currentTableDisplay').textContent = currentTable;
    document.getElementById('orderTable').textContent = currentTable;
    document.getElementById('successTable').textContent = currentTable;
    
    // 生成订单号
    const timestamp = Date.now();
    currentOrderNumber = 'ORD' + timestamp.toString().slice(-8);
    document.getElementById('orderNumber').textContent = currentOrderNumber;
    document.getElementById('successOrderNumber').textContent = currentOrderNumber;
    
    // 更新时间
    const now = new Date();
    document.getElementById('orderTime').textContent = now.toLocaleString('zh-CN');
    
    // 切换到菜单页面
    switchPage('menuPage');
    
    // 加载菜品
    loadDishes();
}

// 返回座位页面
function backToSeat() {
    if (confirm('返回将清空当前购物车，确定要返回吗？')) {
        cart = [];
        updateCartUI();
        switchPage('seatPage');
    }
}

// 返回菜单页面（从结账页面）
function backToMenu() {
    switchPage('menuPage');
}

// 快速设置桌号
function setQuickTable(table) {
    document.getElementById('tableNumber').value = table;
    document.getElementById('tableNumber').focus();
}

// ============================================
// 购物车相关函数
// ============================================

// 显示购物车弹窗
function showCart() {
    if (cart.length === 0) {
        alert('购物车为空');
        return;
    }
    document.getElementById('cartModal').classList.add('active');
}

// 隐藏购物车弹窗
function hideCart() {
    document.getElementById('cartModal').classList.remove('active');
}

// 清空购物车
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('确定要清空购物车吗？')) {
        cart = [];
        updateCartUI();
        hideCart();
        showToast('购物车已清空');
    }
}

// 添加菜品到购物车
function addToCart(dish) {
    const existingItem = cart.find(item => item.id === dish.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...dish,
            quantity: 1
        });
    }
    
    updateCartUI();
    showAddToCartAnimation(dish.id);
    showToast(`已添加 ${dish.name}`);
}

// 更新购物车项目数量
function updateCartItem(dishId, change) {
    const itemIndex = cart.findIndex(item => item.id === dishId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    
    updateCartUI();
    updateDishQuantities();
}

// 更新购物车UI
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 更新购物车徽章
    document.getElementById('cartBadge').textContent = totalItems;
    
    // 更新底部购物车栏
    document.getElementById('totalItems').textContent = `${totalItems}个菜品`;
    document.getElementById('previewTotal').textContent = totalPrice.toFixed(2);
    document.getElementById('cartTotal').textContent = totalPrice.toFixed(2);
    document.getElementById('finalAmount').textContent = totalPrice.toFixed(2);
    document.getElementById('qrcodeAmount').textContent = totalPrice.toFixed(2);
    
    // 更新购物车摘要
    const cartSummary = document.getElementById('cartSummary');
    if (totalItems === 0) {
        cartSummary.textContent = '未选择菜品';
    } else {
        const firstItem = cart[0];
        cartSummary.textContent = totalItems === 1 
            ? `${firstItem.name} × ${firstItem.quantity}`
            : `${firstItem.name} 等${totalItems}个菜品`;
    }
    
    // 更新结算按钮状态
    const checkoutBtnMain = document.getElementById('checkoutBtnMain');
    const checkoutBtnModal = document.getElementById('checkoutBtnModal');
    
    if (checkoutBtnMain) checkoutBtnMain.disabled = totalItems === 0;
    if (checkoutBtnModal) checkoutBtnModal.disabled = totalItems === 0;
    
    // 更新购物车项目列表
    updateCartItems();
    updateOrderItems();
}

// 更新购物车项目列表
function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>购物车为空</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">¥${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <div class="item-actions">
                <button onclick="updateCartItem('${item.id}', -1)">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button onclick="updateCartItem('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
}

// 更新订单项目列表
function updateOrderItems() {
    const orderItemsContainer = document.getElementById('orderItemsList');
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>暂无菜品</p>
            </div>
        `;
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item-row">
            <span>${item.name} × ${item.quantity}</span>
            <span>¥${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

// 去结算
function goToCheckout() {
    if (cart.length === 0) {
        alert('请先选择菜品');
        return;
    }
    
    // 更新订单明细
    updateOrderItems();
    
    // 切换到结账页面
    switchPage('checkoutPage');
    hideCart();
}

// 显示添加购物车动画
function showAddToCartAnimation(dishId) {
    const dishElement = document.querySelector(`[data-dish-id="${dishId}"] .dish-actions button:last-child`);
    if (dishElement) {
        dishElement.classList.add('pulse');
        setTimeout(() => {
            dishElement.classList.remove('pulse');
        }, 300);
    }
}

// ============================================
// 菜品相关函数
// ============================================

// 加载菜品
function loadDishes() {
    const dishesContainer = document.getElementById('dishesContainer');
    
    dishesContainer.innerHTML = dishes.map(dish => `
        <div class="dish-card" data-dish-id="${dish.id}" data-category="${dish.category}">
            <img src="${dish.image}" alt="${dish.name}" class="dish-image" 
                 onerror="this.src='data:image/svg+xml;charset=utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23f0f0f0\"/><text x=\"50\" y=\"50\" font-family=\"Arial\" font-size=\"10\" text-anchor=\"middle\" dy=\".3em\">菜品</text></svg>'">
            <div class="dish-info">
                <div class="dish-name">${dish.name}</div>
                <div class="dish-price">¥${dish.price.toFixed(2)}</div>
                <div class="dish-actions">
                    <button onclick="updateCartItem('${dish.id}', -1)">-</button>
                    <span class="dish-quantity" id="quantity-${dish.id}">0</span>
                    <button onclick="addToCart(${JSON.stringify(dish).replace(/"/g, '&quot;')})">+</button>
                </div>
            </div>
        </div>
    `).join('');
    
    // 初始化分类筛选
    setupCategoryFilter();
    
    // 更新菜品数量显示
    updateDishQuantities();
}

// 更新菜品数量显示
function updateDishQuantities() {
    dishes.forEach(dish => {
        const dishElement = document.getElementById(`quantity-${dish.id}`);
        if (dishElement) {
            const cartItem = cart.find(item => item.id === dish.id);
            dishElement.textContent = cartItem ? cartItem.quantity : 0;
        }
    });
}

// 设置分类筛选
function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有active类
            categoryBtns.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            filterDishesByCategory(category);
        });
    });
}

// 根据分类筛选菜品
function filterDishesByCategory(category) {
    const dishCards = document.querySelectorAll('.dish-card');
    
    dishCards.forEach(card => {
        const dishCategory = card.getAttribute('data-category');
        
        if (category === 'all' || category === dishCategory) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// 订单提交函数
// ============================================

// 订单提交函数
async function submitOrder() {
    // 这里保持与您原来的函数一致，但确保调用showSuccessPage
    if (isSubmitting) return;
    
    if (cart.length === 0) {
        alert('订单中没有菜品');
        return;
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderTime = new Date().toLocaleString('zh-CN');
    
    // 将菜品数组转为字符串
    const dishesString = cart.map(item => 
        `${item.name} × ${item.quantity} = ¥${item.price * item.quantity}`
    ).join('; ');
    
    // 显示加载动画
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    if (loadingText) {
        loadingText.textContent = '正在提交订单...';
    }
    
    isSubmitting = true;
    
    try {
        // 构建订单数据
        const orderData = {
            orderNumber: currentOrderNumber,
            table: currentTable,
            dishes: dishesString,
            totalAmount: totalAmount.toString(),
            status: '新订单',
            orderTime: orderTime,
            paymentTime: orderTime,
            timestamp: new Date().getTime()
        };
        
        console.log('订单数据:', orderData);
        
        // 1. 保存到本地
        saveOrderToLocal(orderData);
        
        // 2. 提交到GitHub（自动同步到商家后台）
        const result = await submitOrderToGitHub(orderData);
        
        if (result.success) {
            // 3. 提交成功
            showSuccessPage();
            cart = [];
            updateCartUI();
            showToast('订单提交成功！');
        } else {
            throw new Error(result.message || '提交失败');
        }
        
    } catch (error) {
        console.error('提交订单出错:', error);
        alert('订单提交失败，但已保存到本地。请告知商家。');
        
        // 仍然显示成功页面
        showSuccessPage();
        cart = [];
        updateCartUI();
    } finally {
        isSubmitting = false;
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }
}

// 提交订单到GitHub
async function submitOrderToGitHub(orderData) {
    try {
        // 方法1：直接通过GitHub API提交（需要GitHub Token）
        const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/dispatches`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_type: 'new_order',
                    client_payload: {
                        order: orderData
                    }
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API错误: ${response.status}`);
        }
        
        return { success: true, message: '订单已提交' };
        
    } catch (error) {
        console.error('GitHub提交失败:', error);
        
        // 方法2：通过Webhook方式（更简单，不需要GitHub Token）
        try {
            await submitOrderViaWebhook(orderData);
            return { success: true, message: '订单已通过Webhook提交' };
        } catch (webhookError) {
            console.error('Webhook提交也失败:', webhookError);
            throw new Error('所有提交方式都失败');
        }
    }
}

// 通过Webhook提交订单（简单方式）
async function submitOrderViaWebhook(orderData) {
    // 使用一个免费的Webhook服务（例如：webhook.site）
    const WEBHOOK_URL = 'https://webhook.site/你的webhook-id';
    
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'new_order',
            order: orderData,
            timestamp: new Date().toISOString()
        })
    });
    
    if (!response.ok) {
        throw new Error(`Webhook错误: ${response.status}`);
    }
    
    return true;
}

// 保存订单到本地
function saveOrderToLocal(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('local_orders', JSON.stringify(orders));
        console.log('订单已保存到本地:', orderData);
    } catch (error) {
        console.error('保存到本地失败:', error);
    }
}

// 兼容原来的函数名
function submitOrderToGoogleSheet() {
    submitOrder();
}

// ============================================
// 成功页面相关
// ============================================

// 显示成功页面
function showSuccessPage() {
    document.getElementById('successTable').textContent = currentTable;
    switchPage('successPage');
}

// 再来一单
function newOrder() {
    currentTable = '';
    cart = [];
    document.getElementById('tableNumber').value = '';
    switchPage('seatPage');
    showToast('已开始新订单');
}

// ============================================
// 工具函数
// ============================================

// 显示提示消息
function showToast(message, type = 'info') {
    // 移除现有的提示
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建提示元素
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#4CAF50' : '#667eea'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        font-size: 14px;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 3秒后移除
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 添加CSS动画
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pulse {
            animation: pulse 0.3s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        @keyframes slideUp {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
        
        .toast-message {
            animation: slideDown 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 初始化
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('点餐系统初始化...');
    
    // 添加自定义样式
    addCustomStyles();
    
    // 设置初始页面
    switchPage('seatPage');
    
    // 监听桌号输入框的键盘事件（Enter键）
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                enterMenu();
            }
        });
        
        // 聚焦到输入框
        tableInput.focus();
    }
    
    // 点击购物车图标时更新购物车项目
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            updateCartItems();
        });
    }
    
    // 监听模态框外部点击
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                hideCart();
            }
        });
    }
    
    // 更新菜品数量显示
    updateDishQuantities();
    
    console.log('点餐系统初始化完成');
});

// 全局暴露必要函数
window.enterMenu = enterMenu;
window.backToSeat = backToSeat;
window.backToMenu = backToMenu;
window.showCart = showCart;
window.hideCart = hideCart;
window.clearCart = clearCart;
window.goToCheckout = goToCheckout;
window.submitOrderToGoogleSheet = submitOrderToGoogleSheet;
window.newOrder = newOrder;
window.setQuickTable = setQuickTable;
window.updateCartItem = updateCartItem;
window.addToCart = addToCart;
