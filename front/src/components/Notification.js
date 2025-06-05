import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

// 通知容器樣式
const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 350px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 通知樣式
const NotificationItem = styled.div`
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease-out forwards;
  background-color: ${props => props.type === 'success' ? '#ebf9eb' : 
    props.type === 'info' ? '#e8f4fd' : 
    props.type === 'warning' ? '#fff8e6' : '#fde8e8'};
  border-left: 4px solid ${props => props.type === 'success' ? '#52c41a' : 
    props.type === 'info' ? '#1890ff' : 
    props.type === 'warning' ? '#faad14' : '#f5222d'};
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// 通知圖標
const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.type === 'success' ? '#52c41a' : 
    props.type === 'info' ? '#1890ff' : 
    props.type === 'warning' ? '#faad14' : '#f5222d'};
`;

// 通知內容容器
const ContentContainer = styled.div`
  flex: 1;
`;

// 通知標題
const Title = styled.h4`
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

// 通知描述
const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

// 關閉按鈕
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #999;
  transition: color 0.2s;
  
  &:hover {
    color: #666;
  }
`;

// 通知圖標組件
const Icon = ({ type }) => {
  // 根據類型返回不同的圖標
  if (type === 'success') {
    return (
      <IconContainer type={type}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M9 12l2 2 4-4" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        </svg>
      </IconContainer>
    );
  }
  
  if (type === 'info') {
    return (
      <IconContainer type={type}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path 
            d="M12 8v4M12 16h.01" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </IconContainer>
    );
  }
  
  if (type === 'warning') {
    return (
      <IconContainer type={type}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M12 9v2M12 15h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </IconContainer>
    );
  }
  
  if (type === 'error') {
    return (
      <IconContainer type={type}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path 
            d="M15 9l-6 6M9 9l6 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </IconContainer>
    );
  }
  
  return null;
};

// 單個通知組件
const Notification = ({ id, title, description, type, onClose }) => {
  useEffect(() => {
    // 5秒後自動關閉
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [id, onClose]);
  
  return (
    <NotificationItem type={type}>
      <Icon type={type} />
      
      <ContentContainer>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
      </ContentContainer>
      
      <CloseButton onClick={() => onClose(id)}>×</CloseButton>
    </NotificationItem>
  );
};

/**
 * @function NotificationProvider
 * @description 提供全域通知功能的 Context Provider。
 * @param {object} props - 傳入的子元件。
 * @returns {JSX.Element} 返回包裹子元件的 Provider。
 */

// 全局通知上下文
export const NotificationContext = React.createContext();

// 通知提供者組件
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // 新增通知
  const addNotification = (notification) => {
    const id = `notification-${Date.now()}`;
    setNotifications(prev => [...prev, { id, ...notification }]);
    return id;
  };
  
  // 移除通知
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // 提供便捷方法
  const notify = {
    success: (title, description) => addNotification({ title, description, type: 'success' }),
    info: (title, description) => addNotification({ title, description, type: 'info' }),
    warning: (title, description) => addNotification({ title, description, type: 'warning' }),
    error: (title, description) => addNotification({ title, description, type: 'error' })
  };
  
  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      <NotificationContainer>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

/**
 * @function useNotification
 * @description 自定義 Hook，簡化通知的使用。
 * @returns {object} 提供通知操作方法。
 */

// 自定義 Hook，用於在其他組件中使用通知系統
export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
