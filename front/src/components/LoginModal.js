/* global Qs */
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Request from '../utils/Request';
import { setToken } from '../utils/auth';
import { getApiUrl } from '../config';

const LoginModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    const postData = {
      account_code: values.account,
      password: values.password,
    };

    try {
      const res = await Request().post(getApiUrl('doLogin'), Qs.stringify(postData));
      const response = res.data;

      if (response.status === 200) {
        message.success('登入成功！');
        setToken(response.token);
        onSuccess(response);
        form.resetFields();
        onCancel();
      } else {
        message.error(response.message || '登入失敗，請檢查您的帳號密碼');
      }
    } catch (error) {
      console.error('登入 API 呼叫失敗:', error);
      message.error('網路錯誤或伺服器無回應');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
          <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          會員登入
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={420}
      destroyOnClose
      centered
    >
      <Divider style={{ margin: '16px 0' }} />
      
      <Form
        form={form}
        name="login"
        onFinish={handleLogin}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="account"
          label="帳號"
          rules={[
            { required: true, message: '請輸入帳號！' }
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請輸入您的帳號"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密碼"
          rules={[
            { required: true, message: '請輸入密碼！' },
            { min: 6, message: '密碼長度至少6個字符！' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請輸入您的密碼"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: '8px', marginTop: '24px' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            style={{
              height: '44px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {loading ? '登入中...' : '立即登入'}
          </Button>
        </Form.Item>

        <div style={{ 
          textAlign: 'center', 
          color: '#8c8c8c', 
          fontSize: '12px',
          marginTop: '16px' 
        }}>
          測試帳號：ADM1 / jack800
        </div>
      </Form>
    </Modal>
  );
};

export default LoginModal; 