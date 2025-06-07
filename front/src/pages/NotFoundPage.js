import React from 'react';
import { Container } from '../styles/styles';
import { NotFoundCardStyle } from '../styles/notFoundStyles';
import { Card, Button, Typography, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

/**
 * @function NotFoundPage
 * @description 404 頁面元件，當路由找不到對應頁面時顯示。
 * @returns {JSX.Element} 返回 404 頁面的 JSX 結構。
 */
function NotFoundPage() {
  return (
    <Container>
      <Card style={NotFoundCardStyle}>
        <Result
          status="404"
          title="404 - 頁面未找到"
          subTitle="很抱歉，您所尋找的頁面不存在。"
          extra={
            <Button 
              type="primary" 
              icon={<HomeOutlined />}
              onClick={() => window.location.href = '/'}
            >
              返回首頁
            </Button>
          }
        >
          <Paragraph>可能是您輸入的網址有誤，或該頁面已被移除。</Paragraph>
        </Result>
      </Card>
    </Container>
  );
}

export default NotFoundPage;
