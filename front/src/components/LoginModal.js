/* global Qs */
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import Request from '../utils/Request';
import { setToken } from '../utils/auth';
import { getApiUrl } from '../config';
import { tokenManager } from '../utils/tokenManager';
import RegisterModal from './RegisterModal';
import { useNotification } from './Notification';

const LoginModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { notify } = useNotification();

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
        // 使用全域通知元件顯示歡迎訊息
        notify.success(
          '🎉 登入成功！',
          `歡迎回來，${response.user?.full_name || '會員'}！`
        );
        
        message.success('登入成功！');
        setToken(response.token);
        tokenManager.reset();
        onSuccess(response);
        form.resetFields();
        onCancel();
      } else {
        // 使用全域通知元件顯示錯誤訊息
        notify.error(
          '登入失敗',
          response.message || '請檢查您的帳號密碼是否正確'
        );
        message.error(response.message || '登入失敗，請檢查您的帳號密碼');
      }
    } catch (error) {
      console.error('登入 API 呼叫失敗:', error);
      
      // 使用全域通知元件顯示網路錯誤
      notify.error(
        '連線錯誤',
        '網路連線異常或伺服器暫時無法回應，請檢查網路連線後重試。'
      );
      message.error('網路錯誤或伺服器無回應');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleRegisterSuccess = (response) => {
    setShowRegister(false);
    // 自動填入新註冊的帳號到登入表單
    if (response.account_code) {
      form.setFieldsValue({ account: response.account_code });
      // 聚焦到密碼欄位，方便用戶直接輸入密碼登入
      setTimeout(() => {
        const passwordInput = document.querySelector('input[type="password"]');
        if (passwordInput) {
          passwordInput.focus();
        }
      }, 100);
    }
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

        <Divider style={{ margin: '16px 0', fontSize: '12px', color: '#8c8c8c' }}>
          或
        </Divider>

        <Button
          block
          size="large"
          icon={<UserAddOutlined />}
          onClick={handleShowRegister}
          style={{
            height: '44px',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '16px'
          }}
        >
          立即註冊
        </Button>

        <div style={{ 
          textAlign: 'center', 
          color: '#8c8c8c', 
          fontSize: '12px',
          marginTop: '16px' 
        }}>
          測試帳號：ADM1 / jack800
        </div>
      </Form>

      {/* 註冊模態視窗 */}
      <RegisterModal
        visible={showRegister}
        onCancel={() => setShowRegister(false)}
        onSuccess={handleRegisterSuccess}
      />
    </Modal>
  );
};

export default LoginModal; 