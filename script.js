// 临时测试：在控制台手动调用enterMenu函数
window.enterMenu = function() {
    console.log('测试：enterMenu被调用');
    
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.value = '1'; // 自动设置桌号
    }
    
    // 模拟点击后的操作
    alert('测试：开始点餐功能正常！');
    
    // 实际切换页面
    document.getElementById('seatPage').classList.remove('active');
    document.getElementById('menuPage').classList.add('active');
};
// ============================================
// 菜品数据
// ============================================
const dishes = [
    { id: 1, name: "麻辣烫", price: 15, category: "热菜" },
    { id: 2, name: "烤冷面", price: 10, category: "热菜" },
    { id: 3, name: "煎饼果子", price: 8, category: "主食" },
    { id: 4, name: "炸串套餐", price: 20, category: "热菜" },
    { id: 5, name: "凉皮", price: 8, category: "凉菜" },
    { id: 6, name: "酸梅汤", price: 3, category: "饮料" },
    { id: 7, name: "豆浆", price: 2, category: "饮料" },
    { id: 8, name: "茶叶蛋", price: 2, category: "热菜" }
];

// ============================================
// 全局变量
// ============================================
let cart = [];
let currentTable = "";
let currentCategory = "all";
let currentOrderNumber = "";

// ============================================
// 工具函数
// ============================================
function setQuickTable(tableNum) {
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.value = tableNum;
        // 触发输入事件以更新按钮状态
        tableInput.dispatchEvent(new Event('input'));
    }
}

// ============================================
// 进入菜单页面（修复版）
// ============================================
function enterMenu() {
    console.log('enterMenu函数被调用');
    
    const tableInput = document.getElementById('tableNumber');
    if (!tableInput) {
        console.error('未找到tableNumber输入框');
        alert('系统错误，请刷新页面重试');
        return;
    }
    
    const tableValue = tableInput.value.trim();
    if (!tableValue) {
        alert('请输入桌号或选择打包');
        tableInput.focus();
        return;
    }
    
    currentTable = tableValue;
    localStorage.setItem('stall_table', currentTable);
    console.log('设置桌号:', currentTable);
    
    // 切换页面
    document.getElementById('seatPage').classList.remove('active');
    document.getElementById('menuPage').classList.add('active');
    
    // 更新桌号显示
    const tableDisplay = document.getElementById('currentTableDisplay');
    if (tableDisplay) {
        tableDisplay.textContent = currentTable;
    } else {
        console.error('未找到currentTableDisplay元素');
    }
    
    // 加载菜品
    loadDishes();
    updateCartUI();
}

// ============================================
// 页面切换函数
// ============================================
function backToSeat() {
    console.log('返回座位页面');
    document.getElementById('menuPage').classList.remove('active');
    document.getElementById('seatPage').classList.add('active');
}

function backToMenu() {
    console.log('返回菜单页面');
    document.getElementById('checkoutPage').classList.remove('active');
    document.getElementById('menuPage').classList.add('active');
}

function goToCheckout() {
    console.log('前往结账页面');
    if (cart.length === 0) {
        alert('请先选择菜品');
        return;
    }
    
    // 生成订单号
    currentOrderNumber = generateOrderNumber();
    const orderTime = new Date().toLocaleString('zh-CN');
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 更新显示
    document.getElementById('orderTable').textContent = currentTable;
    document.getElementById('orderNumber').textContent = currentOrderNumber;
    document.getElementById('orderTime').textContent = orderTime;
    document.getElementById('finalAmount').textContent = totalAmount;
    document.getElementById('qrcodeAmount').textContent = '¥' + totalAmount;
    
    // 显示订单明细
    const orderItemsContainer = document.getElementById('orderItemsList');
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item-row';
            itemElement.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>¥${item.price * item.quantity}</span>
            `;
            orderItemsContainer.appendChild(itemElement);
        });
    }
    
    // 切换页面
    document.getElementById('menuPage').classList.remove('active');
    document.getElementById('checkoutPage').classList.add('active');
    
    // 隐藏购物车弹窗
    hideCart();
}

function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}${random}`;
}

