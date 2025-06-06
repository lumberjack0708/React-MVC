/**
 * @description 匯出專案用到的圖片取得工具。
 *              根據類別與名稱取得對應圖片路徑。
 */

import placeholder from './placeholder.png';

// --- 食品類圖片 (Food) ---
import dogFood from './food/dogFood.jpg';
import dogBoneClean10pack from './food/dog-bone-clean.jpg';
import catSnackTunaStrips from './food/catSnackTunaStrips.png';
import rabbitFood1_5kg from './food/rabbitFood1_5kg.jpg';
import birdSeedMix1kg from './food/birdSeedMix1kg.jpg';

// --- 玩具類圖片 (Toy) ---
import catScratchingBoard from './toy/catScratchingBoard.jpg';
import smallAnimalWheel from './toy/smallAnimalWheel.jpg';
import dogToySqueakyBall from './toy/dogToySqueakyBall.jpg';
import catTeaserWand from './toy/catTeaserWand.jpg';

// --- 配件類圖片 (Accessories) ---
import petBed from './accessories/petBed.jpg';
import birdWaterBottle from './accessories/birdWaterBottle.jpg';
import coveredCatLitterBox from './accessories/coveredCatLitterBox.jpg';
import smartFeeder from './accessories/smartFeeder.jpg';
import dogLeashRed from './accessories/dogLeashRed.jpg';
import petShampoo500ml from './accessories/petShampoo500ml.jpg';
import catTree4Tier from './accessories/catTree4Tier.jpg';
import dogRaincoatM from './accessories/dogRaincoatM.webp';
import petCarrierSmall from './accessories/petCarrierSmall.jpg';
import hamsterBeddingDustFree from './accessories/hamsterBeddingDustFree.jpg';
import turtleFilter from './accessories/turtleFilter.jpg';

// 導出所有圖片對象
export const images = {
  food: {
    dogFood,
    dogBoneClean10pack,
    catSnackTunaStrips,
    rabbitFood1_5kg,
    birdSeedMix1kg,
  },
  toy: {
    catScratchingBoard,
    smallAnimalWheel,
    dogToySqueakyBall,
    catTeaserWand,
  },
  accessories: {
    petBed,
    birdWaterBottle,
    coveredCatLitterBox,
    smartFeeder,
    dogLeashRed,
    petShampoo500ml,
    catTree4Tier,
    dogRaincoatM,
    petCarrierSmall,
    hamsterBeddingDustFree,
    turtleFilter,
  }
};

// 取得產品圖片的輔助函數
export const getProductImage = (category, productNameFromAPI) => {
  const imageMapping = {
    food: {
      '犬用飼料 2kg': 'dogFood',
      '狗狗潔牙骨(10入)': 'dogBoneClean10pack',
      '貓咪零食 - 鮪魚條': 'catSnackTunaStrips',
      '兔子飼料 1.5kg': 'rabbitFood1_5kg',
      '鳥飼料混合包 1kg': 'birdSeedMix1kg',
    },
    toy: {
      '貓抓板': 'catScratchingBoard',
      '小動物跑輪': 'smallAnimalWheel',
      '狗狗玩具 - 發聲球': 'dogToySqueakyBall',
      '貓用逗貓棒': 'catTeaserWand',
    },
    accessories: {
      '寵物睡墊': 'petBed',
      '鳥用水樽': 'birdWaterBottle',
      '貓砂盆 附蓋': 'coveredCatLitterBox',
      '智能餵食器': 'smartFeeder',
      '犬用牽繩 (紅色)': 'dogLeashRed',
      '寵物洗毛精 500ml': 'petShampoo500ml',
      '貓跳台 四層': 'catTree4Tier',
      '狗狗雨衣 (M號)': 'dogRaincoatM',
      '寵物提籃 (小型犬/貓)': 'petCarrierSmall',
      '倉鼠木屑 (無塵)': 'hamsterBeddingDustFree',
      '水龜濾水器': 'turtleFilter',
    }
  };

  if (category && productNameFromAPI && imageMapping[category] && imageMapping[category][productNameFromAPI]) {
    const imageKey = imageMapping[category][productNameFromAPI];
    if (images[category] && images[category][imageKey]) {
      return images[category][imageKey];
    }
  }
  
  // 當圖片未找到時，回傳一個本地的預設圖片路徑
  return placeholder;
};
