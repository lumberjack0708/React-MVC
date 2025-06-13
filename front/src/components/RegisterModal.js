/* global Qs */
import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Divider, DatePicker } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import Request from '../utils/Request';
import { getApiUrl } from '../config';
import dayjs from 'dayjs';
import { useNotification } from './Notification';

const RegisterModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const handleRegister = async (values) => {
    setLoading(true);
    
    // 準備註冊資料
    const postData = {
      account_code: values.account_code,
      email: values.email,
      password: values.password,
      name: values.name,
      addr: values.addr || '',
      bir: values.birth ? dayjs(values.birth).format('YYYY-MM-DD') : ''
    };

    try {
      const res = await Request().post(getApiUrl('newUser'), Qs.stringify(postData));
      const response = res.data;

      if (response.status === 200) {
        // 使用全域通知元件顯示成功訊息
        notify.success(
          '🎉 註冊成功！',
          `歡迎加入 ${response.full_name || '新會員'}！您的帳號是 ${response.account_code}，請使用此帳號登入。`
        );
        
        // 同時保留 Ant Design 的 message（較簡短）
        message.success('註冊成功！');
        
        form.resetFields();
        onSuccess && onSuccess(response);
        onCancel();
      } else {
        // 使用全域通知元件顯示錯誤訊息
        notify.error(
          '註冊失敗',
          response.message || '請檢查您的資料並重試'
        );
        message.error(response.message || '註冊失敗，請檢查您的資料');
      }
    } catch (error) {
      console.error('註冊 API 呼叫失敗:', error);
      
      // 使用全域通知元件顯示詳細錯誤訊息
      if (error.response?.data?.message) {
        notify.error(
          '註冊失敗',
          error.response.data.message
        );
        message.error(error.response.data.message);
      } else {
        notify.error(
          '連線錯誤',
          '網路連線異常或伺服器暫時無法回應，請檢查網路連線後重試。'
        );
        message.error('網路錯誤或伺服器無回應');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 密碼確認驗證規則
  const validateConfirmPassword = (_, value) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('兩次輸入的密碼不一致！'));
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
          <UserOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
          會員註冊
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={480}
      destroyOnClose
      centered
    >
      <Divider style={{ margin: '16px 0' }} />
      
      <Form
        form={form}
        name="register"
        onFinish={handleRegister}
        autoComplete="off"
        layout="vertical"
        size="large"
        scrollToFirstError
      >
        {/* 帳號 */}
        <Form.Item
          name="account_code"
          label="帳號"
          rules={[
            { required: true, message: '請輸入帳號！' },
            { min: 3, max: 10, message: '帳號長度必須在3-10個字元之間！' },
            { pattern: /^[a-zA-Z0-9]+$/, message: '帳號只能包含英文字母和數字！' }
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請輸入3-10個字元的帳號"
          />
        </Form.Item>

        {/* 電子郵件 */}
        <Form.Item
          name="email"
          label="電子郵件"
          rules={[
            { required: true, message: '請輸入電子郵件！' },
            { type: 'email', message: '請輸入有效的電子郵件格式！' }
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請輸入您的電子郵件"
          />
        </Form.Item>

        {/* 姓名 */}
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            { required: true, message: '請輸入姓名！' },
            { min: 2, message: '姓名至少需要2個字元！' }
          ]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請輸入您的真實姓名"
          />
        </Form.Item>

        {/* 密碼 */}
        <Form.Item
          name="password"
          label="密碼"
          rules={[
            { required: true, message: '請輸入密碼！' },
            { min: 6, message: '密碼長度至少需要6個字元！' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請輸入至少6個字元的密碼"
          />
        </Form.Item>

        {/* 確認密碼 */}
        <Form.Item
          name="confirmPassword"
          label="確認密碼"
          dependencies={['password']}
          rules={[
            { required: true, message: '請確認您的密碼！' },
            { validator: validateConfirmPassword }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請再次輸入密碼"
          />
        </Form.Item>

        {/* 地址（選填） */}
        <Form.Item
          name="addr"
          label="地址（選填）"
        >
          <Input
            prefix={<HomeOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請輸入您的地址"
          />
        </Form.Item>

        {/* 生日（選填） */}
        <Form.Item
          name="birth"
          label="生日（選填）"
        >
          <DatePicker
            prefix={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="請選擇您的生日"
            style={{ width: '100%' }}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
            format="YYYY-MM-DD"
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
              fontWeight: '500',
              backgroundColor: '#52c41a',
              borderColor: '#52c41a'
            }}
          >
            {loading ? '註冊中...' : '立即註冊'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal; 