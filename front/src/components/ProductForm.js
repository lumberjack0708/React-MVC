import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { API_CONFIG } from '../config';

const { Option } = Select;

const ProductForm = ({ form, initialValues }) => {
  useEffect(() => {
    // 當 initialValues 更新時，重設表單欄位
    // 從編輯模式切換到新增模式時，initialValues 會變成 null
    if (initialValues) {
      form.setFieldsValue({
        p_name: initialValues.name,
        price: parseInt(initialValues.price, 10),
        stock: initialValues.stock,
        category: initialValues.category,
        p_status: initialValues.p_status || 'active',
        image: initialValues.image_url ? [{
          uid: '-1',
          name: initialValues.image_url.split('/').pop(),
          status: 'done',
          url: `${API_CONFIG.assetBaseURL}public/${initialValues.image_url}`,
        }] : [],
      });
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form form={form} layout="vertical" name="product_form">
      <Form.Item
        name="p_name"
        label="商品名稱"
        rules={[{ required: true, message: '請輸入商品名稱！' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="價格"
        rules={[{ required: true, message: '請輸入商品價格！' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="stock"
        label="庫存"
        rules={[{ required: true, message: '請輸入庫存數量！' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name="category"
        label="商品類別"
        rules={[{ required: true, message: '請選擇商品類別！' }]}
      >
        <Select placeholder="請選擇一個類別">
          <Option value="food">食品</Option>
          <Option value="toy">玩具</Option>
          <Option value="accessories">配件</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="p_status"
        label="商品狀態"
        rules={[{ required: true, message: '請選擇商品狀態！' }]}
        initialValue="active"
      >
        <Select placeholder="請選擇商品狀態">
          <Option value="active">上架</Option>
          <Option value="removed">下架</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="image"
        label="商品圖片"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="上傳新圖片會覆蓋舊圖片"
      >
        <Upload
          name="logo"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false} // 返回 false 來阻止自動上傳
        >
          <Button icon={<UploadOutlined />}>選擇檔案</Button>
        </Upload>
      </Form.Item>
    </Form>
  );
};

export default ProductForm; 