// ============================================
// 菜品加载与显示
// ============================================
function loadDishes() {
    const container = document.getElementById('dishesContainer');
    if (!container) {
        console.error('未找到dishesContainer元素');
        return;
    }
    
    container.innerHTML = '';
    
    const filteredDishes = currentCategory === 'all' 
        ? dishes 
        : dishes.filter(dish => dish.category === currentCategory);
    
    if (filteredDishes.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fas fa-utensils" style="font-size:48px;opacity:0.3;"></i>
                <p>暂无菜品</p>
            </div>
        `;
        return;
    }
    
    filteredDishes.forEach(dish => {
        const cartItem = cart.find(item => item.id === dish.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const dishCard = document.createElement('div');
        dishCard.className = 'dish-card';
        dishCard.innerHTML = `
            <img src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8f9fa'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='10' text-anchor='middle' dy='.3em' fill='%23666'%3E🍽️%3C/text%3E%3C/svg%3E" 
                 alt="${dish.name}" class="dish-image">
            <div class="dish-info">
                <div>
                    <div class="dish-name">${dish.name}</div>
                    <div class="dish-price">¥${dish.price}</div>
                </div>
                <div class="dish-actions">
                    <button onclick="decreaseQuantity(${dish.id})" ${quantity === 0 ? 'disabled style="opacity:0.5"' : ''}>-</button>
                    <span class="dish-quantity">${quantity}</span>
                    <button onclick="increaseQuantity(${dish.id})">+</button>
                </div>
            </div>
        `;
        
        container.appendChild(dishCard);
    });
}

// ============================================
// 购物车操作
// ============================================
function increaseQuantity(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;
    
    const itemIndex = cart.findIndex(item => item.id === dishId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity++;
    } else {
        cart.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: 1
        });
    }
    
    updateCartUI();
    loadDishes();
}

function decreaseQuantity(dishId) {
    const itemIndex = cart.findIndex(item => item.id === dishId);
    
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    
    updateCartUI();
    loadDishes();
}

function updateCartUI() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // 更新购物车徽章
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // 更新底部购物车栏
    const totalItemsEl = document.getElementById('totalItems');
    const previewTotalEl = document.getElementById('previewTotal');
    const cartSummaryEl = document.getElementById('cartSummary');
    
    if (totalItemsEl) totalItemsEl.textContent = `${totalItems}个菜品`;
    if (previewTotalEl) previewTotalEl.textContent = totalPrice;
    if (cartSummaryEl) {
        cartSummaryEl.textContent = totalItems > 0 ? 
            `已选 ${totalItems} 个菜品，合计 ¥${totalPrice}` : '未选择菜品';
    }
    
    // 更新结算按钮状态
    const checkoutBtnMain = document.getElementById('checkoutBtnMain');
    const checkoutBtnModal = document.getElementById('checkoutBtnModal');
    const isCartEmpty = totalItems === 0;
    
    if (checkoutBtnMain) {
        checkoutBtnMain.disabled = isCartEmpty;
        if (!isCartEmpty) {
            checkoutBtnMain.innerHTML = `去结算 (¥${totalPrice}) <i class="fas fa-arrow-right"></i>`;
        } else {
            checkoutBtnMain.innerHTML = '去结算 <i class="fas fa-arrow-right"></i>';
        }
    }
    
    if (checkoutBtnModal) {
        checkoutBtnModal.disabled = isCartEmpty;
        if (!isCartEmpty) {
            checkoutBtnModal.innerHTML = `去结算 (¥${totalPrice}) <i class="fas fa-arrow-right"></i>`;
        } else {
            checkoutBtnModal.innerHTML = '去结算 <i class="fas fa-arrow-right"></i>';
        }
    }
    
    // 更新购物车弹窗内容
    updateCartModal();
}

function updateCartModal() {
    const container = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (!container || !cartTotalEl) return;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#999;">
                <i class="fas fa-shopping-cart" style="font-size:48px;opacity:0.3;"></i>
                <p>购物车为空</p>
            </div>
        `;
        cartTotalEl.textContent = '0';
        return;
    }
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">¥${item.price} × ${item.quantity} = ¥${item.price * item.quantity}</div>
            </div>
            <div class="item-actions">
                <button onclick="decreaseQuantity(${item.id})" ${item.quantity === 1 ? 'style="opacity:0.5"' : ''}>-</button>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
        `;
        container.appendChild(itemElement);
    });
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalEl.textContent = totalPrice;
}

function showCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function clearCart() {
    if (cart.length === 0) {
        hideCart();
        return;
    }
    
    if (confirm('确定要清空购物车吗？')) {
        cart = [];
        updateCartUI();
        loadDishes();
        hideCart();
    }
}

// ============================================
// 订单提交
// ============================================
function submitOrder() {
    if (cart.length === 0) {
        alert('订单中没有菜品');
        return;
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderTime = new Date().toLocaleString('zh-CN');
    
    // 构建订单数据
    const orderData = {
        orderNumber: currentOrderNumber,
        table: currentTable,
        dishes: cart.map(item => `${item.name} × ${item.quantity} = ¥${item.price * item.quantity}`).join('; '),
        totalAmount: totalAmount.toString(),
        status: '新订单',
        orderTime: orderTime,
        timestamp: Date.now()
    };
    
    // 显示加载动画
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    // 模拟提交过程
    setTimeout(() => {
        // 保存到本地
        saveOrderToLocal(orderData);
        
        // 生成订单二维码
        generateOrderQR(orderData);
        
        // 提交成功，跳转到成功页面
        document.getElementById('successOrderNumber').textContent = currentOrderNumber;
        document.getElementById('successTable').textContent = currentTable;
        
        // 切换页面
        document.getElementById('checkoutPage').classList.remove('active');
        document.getElementById('successPage').classList.add('active');
        
        // 清空购物车
        cart = [];
        updateCartUI();
        
        // 隐藏加载动画
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }, 1500);
}

function saveOrderToLocal(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('customer_orders', JSON.stringify(orders));
        console.log('订单已保存到本地');
    } catch (error) {
        console.error('保存到本地失败:', error);
    }
}

function generateOrderQR(orderData) {
    // 将订单数据转为JSON字符串
    const orderJson = JSON.stringify(orderData);
    
    // 使用免费的二维码生成服务
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(orderJson)}`;
    
    // 显示提示
    alert('✅ 订单提交成功！\n\n请向商家展示订单二维码：\n订单号: ' + orderData.orderNumber + '\n桌号: ' + orderData.table);
    
    return qrUrl;
}

