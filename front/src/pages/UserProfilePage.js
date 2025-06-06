/* global axios, Qs */
import React, { useState, useEffect } from 'react';
import { Card, Typography, Form, Input, Button, DatePicker, Spin } from 'antd';
import { Container, Heading } from '../styles/styles';
import { useNotification } from '../components/Notification';
import { getApiUrl } from '../config';
import dayjs from 'dayjs';

const { Title } = Typography;

function UserProfilePage() {
  const { notify } = useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(1); // 暫時寫死用戶 ID 為 1

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(getApiUrl('getUsers'), Qs.stringify({ uid: userId }));

        if (response.data && response.data.status === 200 && response.data.result.length > 0) {
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

    fetchUserData();
  }, [userId, form, notify]);

  const onFinish = async (values) => {
    const birthDate = values.birth ? values.birth.format('YYYY-MM-DD') : null;

    const dataToUpdate = {
      uid: userId,
      name: values.full_name,
      addr: values.addr,
      bir: birthDate,
      ...(values.password && { password: values.password }),
    };

    try {
      const response = await axios.post(getApiUrl('updateUser'), Qs.stringify(dataToUpdate));
      if (response.data && response.data.status === 200) {
        notify.success('成功', '用戶資訊已成功更新！');
      } else {
        throw new Error(response.data.message || '更新失敗');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '更新用戶資訊失敗！';
      console.error('更新失敗:', error);
      notify.error('失敗', errorMessage);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('表單驗證失敗:', errorInfo);
    notify.error('失敗', '請檢查表單欄位！');
  };

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', paddingTop: '50px' }}>
        <Spin size="large" />
        <p>正在載入用戶資料...</p>
      </Container>
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
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
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