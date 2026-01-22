// ============================================
// 全局变量初始化
// ============================================
var currentTable = window._tempTable || '';
var currentOrderNumber = window._tempOrderNumber || '';
var cart = window._cart || [];
var currentCategory = 'all';
var isSubmitting = false;

// 菜品数据（使用 SVG 图标）
var dishes = [
    { 
        id: 1, 
        name: '宫保鸡丁', 
        price: 38, 
        category: '热菜', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23FFE5E5" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🍗%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E宫保鸡丁%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 2, 
        name: '鱼香肉丝', 
        price: 35, 
        category: '热菜', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23FFF3E0" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🥘%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E鱼香肉丝%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 3, 
        name: '麻婆豆腐', 
        price: 28, 
        category: '热菜', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23FFEBEE" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🍲%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E麻婆豆腐%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 4, 
        name: '凉拌黄瓜', 
        price: 15, 
        category: '凉菜', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23E8F5E9" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🥒%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E凉拌黄瓜%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 5, 
        name: '拍黄瓜', 
        price: 12, 
        category: '凉菜', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23E1F5FE" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🥗%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E拍黄瓜%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 6, 
        name: '米饭', 
        price: 3, 
        category: '主食', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23FFF9C4" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🍚%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E米饭%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 7, 
        name: '炒饭', 
        price: 18, 
        category: '主食', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23FFF3E0" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🍛%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E炒饭%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 8, 
        name: '可乐', 
        price: 8, 
        category: '饮料', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23E3F2FD" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🥤%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E可乐%3C/text%3E%3C/svg%3E'
    },
    { 
        id: 9, 
        name: '雪碧', 
        price: 8, 
        category: '饮料', 
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23F1F8E9" width="150" height="150"/%3E%3Ctext x="75" y="70" font-size="40" text-anchor="middle"%3E🥤%3C/text%3E%3Ctext x="75" y="100" font-size="14" text-anchor="middle" fill="%23666"%3E雪碧%3C/text%3E%3C/svg%3E'
    },
];

// ============================================
// 同步全局变量到 window
// ============================================
window._cart = cart;

// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM 加载完成');
    
    // 如果有临时数据，恢复它
    if (window._tempTable) {
        currentTable = window._tempTable;
        currentOrderNumber = window._tempOrderNumber;
        console.log('📋 恢复数据 - 桌号:', currentTable, '订单号:', currentOrderNumber);
    }
    
    // 🔥 立即加载菜品
    loadDishes();
    setupCategoryButtons();
    
    // 🔥 如果当前在菜单页面，再次确保菜品显示
    if (document.getElementById('menuPage').classList.contains('active')) {
        console.log('📋 检测到在菜单页面，加载菜品');
        setTimeout(function() {
            loadDishes();
        }, 100);
    }
    
    var tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (window.enterMenu) window.enterMenu();
            }
        });
    }
});

// ============================================
// 菜品相关
// ============================================
function loadDishes() {
    var container = document.getElementById('dishesContainer');
    if (!container) {
        console.error('❌ 菜品容器不存在');
        return;
    }
    
    console.log('🍽️ 开始加载菜品，当前分类:', currentCategory);
    
    var filteredDishes = currentCategory === 'all' 
        ? dishes 
        : dishes.filter(function(d) { return d.category === currentCategory; });
    
    console.log('🍽️ 筛选后菜品数量:', filteredDishes.length);
    
    if (filteredDishes.length === 0) {
        container.innerHTML = '<div style="padding: 40px; text-align: center; color: #999;">该分类暂无菜品</div>';
        return;
    }
    
    container.innerHTML = filteredDishes.map(function(dish) {
        var cartItem = cart.find(function(item) { return item.id === dish.id; });
        var quantity = cartItem ? cartItem.quantity : 0;
        
        return '<div class="dish-card">' +
            '<img src="' + dish.image + '" alt="' + dish.name + '" class="dish-image">' +
            '<div class="dish-info">' +
                '<div class="dish-name">' + dish.name + '</div>' +
                '<div class="dish-price">¥' + dish.price + '</div>' +
                '<div class="dish-actions">' +
                    '<button onclick="removeDish(' + dish.id + ')" ' + (quantity === 0 ? 'style="opacity:0.3"' : '') + '>' +
                        '<i class="fas fa-minus"></i>' +
                    '</button>' +
                    '<span class="dish-quantity">' + quantity + '</span>' +
                    '<button onclick="addDish(' + dish.id + ')">' +
                        '<i class="fas fa-plus"></i>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
    
    console.log('✅ 菜品加载完成');
}

// 暴露到全局
window.loadDishes = loadDishes;

function setupCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            currentCategory = this.dataset.category;
            console.log('🔄 切换分类到:', currentCategory);
            loadDishes();
        });
    });
}

// ============================================
// 菜品操作（连接到全局函数）
// ============================================
function addDish_real(dishId) {
    console.log('➕ 添加菜品:', dishId);
    var dish = dishes.find(function(d) { return d.id === dishId; });
    if (!dish) {
        console.error('❌ 菜品不存在:', dishId);
        return;
    }
    
    var cartItem = cart.find(function(item) { return item.id === dishId; });
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ 
            id: dish.id,
            name: dish.name,
            price: dish.price,
            category: dish.category,
            quantity: 1 
        });
    }
    
    window._cart = cart;
    updateCartUI();
    loadDishes();
}

