/* global axios, Qs */
import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Typography, notification, Select, Button, Modal } from 'antd';
import { getApiUrl } from '../../config';

const { Title } = Typography;
const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = getApiUrl('getOrders');
      const response = await axios.get(url);
      if (response.data.status === 200) {
        setOrders(response.data.result);
      } else {
        notification.error({
          message: '讀取失敗',
          description: response.data.message || '無法獲取訂單列表，請稍後再試。',
        });
      }
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
    fetchOrders();
  }, []);

  const handleViewDetails = async (orderId) => {
    setDetailLoading(true);
    setIsDetailModalVisible(true);
    try {
      const url = getApiUrl('getOrderDetail');
      const data = Qs.stringify({ order_id: orderId });
      const response = await axios.post(url, data);

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
    // 如果是要取消訂單，先顯示確認對話框
    if (newStatus === 'cancelled') {
      Modal.confirm({
        title: '確認取消訂單',
        content: `您確定要取消訂單 #${orderId} 嗎？此操作無法復原。`,
        okText: '確認取消',
        cancelText: '保持原狀',
        okType: 'danger',
        onOk: () => updateOrderStatus(orderId, newStatus),
      });
      return;
    }
    
    // 其他狀態直接更新
    updateOrderStatus(orderId, newStatus);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true);
    try {
      const url = getApiUrl('updateOrderStatus');
      const data = Qs.stringify({ order_id: orderId, status: newStatus });
      const response = await axios.post(url, data);

      if (response.data.status === 200) {
        notification.success({
          message: '更新成功',
          description: `訂單 #${orderId} 的狀態已更新為 ${newStatus}。`,
        });
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
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
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
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="cancelled">Cancelled</Option>
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