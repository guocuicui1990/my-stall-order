// ============================================
// 配置区域 - ⚠️ 请替换为你的GitHub信息
// ============================================
const GITHUB_USERNAME = 'guocuicui1990';
const GITHUB_REPO = 'my-stall-order';
// ⚠️ 重要：请立即撤销旧token并生成新的token
// 前往: https://github.com/settings/tokens
// 权限需要: repo (完整权限)
const GITHUB_TOKEN = 'GITHUB_TOKEN'; // 替换为新token

// ============================================
// 全局变量
// ============================================
let currentTable = '';
let currentOrderNumber = '';
let cart = [];
let dishes = [
    { id: 1, name: '宫保鸡丁', price: 38, category: '热菜', image: 'https://via.placeholder.com/150?text=宫保鸡丁' },
    { id: 2, name: '鱼香肉丝', price: 35, category: '热菜', image: 'https://via.placeholder.com/150?text=鱼香肉丝' },
    { id: 3, name: '麻婆豆腐', price: 28, category: '热菜', image: 'https://via.placeholder.com/150?text=麻婆豆腐' },
    { id: 4, name: '凉拌黄瓜', price: 15, category: '凉菜', image: 'https://via.placeholder.com/150?text=凉拌黄瓜' },
    { id: 5, name: '拍黄瓜', price: 12, category: '凉菜', image: 'https://via.placeholder.com/150?text=拍黄瓜' },
    { id: 6, name: '米饭', price: 3, category: '主食', image: 'https://via.placeholder.com/150?text=米饭' },
    { id: 7, name: '炒饭', price: 18, category: '主食', image: 'https://via.placeholder.com/150?text=炒饭' },
    { id: 8, name: '可乐', price: 8, category: '饮料', image: 'https://via.placeholder.com/150?text=可乐' },
    { id: 9, name: '雪碧', price: 8, category: '饮料', image: 'https://via.placeholder.com/150?text=雪碧' },
];
let currentCategory = 'all';
let isSubmitting = false;

// ============================================
// 页面初始化
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成');
    loadDishes();
    setupCategoryButtons();
    
    // 回车键提交桌号
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                enterMenu();
            }
        });
    }
});

// ============================================
// 座位号相关
// ============================================
function setQuickTable(tableNum) {
    document.getElementById('tableNumber').value = tableNum;
}

function enterMenu() {
    const tableNum = document.getElementById('tableNumber').value.trim();
    if (!tableNum) {
        alert('请输入桌号');
        return;
    }
    currentTable = tableNum;
    currentOrderNumber = generateOrderNumber();
    
    document.getElementById('currentTableDisplay').textContent = currentTable;
    switchPage('seatPage', 'menuPage');
}

function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}${hour}${minute}${second}${random}`;
}

function backToSeat() {
    if (cart.length > 0) {
        if (!confirm('返回将清空购物车，确定要返回吗？')) {
            return;
        }
        cart = [];
        updateCartUI();
    }
    switchPage('menuPage', 'seatPage');
    document.getElementById('tableNumber').value = '';
}

// ============================================
// 菜品相关
// ============================================
function loadDishes() {
    const container = document.getElementById('dishesContainer');
    if (!container) return;
    
    const filteredDishes = currentCategory === 'all' 
        ? dishes 
        : dishes.filter(d => d.category === currentCategory);
    
    container.innerHTML = filteredDishes.map(dish => {
        const cartItem = cart.find(item => item.id === dish.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        return `
            <div class="dish-card">
                <img src="${dish.image}" alt="${dish.name}" class="dish-image">
                <div class="dish-info">
                    <div class="dish-name">${dish.name}</div>
                    <div class="dish-price">¥${dish.price}</div>
                    <div class="dish-actions">
                        <button onclick="removeDish(${dish.id})" ${quantity === 0 ? 'style="opacity:0.3"' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="dish-quantity">${quantity}</span>
                        <button onclick="addDish(${dish.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            loadDishes();
        });
    });
}

function addDish(dishId) {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;
    
    const cartItem = cart.find(item => item.id === dishId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...dish, quantity: 1 });
    }
    
    updateCartUI();
    loadDishes();
}

function removeDish(dishId) {
    const cartItem = cart.find(item => item.id === dishId);
    if (!cartItem) return;
    
    if (cartItem.quantity > 1) {
        cartItem.quantity--;
    } else {
        cart = cart.filter(item => item.id !== dishId);
    }
    
    updateCartUI();
    loadDishes();
}

// ============================================
// 购物车相关
// ============================================
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 更新徽章
    document.getElementById('cartBadge').textContent = totalItems;
    
    // 更新购物车摘要
    const cartSummary = document.getElementById('cartSummary');
    if (cartSummary) {
        cartSummary.textContent = totalItems > 0 
            ? `已选 ${totalItems} 个菜品` 
            : '未选择菜品';
    }
    
    // 更新底部预览
    document.getElementById('totalItems').textContent = `${totalItems}个菜品`;
    document.getElementById('previewTotal').textContent = totalPrice.toFixed(2);
    
    // 更新购物车总计
    document.getElementById('cartTotal').textContent = totalPrice.toFixed(2);
    
    // 更新结算按钮状态
    const checkoutBtnMain = document.getElementById('checkoutBtnMain');
    const checkoutBtnModal = document.getElementById('checkoutBtnModal');
    if (checkoutBtnMain) checkoutBtnMain.disabled = totalItems === 0;
    if (checkoutBtnModal) checkoutBtnModal.disabled = totalItems === 0;
    
    // 更新购物车弹窗内容
    updateCartModal();
}
function updateCartModal() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>购物车是空的</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">¥${item.price} × ${item.quantity}</div>
            </div>
            <div class="item-actions">
                <button onclick="removeDish(${item.id})">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button onclick="addDish(${item.id})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}
