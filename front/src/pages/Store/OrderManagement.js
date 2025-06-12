/* global Qs */
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Typography, notification, Select, Button, Modal, message } from 'antd';
import { getApiUrl, API_CONFIG } from '../../config';
import Request from '../../utils/Request';
import { getToken } from '../../utils/auth';

const { Title } = Typography;
const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const url = getApiUrl('getOrders');
    try {
      const response = await Request().get(url);
      setOrders(response.data.result || []);
    } catch (error) {
      notification.error({
        message: '請求錯誤',
        description: '無法連接到伺服器，請檢查您的網路連線。',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 獲取當前用戶資訊並載入訂單
    const initializeData = async () => {
      const token = getToken();
      if (!token) {
        notification.error({
          message: '認證錯誤',
          description: '請先登入以使用管理功能。',
        });
        return;
      }

      try {
        // 通過 API 根路由獲取用戶資訊（參考 App.js 的做法）
        const res = await Request().get(API_CONFIG.baseURL);
        const response = res.data;
        
        if (response.status === 200 && response.user) {
          setCurrentUser(response.user);
          // 用戶資訊獲取成功後載入訂單
          fetchOrders();
        } else {
          throw new Error('無法獲取用戶資訊');
        }
      } catch (error) {
        console.error('獲取用戶資訊失敗:', error);
        notification.error({
          message: '認證錯誤',
          description: '無法驗證用戶身份，請重新登入。',
        });
      }
    };

    initializeData();
  }, []);

  const handleViewDetails = async (orderId) => {
    setDetailLoading(true);
    setIsDetailModalVisible(true);
    try {
      const url = getApiUrl('getOrderDetail');
      const data = Qs.stringify({ order_id: orderId });
      const response = await Request().post(url, data);

      if (response.data.status === 200) {
        setCurrentOrderDetails(response.data.result);
      } else {
        notification.error({
          message: '讀取詳情失敗',
          description: response.data.message,
        });
        setIsDetailModalVisible(false);
      }
    } catch (error) {
      notification.error({ message: '請求錯誤', description: '無法獲取訂單詳情。'});
      setIsDetailModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // 如果是要取消訂單，使用正確的取消訂單API
    if (newStatus === 'cancelled') {
      Modal.confirm({
        title: '確認取消訂單',
        content: `您確定要取消訂單 #${orderId} 嗎？此操作無法復原，商品庫存將會自動回滾。`,
        okText: '確認取消',
        cancelText: '保持原狀',
        okType: 'danger',
        onOk: () => handleCancelOrder(orderId),
      });
      return;
    }
    
    // 其他狀態直接更新
    updateOrderStatus(orderId, newStatus);
  };

  // 新增：正確的取消訂單功能（包含庫存回滾）
  const handleCancelOrder = async (orderId) => {
    // 添加調試資訊
    console.log('當前用戶資訊:', currentUser);
    console.log('用戶角色:', currentUser?.role_id);
    console.log('用戶ID:', currentUser?.account_id);
    
    if (!currentUser || !currentUser.account_id) {
      notification.error({
        message: '認證錯誤',
        description: '無法獲取用戶身份，請重新登入。',
      });
      return;
    }

    setLoading(true);
    const url = getApiUrl('removeOrder');
    const data = {
      order_id: orderId,
      account_id: currentUser.account_id // 使用當前登入用戶的ID
    };

    console.log('發送的資料:', data);

    try {
      const response = await Request().post(url, Qs.stringify(data));
      console.log('後端響應:', response.data);
      
      if (response.data.status === 200) {
        message.success(`訂單 #${orderId} 已成功取消，庫存已回滾`);
        fetchOrders(); // 重新載入訂單
      } else {
        notification.error({
          message: '取消失敗',
          description: response.data.message || '無法取消訂單。',
        });
      }
    } catch (error) {
      console.error('取消訂單錯誤:', error);
      notification.error({
        message: '請求錯誤',
        description: '無法連接到伺服器。',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    const url = getApiUrl('updateOrderStatus');
    const data = {
      order_id: orderId,
      status: newStatus,
    };

    try {
      const response = await Request().post(url, Qs.stringify(data));
      if (response.data.status === 200) {
        message.success(`訂單 #${orderId} 狀態已更新為 ${newStatus}`);
        fetchOrders(); // 重新載入訂單
      } else {
        notification.error({
          message: '更新失敗',
          description: response.data.message || '無法更新訂單狀態。',
        });
      }
    } catch (error) {
      notification.error({
        message: '請求錯誤',
        description: '無法連接到伺服器。',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'gold';
      case 'processing': return 'processing';
      case 'shipped': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    { title: '訂單編號', dataIndex: '訂單編號', key: 'id' },
    { title: '顧客Email', dataIndex: '用戶email', key: 'email' },
    { 
      title: '訂單總金額', 
      dataIndex: '訂單總金額', 
      key: 'amount',
      render: (amount) => `NT$ ${parseInt(amount, 10)}`
    },
    { 
      title: '訂單時間', 
      dataIndex: '訂單時間', 
      key: 'time',
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '訂單狀態',
      dataIndex: '訂單狀態',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'pending': '待處理',
          'processing': '處理中', 
          'shipped': '已出貨',
          'cancelled': '已取消'
        };
        return (
          <Tag color={getStatusColor(status)}>
            {statusMap[status] || status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Select
            defaultValue={record['訂單狀態']}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record['訂單編號'], value)}
            disabled={['shipped', 'cancelled'].includes(record['訂單狀態'])}
          >
            <Option value="pending">待處理</Option>
            <Option value="processing">處理中</Option>
            <Option value="shipped">已出貨</Option>
            <Option value="cancelled">已取消</Option>
          </Select>
          <Button onClick={() => handleViewDetails(record['訂單編號'])}>查看詳情</Button>
        </Space>
      ),
    },
  ];

  const detailColumns = [
    { title: '產品名稱', dataIndex: '產品名稱', key: 'name' },
    { title: '訂購數量', dataIndex: '訂購數量', key: 'quantity' },
    { title: '單價', dataIndex: '單價', key: 'price', render: (price) => `NT$ ${parseInt(price, 10)}` },
    { title: '小計', dataIndex: '小計', key: 'subtotal', render: (sub) => `NT$ ${parseInt(sub, 10)}` },
  ];

  return (
    <div>
      <Title level={2}>訂單管理</Title>
      <Table 
        columns={columns} 
        dataSource={orders} 
        rowKey="訂單編號" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={`訂單 #${currentOrderDetails[0]?.['訂單編號']} 詳細內容`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsDetailModalVisible(false)}>
            關閉
          </Button>,
        ]}
        width={700}
        destroyOnClose
      >
        <Table
          columns={detailColumns}
          dataSource={currentOrderDetails}
          rowKey={(r) => `${r['訂單編號']}-${r['產品名稱']}`}
          loading={detailLoading}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default OrderManagement; 