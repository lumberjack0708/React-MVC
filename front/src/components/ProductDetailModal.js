import React from 'react';
import { 
  Modal, 
  Button, 
  Descriptions, 
  Typography, 
  Image, 
  Divider, 
  Space,
  Statistic 
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { getProductImage } from '../assets/images/index';
import { API_CONFIG } from '../config';

const { Paragraph } = Typography;

/**
 * @function ProductDetailModal
 * @description 商品詳情彈窗元件，顯示商品資訊與加入購物車按鈕。
 * @param {object} props - 包含商品資料、開關狀態、關閉函數等。
 * @returns {JSX.Element|null} 返回彈窗內容或 null。
 */

// 產品詳情模態對話框組件
function ProductDetailModal({ product, onClose, onAddToCart }) {
  const categoryNames = {
    food: '食品',
    toy: '玩具',
    accessories: '配件'
  };
  
  const productDescriptions = {
    '高級貓糧': '採用天然食材，富含多種營養元素，適合各階段的貓咪食用。特別添加牛磺酸和omega-3脂肪酸，有助於貓咪的眼睛和心臟健康。',
    '寵物自動飲水機': '創新設計，保持水的新鮮流動，鼓勵寵物多喝水。配備靜音水泵和濾網系統，確保寵物飲用的水質乾淨衛生。',
    '貓咪隧道玩具': '優質材料製作，提供安全的遊戲環境。彈出設計方便收納，內部鋪有柔軟的毛絨材料，貓咪玩耍時不會受傷。',
    '狗狗潔牙骨': '特殊形狀設計，可以深入清潔狗狗牙齒的縫隙。添加天然薄荷提取物，幫助口氣清新，同時可增強牙齒健康。',
    '寵物自動喂食器': '可程式設定定時投放食物，確保寵物按時進食。大容量食物儲存盒，減少頻繁添加食物的次數。適合短期外出的家庭使用。',
    '貓砂盆': '半封閉式設計，減少貓砂散落。底部附有過濾網，方便清理貓砂。優質PP材質，堅固耐用，易於清洗。'
  };
  
  const productSpecs = {
    '高級貓糧': '3kg/包',
    '寵物自動飲水機': '容量: 2L',
    '貓咪隧道玩具': '長度: 120cm，直徑: 25cm',
    '狗狗潔牙骨': '10支/包',
    '寵物自動喂食器': '容量: 4L',
    '貓砂盆': '尺寸: 45x35x40cm'
  };
  
  return (
    <Modal
      open={true}
      title={product.name}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="back" onClick={onClose}>
          關閉
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={async () => {
            const productWithId = {
              ...product,
              id: product.id || product.product_id
            };
            await onAddToCart(productWithId);
          }}
        >
          加入購物車
        </Button>,
      ]}
      centered
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Image
            src={
              product.image_url
                ? `${API_CONFIG.assetBaseURL}public/${product.image_url}`
                : getProductImage(product.category, product.name)
            }
            alt={product.name}
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
        </div>
        
        <Descriptions bordered column={1}>
          <Descriptions.Item label="價格">
            <Statistic
              value={product.price}
              prefix="$"
              valueStyle={{ color: '#2B2118', fontWeight: 700 }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="類別">
            {categoryNames[product.category] || product.category}
          </Descriptions.Item>
          <Descriptions.Item label="規格">
            {productSpecs[product.name] || '標準規格'}
          </Descriptions.Item>
        </Descriptions>
        
        <Divider orientation="left">產品介紹</Divider>
        <Paragraph>
          {productDescriptions[product.name] || 
            '這是一個優質的寵物產品，專為您的毛小孩設計，保證品質與安全性。'}
        </Paragraph>
      </Space>
    </Modal>
  );
}

export default ProductDetailModal;
