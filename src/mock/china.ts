// 中国省份数据（包含中心坐标和Mock气象数据）
export interface ProvinceData {
  name: string
  center: [number, number]
  temperature: number
  humidity: number
  weather: string
  windSpeed: number
  aqi: number
}

// 省份中心坐标
const provinceCenters: Record<string, [number, number]> = {
  '北京': [116.46, 39.92],
  '天津': [117.20, 39.13],
  '河北': [114.48, 38.03],
  '山西': [112.55, 37.87],
  '内蒙古': [111.75, 40.84],
  '辽宁': [123.43, 41.80],
  '吉林': [125.35, 43.88],
  '黑龙江': [126.66, 45.74],
  '上海': [121.48, 31.22],
  '江苏': [118.78, 32.06],
  '浙江': [120.19, 30.26],
  '安徽': [117.28, 31.86],
  '福建': [119.30, 26.08],
  '江西': [115.89, 28.68],
  '山东': [117.00, 36.65],
  '河南': [113.65, 34.76],
  '湖北': [114.31, 30.52],
  '湖南': [112.94, 28.23],
  '广东': [113.26, 23.13],
  '广西': [108.33, 22.84],
  '海南': [110.35, 20.02],
  '重庆': [106.55, 29.56],
  '四川': [104.07, 30.67],
  '贵州': [106.71, 26.57],
  '云南': [102.73, 25.04],
  '西藏': [91.11, 29.97],
  '陕西': [108.95, 34.27],
  '甘肃': [103.73, 36.03],
  '青海': [101.74, 36.56],
  '宁夏': [106.27, 38.47],
  '新疆': [87.62, 43.79],
  '台湾': [121.55, 25.05],
  '香港': [114.17, 22.28],
  '澳门': [113.54, 22.20],
}

// 天气类型
const weatherTypes = ['晴', '多云', '阴', '小雨', '中雨', '大雨', '雷阵雨', '雪']

// 随机数生成
function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// 生成全国省份气象数据
export function generateChinaData(): ProvinceData[] {
  const provinces: ProvinceData[] = []

  for (const [name, center] of Object.entries(provinceCenters)) {
    // 根据纬度大致推算温度范围
    const lat = center[1]
    const baseTemp = lat > 40 ? 15 : lat > 30 ? 25 : 30

    provinces.push({
      name,
      center,
      temperature: baseTemp + random(-5, 8),
      humidity: random(30, 90),
      weather: randomPick(weatherTypes),
      windSpeed: randomFloat(1, 8),
      aqi: random(20, 200),
    })
  }

  return provinces
}

// 省份天气图标映射
export const weatherIconMap: Record<string, string> = {
  '晴': '☀️',
  '多云': '⛅',
  '阴': '☁️',
  '小雨': '🌧️',
  '中雨': '🌧️',
  '大雨': '⛈️',
  '雷阵雨': '🌩️',
  '雪': '🌨️',
}

// AQI等级映射
export function getAqiLevel(aqi: number): { level: string; color: string } {
  if (aqi <= 50) return { level: '优', color: '#52c41a' }
  if (aqi <= 100) return { level: '良', color: '#faad14' }
  if (aqi <= 150) return { level: '轻度', color: '#fa8c16' }
  if (aqi <= 200) return { level: '中度', color: '#f5222d' }
  return { level: '重度', color: '#722ed1' }
}
