import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, notification, Modal, Form, Popconfirm } from 'antd';
import { getApiUrl, API_CONFIG } from '../../config';
import { getProductImage } from '../../assets/images'; // 匯入獲取圖片的函數
import ProductForm from '../../components/ProductForm'; // 匯入表單組件

const { Title } = Typography;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // 用於判斷是新增還是編輯
  const [form] = Form.useForm();

  // 獲取商品列表
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = getApiUrl('getProducts');
      const response = await window.axios.get(url); // 使用 window.axios
      if (response.data.status === 200) {
        setProducts(response.data.result);
      } else {
        notification.error({
          message: '讀取失敗',
          description: response.data.message || '無法獲取商品列表，請稍後再試。',
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

  // 在組件首次渲染時獲取數據
  useEffect(() => {
    fetchProducts();
  }, []);

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
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        const isEditing = !!editingProduct;
        const url = getApiUrl(isEditing ? 'updateProduct' : 'newProduct');
        
        // 使用 FormData 來處理包含檔案的上傳
        const formData = new FormData();
        formData.append('p_name', values.name);
        formData.append('price', values.price);
        formData.append('stock', values.stock);
        formData.append('category', values.category);

        if (isEditing) {
          formData.append('pid', editingProduct.product_id);
        }

        // 檢查是否有新的圖片檔案被上傳
        if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
          formData.append('image', values.image[0].originFileObj);
        }

        try {
          const response = await window.axios.post(url, formData);

          if (response.data.status === 200) {
            notification.success({
              message: isEditing ? '更新成功' : '新增成功',
              description: `商品「${values.name}」已成功${isEditing ? '更新' : '新增'}。`,
            });
            handleCancel();
            fetchProducts();
          } else {
            notification.error({
              message: isEditing ? '更新失敗' : '新增失敗',
              description: response.data.message || '操作失敗，請稍後再試。',
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
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        notification.error({
          message: '表單驗證失敗',
          description: '請檢查所有必填欄位是否已正確填寫。',
        });
      });
  };

  const handleDelete = async (productId) => {
    setLoading(true);
    try {
      const url = getApiUrl('removeProduct');
      const data = window.Qs.stringify({ pid: productId });
      const response = await window.axios.post(url, data);
      if (response.data.status === 200) {
        notification.success({
          message: '刪除成功',
          description: '商品已成功刪除。',
        });
        fetchProducts();
      } else {
        notification.error({
          message: '刪除失敗',
          description: response.data.message || '無法刪除商品，請稍後再試。',
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
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>商品管理</Title>
        <Button type="primary" onClick={handleAdd}>
          新增商品
        </Button>
      </Space>
      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="product_id" // 使用資料庫中的主鍵 'product_id'
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
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