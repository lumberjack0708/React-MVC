/* global Qs */
import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Tag, Space, Spin, Empty, Statistic, Row, Col, Button, Modal, Descriptions, Popconfirm, message, Result } from 'antd';
import { ShoppingOutlined, CalendarOutlined, DollarOutlined, EyeOutlined, ShoppingCartOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getApiUrl } from '../config';
import { useNotification } from '../components/Notification';
import { Container, Heading } from '../styles/styles';
import { LoadingContainer, LoadingTitle, ErrorContainer, StatisticRowStyle, SmallTextStyle, ModalLoadingContainer, LoadingDetailText } from '../styles/pageStyles';
import Request from '../utils/Request';
import { getToken, removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../utils/tokenManager';

const { Title, Text } = Typography;

function PurchaseHistoryPage({ user }) {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const token = getToken();

  // 狀態管理
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState({
    total_orders: 0,
    cancelled_orders: 0,
    total_amount: 0,
    total_items: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (tokenManager.getExpiredStatus()) {
      if (!tokenManager.hasNotified) {
        notify.error('登入過期', '您的登入權限已過期，請重新登入');
        tokenManager.hasNotified = true;
      }
      return;
    }

    // 如果沒有用戶資訊或 token，不進行資料請求
    if (!token || !user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersResponse, statsResponse] = await Promise.all([
          Request().post(getApiUrl('getOrder'), Qs.stringify({ account_id: user.account_id })),
          Request().post(getApiUrl('getOrderStatistics'), Qs.stringify({ account_id: user.account_id }))
        ]);
        
        if (ordersResponse.data.status === 200) {
          setOrders(ordersResponse.data.result || []);
        } else {
          throw new Error(ordersResponse.data.message || '無法獲取購買紀錄');
        }
        
        if (statsResponse.data.status === 200) {
          setStatistics(statsResponse.data.result);
        } else {
          console.warn('無法獲取統計數據:', statsResponse.data.message);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || '載入購買紀錄時發生未知錯誤';
        setError(errorMessage);
        notify.error('載入失敗', errorMessage);
        console.error("載入購買紀錄失敗:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [notify, token, user]);
  
  // 查看訂單詳情
  const handleViewOrderDetail = async (orderId) => {
    setDetailLoading(true);
    setIsDetailModalVisible(true);
    try {
      const response = await Request().post(
        getApiUrl('getOrderDetail'), 
        Qs.stringify({ order_id: orderId })
      );
      
      if (response.data && response.data.status === 200) {
        setSelectedOrder(response.data.result || []);
      } else {
        throw new Error(response.data.message || '無法獲取訂單詳情');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || '獲取訂單詳情失敗';
      notify.error('獲取詳情失敗', errorMessage);
      console.error("獲取訂單詳情失敗:", err);
      setIsDetailModalVisible(false);
    } finally {
      setDetailLoading(false);
    }
  };
  
  // 關閉詳情模態框
  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedOrder(null);
  };
  
  // 取消訂單
  const handleCancelOrder = async (orderId) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await Request().post(
        getApiUrl('removeOrder'),
        Qs.stringify({
          order_id: orderId,
          account_id: user.account_id
        })
      );
      
      if (response.data.status === 200) {
        message.success(response.data.message || '訂單已成功取消');
        // 重新獲取數據
        const [ordersResponse, statsResponse] = await Promise.all([
          Request().post(getApiUrl('getOrder'), Qs.stringify({ account_id: user.account_id })),
          Request().post(getApiUrl('getOrderStatistics'), Qs.stringify({ account_id: user.account_id }))
        ]);
        
        setOrders(ordersResponse.data.result || []);
        setStatistics(statsResponse.data.result || {});
      } else {
        message.error(response.data.message || '取消訂單失敗');
      }
    } catch (error) {
      message.error('網路錯誤，無法取消訂單');
    } finally {
      setLoading(false);
    }
  };
  
  // 判斷訂單是否可以取消(待處理、處理中才可以取消)
  const canCancelOrder = (status) => {
    return status === 'pending' || status === 'processing';
  };
  
  // 訂單狀態顏色
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'gold';
      case 'processing': return 'processing';
      case 'shipped': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };
  
  // 訂單狀態中文映射
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '待處理';
      case 'processing': return '處理中';
      case 'shipped': return '已出貨';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };
  
  // 表格欄位定義
  const columns = [
    {
      title: '訂單編號',
      dataIndex: '訂單編號',
      key: 'orderId',
      render: (text) => <Text strong>#{text}</Text>
          },
      {
        title: '訂單總金額',
        dataIndex: '訂單總金額',
        key: 'totalAmount',
        align: 'right',
        render: (text) => <Text strong>NT$ {parseInt(text, 10)}</Text>
      },
      {
        title: '商品種類數量',
        dataIndex: '商品種類數量',
        key: 'itemCount',
        align: 'center',
        render: (text) => <Tag color="blue">{text} 種商品</Tag>
      },
    {
      title: '訂單時間',
      dataIndex: '訂單時間',
      key: 'orderTime',
      render: (text) => new Date(text).toLocaleString('zh-TW')
    },
    {
      title: '訂單狀態',
      dataIndex: '訂單狀態',
      key: 'status',
      align: 'center',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrderDetail(record['訂單編號'])}
          >
            查看詳情
          </Button>
          {canCancelOrder(record['訂單狀態']) && (
            <Popconfirm
              title="確定要取消這個訂單嗎？"
              description="取消後將無法恢復，商品庫存會自動回滾。"
              onConfirm={() => handleCancelOrder(record['訂單編號'])}
              okText="確定取消"
              cancelText="保留訂單"
              okType="danger"
            >
              <Button 
                type="primary" 
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                取消訂單
              </Button>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];
  
  // 詳情模態框的表格欄位
  const detailColumns = [
    {
      title: '產品名稱',
      dataIndex: '產品名稱',
      key: 'productName'
    },
    {
      title: '訂購數量',
      dataIndex: '訂購數量',
      key: 'quantity',
      align: 'center',
      render: (text) => `${text} 件`
    },
    {
      title: '單價',
      dataIndex: '單價',
      key: 'price',
      align: 'right',
      render: (text) => `NT$ ${parseInt(text, 10)}`
    },
    {
      title: '小計',
      dataIndex: '小計',
      key: 'subtotal',
      align: 'right',
      render: (text) => `NT$ ${parseInt(text, 10)}`
    }
  ];

  // Token過期時顯示警告頁面
  if (tokenManager.getExpiredStatus()) {
    return (
      <Container>
        <Card>
          <Result
            status="403"
            title="登入權限已過期"
            subTitle="您的Token已過期，請重新登入以繼續使用。"
            icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
            extra={[
              <Button type="primary" key="login" onClick={() => {
                tokenManager.reset();
                navigate('/');
              }}>
                重新登入
              </Button>
            ]}
          />
        </Card>
      </Container>
    );
  }

  // 未登入時顯示提示頁
  if (!token || !user) {
    return (
      <Container>
        <Card>
          <Result
            status="warning"
            title="尚未登入"
            subTitle="您沒有權限查看購物紀錄，請先登入。"
            extra={<Button type="primary" onClick={() => navigate('/')}>返回首頁</Button>}
          />
        </Card>
      </Container>
    );
  }
  
  // 載入中狀態
  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
        <LoadingTitle>
          載入購買紀錄中...
        </LoadingTitle>
      </LoadingContainer>
    );
  }
  
  // 錯誤狀態
  if (error && orders.length === 0) {
    return (
      <ErrorContainer>
        <Typography.Title level={3} type="danger">
          載入購買紀錄時發生錯誤: {error}
        </Typography.Title>
      </ErrorContainer>
    );
  }
  
  return (
    <Container>
      <Heading>購買紀錄查詢</Heading>
      
      {/* 統計卡片 */}
      <Row gutter={[16, 16]} style={StatisticRowStyle}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="總訂單數"
              value={statistics.total_orders}
              prefix={<ShoppingOutlined />}
              suffix="筆"
              valueStyle={{ color: '#1890ff' }}
            />
            {statistics.cancelled_orders > 0 && (
              <Text type="secondary" style={SmallTextStyle}>
                (含 {statistics.cancelled_orders} 筆已取消)
              </Text>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="實際購買金額"
              value={statistics.total_amount}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={SmallTextStyle}>
              (排除已取消訂單)
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="購買商品種類"
              value={statistics.total_items}
              prefix={<ShoppingCartOutlined />}
              suffix="種"
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={SmallTextStyle}>
              (排除已取消訂單)
            </Text>
          </Card>
        </Col>
      </Row>
      
      {/* 訂單列表 */}
      <Card title={
        <Space>
          <CalendarOutlined />
          <Text strong>購買紀錄列表</Text>
        </Space>
      }>
        {orders.length === 0 ? (
          <Empty 
            description="暫無購買紀錄"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="訂單編號"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range[0]}-${range[1]} 筆，共 ${total} 筆記錄`
            }}
            scroll={{ x: 800 }}
          />
        )}
      </Card>
      
      {/* 訂單詳情模態框 */}
      <Modal
        title={
          selectedOrder && selectedOrder.length > 0 ? 
            `訂單 #${selectedOrder[0]['訂單編號']} 詳細內容` : 
            '訂單詳情'
        }
        open={isDetailModalVisible}
        onCancel={handleCloseDetailModal}
        footer={[
          <Button key="close" onClick={handleCloseDetailModal}>
            關閉
          </Button>,
          selectedOrder && selectedOrder.length > 0 && canCancelOrder(selectedOrder[0]['訂單狀態']) && (
            <Popconfirm
              key="cancel"
              title="確定要取消這個訂單嗎？"
              description="取消後將無法恢復，商品庫存會自動回滾。"
              onConfirm={() => {
                handleCancelOrder(selectedOrder[0]['訂單編號']);
                handleCloseDetailModal();
              }}
              okText="確定取消"
              cancelText="保留訂單"
              okType="danger"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                取消訂單
              </Button>
            </Popconfirm>
          )
        ]}
        width={800}
        destroyOnClose
      >
        {detailLoading ? (
          <ModalLoadingContainer>
            <Spin size="large" />
            <LoadingDetailText>載入訂單詳情中...</LoadingDetailText>
          </ModalLoadingContainer>
        ) : selectedOrder && selectedOrder.length > 0 ? (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 訂單基本資訊 */}
            <Descriptions title="訂單資訊" bordered column={2}>
              <Descriptions.Item label="訂單編號">
                #{selectedOrder[0]['訂單編號']}
              </Descriptions.Item>
              <Descriptions.Item label="訂單時間">
                {new Date(selectedOrder[0]['訂單時間']).toLocaleString('zh-TW')}
              </Descriptions.Item>
              <Descriptions.Item label="訂單狀態">
                <Tag color={getStatusColor(selectedOrder[0]['訂單狀態'])}>
                  {getStatusText(selectedOrder[0]['訂單狀態'])}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="商品總數">
                {selectedOrder.length} 種商品
              </Descriptions.Item>
            </Descriptions>
            
            {/* 訂單商品列表 */}
            <div>
              <Title level={4}>商品明細</Title>
              <Table
                columns={detailColumns}
                dataSource={selectedOrder}
                rowKey={(record, index) => `detail-${index}`}
                pagination={false}
                summary={(pageData) => {
                  const total = pageData.reduce((sum, record) => 
                    sum + parseInt(record['小計'], 10), 0
                  );
                  return (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <Text strong>總計</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong>NT$ {total}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
              />
            </div>
          </Space>
        ) : (
          <Empty description="無法載入訂單詳情" />
        )}
      </Modal>
    </Container>
  );
}

export default PurchaseHistoryPage; 