// ============================================
// 配置区域 - 替换为你的GitHub信息
// ============================================
const GITHUB_USERNAME = 'guocuicui1990';  // 例如：zhangsan
const GITHUB_REPO = 'my-stall-order';           // 例如：restaurant-order
const GITHUB_TOKEN = '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';   // GitHub个人访问令牌

// ============================================
// 订单提交函数（修改）
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

// ============================================
// 提交订单到GitHub
// ============================================
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

// ============================================
// 通过Webhook提交订单（简单方式）
// ============================================
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

// ============================================
// 保存订单到本地
// ============================================
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