function removeDish_real(dishId) {
    console.log('➖ 减少菜品:', dishId);
    var cartItem = cart.find(function(item) { return item.id === dishId; });
    if (!cartItem) return;
    
    if (cartItem.quantity > 1) {
        cartItem.quantity--;
    } else {
        cart = cart.filter(function(item) { return item.id !== dishId; });
    }
    
    window._cart = cart;
    updateCartUI();
    loadDishes();
}

// 连接到全局函数
window.addDish_real = addDish_real;
window.removeDish_real = removeDish_real;

// ============================================
// 购物车相关
// ============================================
function updateCartUI() {
    var totalItems = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    var totalPrice = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    
    document.getElementById('cartBadge').textContent = totalItems;
    
    var cartSummary = document.getElementById('cartSummary');
    if (cartSummary) {
        cartSummary.textContent = totalItems > 0 
            ? '已选 ' + totalItems + ' 个菜品' 
            : '未选择菜品';
    }
    
    document.getElementById('totalItems').textContent = totalItems + '个菜品';
    document.getElementById('previewTotal').textContent = totalPrice.toFixed(2);
    document.getElementById('cartTotal').textContent = totalPrice.toFixed(2);
    
    var checkoutBtnMain = document.getElementById('checkoutBtnMain');
    var checkoutBtnModal = document.getElementById('checkoutBtnModal');
    if (checkoutBtnMain) checkoutBtnMain.disabled = totalItems === 0;
    if (checkoutBtnModal) checkoutBtnModal.disabled = totalItems === 0;
    
    updateCartModal();
}

window.updateCartUI = updateCartUI;

function updateCartModal() {
    var cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">' +
            '<i class="fas fa-shopping-cart"></i>' +
            '<p>购物车是空的</p>' +
        '</div>';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(function(item) {
        return '<div class="cart-item">' +
            '<div class="item-info">' +
                '<div class="item-name">' + item.name + '</div>' +
                '<div class="item-price">¥' + item.price + ' × ' + item.quantity + '</div>' +
            '</div>' +
            '<div class="item-actions">' +
                '<button onclick="removeDish(' + item.id + ')">' +
                    '<i class="fas fa-minus"></i>' +
                '</button>' +
                '<span>' + item.quantity + '</span>' +
                '<button onclick="addDish(' + item.id + ')">' +
                    '<i class="fas fa-plus"></i>' +
                '</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ============================================
// 结账相关
// ============================================
function goToCheckout_real() {
    if (cart.length === 0) {
        alert('请先选择菜品');
        return;
    }
    
    if (window.hideCart) window.hideCart();
    
    document.getElementById('orderTable').textContent = currentTable;
    document.getElementById('orderNumber').textContent = currentOrderNumber;
    document.getElementById('orderTime').textContent = new Date().toLocaleString('zh-CN');
    
    var orderItemsList = document.getElementById('orderItemsList');
    if (orderItemsList) {
        orderItemsList.innerHTML = cart.map(function(item) {
            return '<div class="order-item-row">' +
                '<span>' + item.name + ' × ' + item.quantity + '</span>' +
                '<span>¥' + (item.price * item.quantity).toFixed(2) + '</span>' +
            '</div>';
        }).join('');
    }
    
    var totalAmount = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    document.getElementById('finalAmount').textContent = totalAmount.toFixed(2);
    document.getElementById('qrcodeAmount').textContent = totalAmount.toFixed(2);
    
    document.getElementById('menuPage').classList.remove('active');
    document.getElementById('checkoutPage').classList.add('active');
}

window.goToCheckout_real = goToCheckout_real;

// ============================================
// 订单提交到腾讯云（核心功能）
// ============================================
function submitOrder_real() {
    if (isSubmitting) {
        console.log('⏳ 订单正在提交中...');
        return;
    }
    
    if (cart.length === 0) {
        alert('订单中没有菜品');
        return;
    }

    var totalAmount = cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    var orderTime = new Date().toLocaleString('zh-CN');
    var dishesString = cart.map(function(item) {
        return item.name + ' × ' + item.quantity + ' = ¥' + (item.price * item.quantity).toFixed(2);
    }).join('; ');

    // 显示加载动画
    var loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }

    isSubmitting = true;

    // 构建订单数据
    var orderData = {
        orderNumber: currentOrderNumber,
        table: currentTable,
        dishes: dishesString,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status: '新订单',
        orderTime: orderTime,
        timestamp: new Date().getTime(),
        createdAt: new Date()
    };

    console.log('📤 正在提交订单到腾讯云...', orderData);

    // 提交到腾讯云数据库
    window.db.collection('orders').add(orderData).then(function(result) {
        console.log('✅ 订单提交成功！', result);

        // 显示成功页面
        showSuccessPage();
        cart = [];
        window._cart = cart;
        updateCartUI();
    }).catch(function(error) {
        console.error('❌ 提交订单失败:', error);
        alert('订单提交失败: ' + error.message + '\n\n请检查网络连接或联系商家。');
    }).finally(function() {
        isSubmitting = false;
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    });
}

window.submitOrder_real = submitOrder_real;

// ============================================
// 成功页面
// ============================================
function showSuccessPage() {
    document.getElementById('successOrderNumber').textContent = currentOrderNumber;
    document.getElementById('successTable').textContent = currentTable;
    document.getElementById('checkoutPage').classList.remove('active');
    document.getElementById('successPage').classList.add('active');
}
