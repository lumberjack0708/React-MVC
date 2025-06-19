/* global Qs */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Space, Typography, Modal, Form, Popconfirm, Tag, Pagination } from 'antd';
import { getApiUrl, API_CONFIG } from '../../config';
import { getProductImage } from '../../assets/images'; // 匯入獲取圖片的函數
import ProductForm from '../../components/ProductForm'; // 匯入表單組件
import Request from '../../utils/Request';
import { useNotification } from '../../components/Notification'; // 匯入自定義通知系統
// 移除未使用的圖示匯入

const { Title } = Typography;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // 用於判斷是新增還是編輯
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [form] = Form.useForm();
  const { notify } = useNotification(); // 使用自定義通知系統

  // 計算當前頁要顯示的資料
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, pageSize]);

  // 獲取商品列表
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const url = getApiUrl('getAllProducts');
    try {
      const response = await Request().get(url);
      setProducts(response.data.result);
      setCurrentPage(1); // 重置到第一頁
    } catch (error) {
      notify.error('請求錯誤', '無法連接到伺服器，請檢查您的網路連線。');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  // 在組件首次渲染時獲取數據
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = () => {
    setEditingProduct(null); // 清除編輯狀態
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      price: parseInt(record.price, 10), // 確保價格是數字
      p_status: record.p_status || 'active', // 確保狀態欄位有值
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let url;
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'image') {
          // 只處理有上傳檔案的情況
          if (values.image && values.image[0] && values.image[0].originFileObj) {
            formData.append('image', values.image[0].originFileObj);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      
      if (editingProduct) {
        url = getApiUrl('updateProduct');
        formData.append('pid', editingProduct.product_id);
      } else {
        url = getApiUrl('newProduct');
      }

      // 注意：使用 Request() 時，headers 已經預設，但上傳檔案需要 'multipart/form-data'
      // 瀏覽器會自動處理 FormData 的 Content-Type，所以我們這裡不需要特別設定
      const response = await Request().post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      if (response.data.status === 200) {
        notify.success('操作成功', `商品${editingProduct ? '更新' : '新增'}成功`);
        handleCancel();
        fetchProducts();
      } else {
        notify.error(
          editingProduct ? '更新失敗' : '新增失敗', 
          response.data.message || '操作失敗，請稍後再試。'
        );
      }
    } catch (error) {
      notify.error('請求錯誤', '無法連接到伺服器，請檢查您的網路連線。');
    }
  };

  const handleDelete = async (productId) => {
    const url = getApiUrl('removeProduct');
    const data = { pid: productId };
    try {
      const response = await Request().post(url, Qs.stringify(data));
      if (response.data.status === 200) {
        notify.success('刪除成功', '商品已成功刪除');
        fetchProducts();
      } else {
        // 根據不同的錯誤狀態碼顯示不同類型的通知
        if (response.data.status === 409) {
          notify.warning('無法刪除商品', response.data.message || '該商品已被訂單引用，無法刪除');
        } else if (response.data.status === 404) {
          notify.error('商品不存在', response.data.message || '找不到要刪除的商品');
        } else {
          notify.error('刪除失敗', response.data.message || '無法刪除商品，請稍後再試。');
        }
      }
    } catch (error) {
      notify.error('請求錯誤', '無法連接到伺服器，請檢查您的網路連線。');
    }
  };

  const columns = [
    {
      title: '商品圖片',
      dataIndex: 'name',
      key: 'image',
      render: (name, record) => {
        const imageUrl = record.image_url 
          ? `${API_CONFIG.assetBaseURL}public/${record.image_url}`
          : getProductImage(record.category, name);
        return <img src={imageUrl} alt={name} style={{ width: 50, height: 50, objectFit: 'cover' }} />;
      },
    },
    {
      title: '商品名稱',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '價格',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `NT$ ${parseInt(text, 10)}`, // 確保價格是整數
    },
    {
      title: '庫存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '商品狀態',
      dataIndex: 'p_status',
      key: 'p_status',
      width: '10%',
      render: (status) => {
        const color = status === 'active' ? 'green' : 'red';
        const text = status === 'active' ? '上架' : '下架';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>編輯</Button>
          <Popconfirm
            title="確定要刪除這個商品嗎？"
            onConfirm={() => handleDelete(record.product_id)}
            okText="確定"
            cancelText="取消"
          >
            <Button type="primary" danger>刪除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between', flexShrink: 0 }}>
        <Title level={2} style={{ margin: 0 }}>商品管理</Title>
        <Button type="primary" onClick={handleAdd}>
          新增商品
        </Button>
      </Space>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Table 
            columns={columns} 
            dataSource={paginatedProducts} 
            rowKey="product_id" // 使用資料庫中的主鍵 'product_id'
            loading={loading}
            pagination={false} // 禁用表格自帶的分頁器
            size="middle"
            scroll={{ y: 'calc(100vh - 300px)' }} // 設定表格高度
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
            total={products.length}
            showSizeChanger
            pageSizeOptions={['5', '10', '20']}
            showTotal={(total, range) => `第 ${range[0]}-${range[1]} 筆，共 ${total} 筆商品`}
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
        title={editingProduct ? '編輯商品' : '新增商品'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
        destroyOnClose
      >
        <ProductForm form={form} initialValues={editingProduct} />
      </Modal>
    </div>
  );
};

export default ProductManagement; 