/* global Qs */
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Spin, Result } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Container, Heading } from '../styles/styles';
import { LoadingUserContainer, DatePickerStyle } from '../styles/userProfileStyles';
import { useNotification } from '../components/Notification';
import { getApiUrl } from '../config';
import dayjs from 'dayjs';
import Request from '../utils/Request';
import { getToken, removeToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { tokenManager } from '../utils/tokenManager';

function UserProfilePage({ user }) {
  const { notify } = useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenManager.getExpiredStatus()) {
      if (!tokenManager.hasNotified) {
        notify.error('登入過期', '您的登入權限已過期，請重新登入');
        tokenManager.hasNotified = true;
      }
      return;
    }

    if (!token || !user?.account_id) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        const url = getApiUrl('getUser');
        const data = Qs.stringify({ uid: user.account_id });
        const response = await Request().post(url, data);

        if (response.data.status === 200 && response.data.result?.length > 0) {
          const userData = response.data.result[0];
          form.setFieldsValue({
            account_code: userData.account_code,
            email: userData.email,
            full_name: userData.full_name,
            addr: userData.addr,
            birth: userData.birth ? dayjs(userData.birth) : null,
          });
        } else {
          if (tokenManager.checkTokenExpiry(response)) {
            notify.error('登入過期', '您的登入權限已過期，請重新登入');
            return;
          }
          notify.error('載入失敗', response.data.message || '無法載入用戶資料');
        }
      } catch (error) {
        console.error('載入用戶資料失敗:', error);
        if (!tokenManager.getExpiredStatus()) {
          notify.error('載入失敗', '網路錯誤或伺服器無回應');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, token, form, notify]);

  const onFinish = async (values) => {
    if (!user) return;
    
    setLoading(true);
    
    const dataToUpdate = {
      uid: user.account_id,
      name: values.full_name,
      addr: values.addr,
      bir: values.birth ? values.birth.format('YYYY-MM-DD') : null,
      password: values.password,
    };

    try {
      const response = await Request().post(getApiUrl('updateUser'), Qs.stringify(dataToUpdate));
      
      if (tokenManager.checkTokenExpiry(response)) {
        return;
      }
      
      if (response.data.status === 200) {
        notify.success('更新成功', '用戶資料更新成功！您的個人資訊已儲存。');
      } else {
        throw new Error(response.data.message || '更新失敗');
      }
    } catch (error) {
      if (tokenManager.checkTokenExpiry(error.response)) {
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || '更新用戶資訊失敗！';
      console.error('更新失敗:', error);
      notify.error('更新失敗', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('表單驗證失敗:', errorInfo);
    notify.error('表單驗證失敗', '請檢查表單欄位是否填寫正確！');
  };

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
              </Button>,
              <Button key="home" onClick={() => {
                tokenManager.reset();
                navigate('/');
              }}>
                返回首頁
              </Button>
            ]}
          />
        </Card>
      </Container>
    );
  }

  if (!token || !user) {
    return (
      <Container>
        <Card>
          <Result
            status="warning"
            title="尚未登入"
            subTitle="您沒有權限查看個人資料，請先登入。"
            extra={<Button type="primary" onClick={() => navigate('/')}>返回首頁</Button>}
          />
        </Card>
      </Container>
    );
  }

  if (loading) {
    return (
      <LoadingUserContainer>
        <Spin size="large" />
        <p>正在載入用戶資料...</p>
      </LoadingUserContainer>
    );
  }

  return (
    <Container>
      <Heading>編輯用戶資訊</Heading>
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="full_name"
            label="姓名"
            rules={[{ required: true, message: '請輸入您的姓名！' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="電子郵件"
          >
            <Input readOnly />
          </Form.Item>

          <Form.Item
            name="addr"
            label="地址"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="birth"
            label="生日"
          >
            <DatePicker style={DatePickerStyle} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="password"
            label="新密碼"
            help="若不修改密碼，請留空。"
          >
            <Input.Password placeholder="請輸入新密碼" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              儲存變更
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

export default UserProfilePage; 