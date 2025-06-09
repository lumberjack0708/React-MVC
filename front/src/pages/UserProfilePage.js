/* global Qs */
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Spin, message, Result } from 'antd';
import { Container, Heading } from '../styles/styles';
import { LoadingUserContainer, DatePickerStyle } from '../styles/userProfileStyles';
import { useNotification } from '../components/Notification';
import { getApiUrl } from '../config';
import dayjs from 'dayjs';
import Request from '../utils/Request';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function UserProfilePage({ user }) {
  const { notify } = useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.account_id) {
        message.error('無法獲取用戶 ID，請重新登入');
        setLoading(false);
        return;
      }

      try {
        const response = await Request().post(getApiUrl('getUsers'), Qs.stringify({ uid: user.account_id }));
        if (response.data.status === 200 && response.data.result.length > 0) {
          const userData = response.data.result[0];
          if (userData.birth) {
            userData.birth = dayjs(userData.birth, 'YYYY-MM-DD');
          }
          form.setFieldsValue(userData);
        } else {
          const message = response.data?.message || '無法獲取用戶數據';
          notify.error('錯誤', message);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || '獲取用戶數據失敗，請稍後再試';
        console.error('獲取用戶數據失敗:', error);
        notify.error('錯誤', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, form, notify]);

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
      if (response.data.status === 200) {
        message.success('用戶資料更新成功！');
      } else {
        throw new Error(response.data.message || '更新失敗');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '更新用戶資訊失敗！';
      console.error('更新失敗:', error);
      notify.error('失敗', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('表單驗證失敗:', errorInfo);
    notify.error('失敗', '請檢查表單欄位！');
  };

  // 未登入時顯示提示頁
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
            <Button type="primary" htmlType="submit">
              儲存變更
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Container>
  );
}

export default UserProfilePage; 