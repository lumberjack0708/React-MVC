/* global Qs */
import React, { useState, useEffect, useMemo } from 'react';
import { Table, Tag, Space, Typography, notification, Select, Button, Modal, message, Popconfirm, Tooltip, Pagination } from 'antd';
import { EyeOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // 計算當前頁要顯示的資料
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, pageSize]);

  const fetchOrders = async () => {
    setLoading(true);
    const url = getApiUrl('getOrders');
    try {
      const response = await Request().get(url);
      setOrders(response.data.result || []);
      setCurrentPage(1); // 重置到第一頁
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
    console.log('handleStatusChange 被調用:', { orderId, newStatus }); // 添加調試
    
    // 直接更新狀態，不再處理取消邏輯
    console.log('更新訂單狀態為:', newStatus); // 添加調試
    updateOrderStatus(orderId, newStatus);
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

  // 取消訂單功能（包含庫存回滾）
  const handleCancelOrder = async (orderId) => {
    console.log('handleCancelOrder 被調用:', orderId);
    console.log('當前用戶資訊:', currentUser);
    
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
      account_id: currentUser.account_id
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

  // 判斷訂單是否可以取消(待處理、處理中才可以取消)
  const canCancelOrder = (status) => {
    return status === 'pending' || status === 'processing';
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
    { 
      title: '訂單編號', 
      dataIndex: '訂單編號', 
      key: 'id',
      width: 100,
      render: (text) => <span style={{ fontWeight: 500 }}>#{text}</span>
    },
    { 
      title: '顧客Email', 
      dataIndex: '用戶email', 
      key: 'email',
      width: 200,
      ellipsis: true
    },
    { 
      title: '訂單總金額', 
      dataIndex: '訂單總金額', 
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount) => <span style={{ fontWeight: 500, color: '#52c41a' }}>NT$ {parseInt(amount, 10)}</span>
    },
    { 
      title: '訂單時間', 
      dataIndex: '訂單時間', 
      key: 'time',
      width: 160,
      render: (time) => new Date(time).toLocaleString('zh-TW')
    },
    {
      title: '訂單狀態',
      dataIndex: '訂單狀態',
      key: 'status',
      width: 100,
      align: 'center',
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
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Select
            value={record['訂單狀態']}
            style={{ width: 100 }}
            size="small"
            onChange={(value) => {
              console.log('Select onChange 觸發:', { orderId: record['訂單編號'], value });
              handleStatusChange(record['訂單編號'], value);
            }}
            disabled={['shipped', 'cancelled'].includes(record['訂單狀態'])}
          >
            <Option value="pending">待處理</Option>
            <Option value="processing">處理中</Option>
            <Option value="shipped">已出貨</Option>
          </Select>
          
          <Tooltip title="查看訂單詳情">
            <Button 
              type="default"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record['訂單編號'])}
            >
              詳情
            </Button>
          </Tooltip>
          
          {canCancelOrder(record['訂單狀態']) && (
            <Tooltip title="取消此訂單並回滾庫存">
              <Popconfirm
                title="確定要取消這個訂單嗎？"
                description="取消後將無法恢復，商品庫存會自動回滾。"
                onConfirm={() => handleCancelOrder(record['訂單編號'])}
                okText="確定取消"
                cancelText="保留訂單"
                okType="danger"
                icon={<CloseCircleOutlined style={{ color: 'red' }} />}
              >
                <Button 
                  type="text"
                  size="small"
                  danger
                  icon={<CloseCircleOutlined />}
                  style={{ 
                    borderRadius: '4px'
                  }}
                >
                  取消
                </Button>
              </Popconfirm>
            </Tooltip>
          )}
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Title level={2} style={{ margin: '0 0 16px 0', flexShrink: 0 }}>訂單管理</Title>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Table 
            columns={columns} 
            dataSource={paginatedOrders} 
            rowKey="訂單編號" 
            loading={loading}
            pagination={false} // 禁用表格自帶的分頁器
            scroll={{ x: 1000, y: 'calc(100vh - 300px)' }}
            size="middle"
          />
        </div>
        <div style={{ 
            padding: '16px 24px 16px 0', 
            borderTop: '1px solid #f0f0f0', 
            backgroundColor: '#fafafa',
            display: 'flex',
            justifyContent: 'flex-end',
            flexShrink: 0
        }}>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={orders.length}
          showSizeChanger
          pageSizeOptions={['5', '10', '20']}
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 筆，共 ${total} 筆訂單`}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          onShowSizeChange={(current, size) => {
            setCurrentPage(1);
            setPageSize(size);
          }}
          />
        </div>
      </div>
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