function newOrder() {
    // 回到座位选择页面
    document.getElementById('successPage').classList.remove('active');
    document.getElementById('seatPage').classList.add('active');
    
    // 重置显示
    const currentTableDisplay = document.getElementById('currentTableDisplay');
    if (currentTableDisplay) {
        currentTableDisplay.textContent = '-';
    }
    
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.value = '';
        tableInput.focus();
    }
}

// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，初始化中...');
    
    // 加载保存的桌号
    const savedTable = localStorage.getItem('stall_table');
    if (savedTable) {
        const tableInput = document.getElementById('tableNumber');
        if (tableInput) {
            tableInput.value = savedTable;
        }
    }
    
    // 绑定分类按钮事件
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            loadDishes();
        });
    });
    
    // 绑定输入框事件（启用/禁用开始点餐按钮）
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.addEventListener('input', function() {
            const enterBtn = document.getElementById('enterMenuBtn');
            if (enterBtn) {
                enterBtn.disabled = !this.value.trim();
            }
        });
        
        // 初始检查
        const enterBtn = document.getElementById('enterMenuBtn');
        if (enterBtn && tableInput.value.trim()) {
            enterBtn.disabled = false;
        }
    }
    
    // 绑定Enter键
    if (tableInput) {
        tableInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                enterMenu();
            }
        });
    }
    
    // 绑定模态框关闭事件
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('cartModal');
        if (modal && modal.classList.contains('active')) {
            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent.contains(event.target) && !event.target.closest('.cart-icon')) {
                hideCart();
            }
        }
    });
    
    // ESC键关闭购物车
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideCart();
        }
    });
    
    console.log('初始化完成');
});