function showCart() {
    document.getElementById('cartModal').classList.add('active');
}
function hideCart() {
    document.getElementById('cartModal').classList.remove('active');
}
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('确定要清空购物车吗？')) {
        cart = [];
        updateCartUI();
        loadDishes();
    }
}
// ============================================
// 结账相关
// ============================================
function goToCheckout() {
    if (cart.length === 0) {
        alert('请先选择菜品');
        return;
    }
    
    hideCart();
    
    // 填充订单信息
    document.getElementById('orderTable').textContent = currentTable;
    document.getElementById('orderNumber').textContent = currentOrderNumber;
    document.getElementById('orderTime').textContent = new Date().toLocaleString('zh-CN');
    
    // 填充订单明细
    const orderItemsList = document.getElementById('orderItemsList');
    if (orderItemsList) {
        orderItemsList.innerHTML = cart.map(item => `
            <div class="order-item-row">
                <span>${item.name} × ${item.quantity}</span>
                <span>¥${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    // 计算总价
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('finalAmount').textContent = totalAmount.toFixed(2);
    document.getElementById('qrcodeAmount').textContent = totalAmount.toFixed(2);
    
    switchPage('menuPage', 'checkoutPage');
}
function backToMenu() {
    switchPage('checkoutPage', 'menuPage');
}
// ============================================
// 订单提交到GitHub (修复版)
// ============================================
async function submitOrder() {
    if (isSubmitting) return;
    
    if (cart.length === 0) {
        alert('订单中没有菜品');
        return;
    }
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderTime = new Date().toLocaleString('zh-CN');
    // 将菜品数组转为字符串
    const dishesString = cart.map(item => 
        `${item.name} × ${item.quantity} = ¥${(item.price * item.quantity).toFixed(2)}`
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
            totalAmount: totalAmount.toFixed(2),
            status: '新订单',
            orderTime: orderTime,
            paymentTime: orderTime,
            timestamp: new Date().getTime()
        };
        console.log('订单数据:', orderData);
        // 1. 保存到本地
        saveOrderToLocal(orderData);
        // 2. 提交到GitHub
        try {
            await submitOrderToGitHub(orderData);
            console.log('✅ GitHub提交成功');
        } catch (githubError) {
            console.error('❌ GitHub提交失败:', githubError);
            // 继续执行，不阻止用户
        }
        // 3. 显示成功页面
        showSuccessPage();
        cart = [];
        updateCartUI();
    } catch (error) {
        console.error('提交订单出错:', error);
        alert('订单提交失败: ' + error.message + '\n已保存到本地，请联系商家。');
    } finally {
        isSubmitting = false;
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }
}
// ============================================
// 提交订单到GitHub (核心函数)
// ============================================
async function submitOrderToGitHub(orderData) {
    try {
        console.log('开始提交订单到GitHub...', orderData);
        
        // 第一步: 获取当前的 orders.json 文件
        let currentOrders = [];
        let currentSha = null;
        
        try {
            const getResponse = await fetch(
                `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/orders.json`,
                {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );
            
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                currentSha = fileData.sha;
                // 解码 base64 内容
                const content = atob(fileData.content);
                currentOrders = JSON.parse(content);
                console.log('当前订单数:', currentOrders.length);
            } else if (getResponse.status === 404) {
                console.log('orders.json 不存在，将创建新文件');
            } else {
                throw new Error(`获取文件失败: ${getResponse.status}`);
            }
        } catch (e) {
            console.log('获取现有订单时出错:', e.message);
        }
        
        // 第二步: 添加新订单
        currentOrders.push(orderData);
        
        // 只保留最近100个订单
        if (currentOrders.length > 100) {
            currentOrders = currentOrders.slice(-100);
        }
        
        // 第三步: 更新文件
        const content = JSON.stringify(currentOrders, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        const updateData = {
            message: `新订单: ${orderData.orderNumber} - 桌号${orderData.table}`,
            content: encodedContent,
            branch: 'main'
        };
        
        if (currentSha) {
            updateData.sha = currentSha;
        }
        
        const updateResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/orders.json`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            }
        );
        
        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`GitHub API 错误 (${updateResponse.status}): ${errorText}`);
        }
        
        const result = await updateResponse.json();
        console.log('订单提交成功!', result);
        return { success: true, message: '订单已提交到GitHub' };
        
    } catch (error) {
        console.error('提交到GitHub失败:', error);
        throw error;
    }
}
// ============================================
// 保存订单到本地
// ============================================
function saveOrderToLocal(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('local_orders') || '[]');
        orders.push(orderData);
        // 只保留最近50个订单
        if (orders.length > 50) {
            orders = orders.slice(-50);
        }
        localStorage.setItem('local_orders', JSON.stringify(orders));
        console.log('订单已保存到本地:', orderData);
    } catch (error) {
        console.error('保存到本地失败:', error);
    }
}
// ============================================
// 成功页面
// ============================================
function showSuccessPage() {
    document.getElementById('successOrderNumber').textContent = currentOrderNumber;
    document.getElementById('successTable').textContent = currentTable;
    switchPage('checkoutPage', 'successPage');
}
function newOrder() {
    currentTable = '';
    currentOrderNumber = '';
    cart = [];
    updateCartUI();
    switchPage('successPage', 'seatPage');
    document.getElementById('tableNumber').value = '';
}
// ============================================
// 页面切换
// ============================================
function switchPage(fromPage, toPage) {
    document.getElementById(fromPage).classList.remove('active');
    document.getElementById(toPage).classList.add('active');
}