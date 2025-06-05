/**
 * @description 匯出專案用到的圖片取得工具。
 *              根據類別與名稱取得對應圖片路徑。
 */

// 食品類圖片
import catFood from './food/cat-food.jpg';
import dogBoneClean from './food/dog-bone-clean.jpg';

// 玩具類圖片
import catTunnel from './toy/cat-tunnel.jpg';

// 配件類圖片
import petWaterDispenser from './accessories/pet-water-dispenser.jpg';
import petFeeder from './accessories/pet-feeder.jpg';
import catLitterBox from './accessories/cat-litter-box.jpg';

// 導出所有圖片對象
export const images = {
  food: {
    catFood,
    dogBoneClean
  },
  toy: {
    catTunnel
  },
  accessories: {
    petWaterDispenser,
    petFeeder,
    catLitterBox
  }
};

// 取得產品圖片的輔助函數
// 確保從 API 獲取的產品物件有 category 和 name (或 p_name) 屬性
export const getProductImage = (category, productNameFromAPI) => {
  const imageMapping = {
    food: {
      '高級貓糧': 'catFood',
      '狗狗潔牙骨': 'dogBoneClean',
      '犬用飼料 2kg': 'dogFood2kg',
      '貓咪零食 - 鮪魚條': 'catSnackTuna',
      '兔子飼料 1.5kg': 'rabbitFood',
      '鳥飼料混合包 1kg': 'birdSeedMix',
    },
    toy: {
      '貓咪隧道玩具': 'catTunnel',
      '貓抓板': 'catScratchBoard',
      '小動物跑輪': 'smallPetWheel',
      '狗狗玩具 - 發聲球': 'dogToySqueakyBall',
      '貓用逗貓棒': 'catTeaserWand',
    },
    accessories: {
      '寵物自動飲水機': 'petWaterDispenser',
      '寵物自動喂食器': 'petFeeder',
      '貓砂盆': 'catLitterBox',
      '寵物睡墊': 'petBed',
      '鳥用水樽': 'birdWaterBottle',
      '貓砂盆 附蓋': 'coveredCatLitterBox',
      '智能餵食器': 'smartFeeder',
      '犬用牽繩 (紅色)': 'dogLeashRed',
      '寵物洗毛精 500ml': 'petShampoo',
      '貓跳台 四層': 'catTree4Tier',
      '狗狗雨衣 (M號)': 'dogRaincoatM',
      '寵物提籃 (小型犬/貓)': 'petCarrierSmall',
      '倉鼠木屑 (無塵)': 'hamsterBedding',
      '水龜濾水器': 'turtleFilter',
    }
  };

  if (category && productNameFromAPI && imageMapping[category] && imageMapping[category][productNameFromAPI]) {
    const imageKey = imageMapping[category][productNameFromAPI];
    if (images[category] && images[category][imageKey]) {
      return images[category][imageKey];
    }
  }
  
  console.warn(`圖片資源未找到或 imageMapping 不完整: 傳入的類別="${category}", 產品名稱="${productNameFromAPI}"。請檢查 imageMapping 中的鍵名是否與資料庫產品名稱完全一致，並確認 images 物件中已正確導入圖片。`);
  return '/placeholder.png'; // 提供一個預設圖片路徑
};

export default images;
