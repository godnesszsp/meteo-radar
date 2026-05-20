import dayjs from 'dayjs'

// 天气类型
export type WeatherType = 'sunny' | 'cloudy' | 'overcast' | 'rain' | 'heavyRain' | 'thunderstorm' | 'snow' | 'fog'

// 风向
export type WindDirection = '北风' | '东北风' | '东风' | '东南风' | '南风' | '西南风' | '西风' | '西北风'

// 预警级别
export type WarningLevel = 'blue' | 'yellow' | 'orange' | 'red'

// 预警类型
export type WarningType = '暴雨' | '高温' | '寒潮' | '大风' | '雷电' | '冰雹' | '暴雪' | '大雾'

// 实时数据接口
export interface RealtimeData {
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: WindDirection
  pressure: number
  precipitation: number
  visibility: number
  uvIndex: number
  airQuality: {
    aqi: number
    level: string
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
}

// 预测数据接口
export interface ForecastData {
  date: string
  dayOfWeek: string
  weather: WeatherType
  weatherText: string
  tempHigh: number
  tempLow: number
  humidity: number
  windSpeed: number
  windDirection: WindDirection
  precipitation: number
  precipitationProb: number
  sunrise: string
  sunset: string
}

// 预警信息接口
export interface WarningData {
  id: string
  type: WarningType
  level: WarningLevel
  title: string
  content: string
  publishTime: string
  effectiveTime: string
  expireTime: string
  region: string
}

// 站点数据接口
export interface StationData {
  id: string
  name: string
  lat: number
  lng: number
  temperature: number
  humidity: number
  windSpeed: number
  weather: WeatherType
  weatherText: string
}

// 雷达回波数据接口
export interface RadarData {
  lat: number
  lng: number
  intensity: number // 0-1
  type: 'light' | 'moderate' | 'heavy' | 'extreme'
}

// 天气图标映射
export const weatherIcons: Record<WeatherType, string> = {
  sunny: '☀️',
  cloudy: '⛅',
  overcast: '☁️',
  rain: '🌧️',
  heavyRain: '⛈️',
  thunderstorm: '🌩️',
  snow: '🌨️',
  fog: '🌫️'
}

// 天气文本映射
export const weatherTexts: Record<WeatherType, string> = {
  sunny: '晴',
  cloudy: '多云',
  overcast: '阴',
  rain: '小雨',
  heavyRain: '大雨',
  thunderstorm: '雷阵雨',
  snow: '雪',
  fog: '雾'
}

// 预警颜色映射
export const warningColors: Record<WarningLevel, string> = {
  blue: '#1890ff',
  yellow: '#faad14',
  orange: '#fa8c16',
  red: '#f5222d'
}

// 预警图标映射
export const warningIcons: Record<WarningType, string> = {
  '暴雨': '🌧️',
  '高温': '🌡️',
  '寒潮': '❄️',
  '大风': '💨',
  '雷电': '⚡',
  '冰雹': '🌨️',
  '暴雪': '❄️',
  '大雾': '🌫️'
}

// 生成随机数
function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 生成随机浮点数
function randomFloat(min: number, max: number, decimals: number = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

// 随机选择
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// 生成实时数据
export function generateRealtimeData(): RealtimeData {
  const hour = dayjs().hour()
  const isNight = hour < 6 || hour > 18

  const baseTemp = isNight ? 18 : 28
  const temperature = baseTemp + random(-3, 3)

  return {
    temperature,
    humidity: random(45, 85),
    windSpeed: randomFloat(2, 8),
    windDirection: randomPick(['北风', '东北风', '东风', '东南风', '南风', '西南风', '西风', '西北风']),
    pressure: randomFloat(1008, 1025),
    precipitation: randomFloat(0, 15),
    visibility: random(5, 25),
    uvIndex: isNight ? 0 : random(1, 11),
    airQuality: {
      aqi: random(20, 180),
      level: randomPick(['优', '良', '轻度污染', '中度污染']),
      pm25: random(10, 100),
      pm10: random(20, 150),
      o3: random(30, 120),
      no2: random(10, 60),
      so2: random(5, 30),
      co: randomFloat(0.5, 2.0)
    }
  }
}

// 生成7天预测数据
export function generateForecastData(): ForecastData[] {
  const forecasts: ForecastData[] = []
  const weatherTypes: WeatherType[] = ['sunny', 'cloudy', 'overcast', 'rain', 'heavyRain', 'thunderstorm']
  const windDirections: WindDirection[] = ['东风', '南风', '西风', '北风', '东北风', '西南风']

  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  for (let i = 0; i < 7; i++) {
    const date = dayjs().add(i, 'day')
    const weather = randomPick(weatherTypes)

    forecasts.push({
      date: date.format('MM/DD'),
      dayOfWeek: i === 0 ? '今天' : i === 1 ? '明天' : dayNames[date.day()],
      weather,
      weatherText: weatherTexts[weather],
      tempHigh: random(28, 38),
      tempLow: random(18, 25),
      humidity: random(40, 90),
      windSpeed: randomFloat(2, 10),
      windDirection: randomPick(windDirections),
      precipitation: weather === 'rain' || weather === 'heavyRain' ? randomFloat(5, 50) : 0,
      precipitationProb: weather === 'rain' || weather === 'heavyRain' ? random(60, 95) : random(0, 30),
      sunrise: '05:' + random(10, 40).toString().padStart(2, '0'),
      sunset: '19:' + random(10, 40).toString().padStart(2, '0')
    })
  }

  return forecasts
}

// 生成预警数据
export function generateWarningData(): WarningData[] {
  const warnings: WarningData[] = []
  const types: WarningType[] = ['暴雨', '高温', '大风', '雷电']
  const levels: WarningLevel[] = ['blue', 'yellow', 'orange', 'red']
  const regions = ['全市', '朝阳区', '海淀区', '丰台区', '通州区']

  const count = random(1, 4)

  for (let i = 0; i < count; i++) {
    const type = randomPick(types)
    const level = randomPick(levels)
    const now = dayjs()

    warnings.push({
      id: `W${Date.now()}-${i}`,
      type,
      level,
      title: `${type}${level === 'red' ? '红色' : level === 'orange' ? '橙色' : level === 'yellow' ? '黄色' : '蓝色'}预警`,
      content: `预计未来6小时内，${randomPick(regions)}将出现${type}天气，请注意防范。`,
      publishTime: now.subtract(random(1, 5), 'hour').format('YYYY-MM-DD HH:mm'),
      effectiveTime: now.format('YYYY-MM-DD HH:mm'),
      expireTime: now.add(random(6, 24), 'hour').format('YYYY-MM-DD HH:mm'),
      region: randomPick(regions)
    })
  }

  return warnings
}

// 生成站点数据
export function generateStationData(): StationData[] {
  const stations: StationData[] = [
    { id: 'S001', name: '北京站', lat: 39.9042, lng: 116.4074 },
    { id: 'S002', name: '海淀站', lat: 39.9592, lng: 116.3261 },
    { id: 'S003', name: '朝阳站', lat: 39.9215, lng: 116.4435 },
    { id: 'S004', name: '丰台站', lat: 39.8585, lng: 116.2860 },
    { id: 'S005', name: '通州站', lat: 39.9046, lng: 116.6563 },
    { id: 'S006', name: '大兴站', lat: 39.7269, lng: 116.3380 },
    { id: 'S007', name: '昌平站', lat: 40.2181, lng: 116.2298 },
    { id: 'S008', name: '顺义站', lat: 40.1281, lng: 116.6544 },
    { id: 'S009', name: '房山站', lat: 39.7486, lng: 116.1430 },
    { id: 'S010', name: '门头沟站', lat: 39.9374, lng: 116.1062 }
  ]

  return stations.map(station => {
    const weather = randomPick(['sunny', 'cloudy', 'overcast', 'rain'])
    return {
      ...station,
      temperature: random(22, 35),
      humidity: random(40, 85),
      windSpeed: randomFloat(2, 8),
      weather,
      weatherText: weatherTexts[weather]
    }
  })
}

// 生成雷达回波数据
export function generateRadarData(): RadarData[] {
  const data: RadarData[] = []
  const centerLat = 39.9042
  const centerLng = 116.4074

  // 生成多个回波区域
  const clusters = random(3, 6)

  for (let c = 0; c < clusters; c++) {
    const clusterLat = centerLat + randomFloat(-0.3, 0.3)
    const clusterLng = centerLng + randomFloat(-0.4, 0.4)
    const clusterSize = random(5, 15)

    for (let i = 0; i < clusterSize; i++) {
      const intensity = randomFloat(0.1, 1.0)
      let type: RadarData['type'] = 'light'

      if (intensity > 0.75) type = 'extreme'
      else if (intensity > 0.5) type = 'heavy'
      else if (intensity > 0.25) type = 'moderate'

      data.push({
        lat: clusterLat + randomFloat(-0.05, 0.05),
        lng: clusterLng + randomFloat(-0.05, 0.05),
        intensity,
        type
      })
    }
  }

  return data
}

// 生成24小时温度数据
export function generateHourlyTemp(): { hour: string; temp: number }[] {
  const data: { hour: string; temp: number }[] = []
  const baseTemp = 25

  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00'
    const tempVariation = Math.sin((i - 6) * Math.PI / 12) * 8
    const temp = baseTemp + tempVariation + randomFloat(-1, 1)

    data.push({
      hour,
      temp: parseFloat(temp.toFixed(1))
    })
  }

  return data
}

// 生成风向玫瑰图数据
export function generateWindRoseData(): { direction: string; speed: number; frequency: number }[] {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']

  return directions.map(direction => ({
    direction,
    speed: randomFloat(2, 10),
    frequency: random(5, 25)
  }))
}

// 生成降水数据
export function generatePrecipitationData(): { time: string; value: number }[] {
  const data: { time: string; value: number }[] = []

  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00'
    const isRainHour = i >= 12 && i <= 18

    data.push({
      time: hour,
      value: isRainHour ? randomFloat(0, 15) : randomFloat(0, 2)
    })
  }

  return data
}

// 模拟AI对话回复
export const aiResponses: Record<string, string> = {
  '北京天气': '北京今天天气晴朗，气温28°C，东南风3-4级，空气质量良好。建议外出时做好防晒措施。',
  '上海天气': '上海今天多云转阴，气温26°C，东北风4-5级。下午可能有阵雨，建议携带雨具。',
  '广州天气': '广州今天雷阵雨，气温32°C，湿度较高。请注意防雷防雨，减少户外活动。',
  '深圳天气': '深圳今天多云，气温31°C，南风3级。紫外线较强，请注意防晒。',
  '杭州天气': '杭州今天小雨转多云，气温25°C，微风。适合室内活动，外出请带伞。',
  '成都天气': '成都今天阴天，气温22°C，无持续风向。空气质量一般，建议减少户外运动。',
  '武汉天气': '武汉今天晴转多云，气温30°C，南风3-4级。中午较热，请注意防暑降温。',
  '西安天气': '西安今天晴，气温27°C，西北风2-3级。天气干燥，建议多补充水分。',
  '未来三天': '根据最新气象数据分析，未来三天北京地区以晴到多云天气为主，气温在25-32°C之间波动，风力不大。第三天可能会有阵雨，请关注最新预报。',
  '台风': '目前西太平洋有台风生成，预计未来48小时内向西北方向移动。我地区暂无直接影响，但需关注后续发展动态。',
  '空气质量': '当前北京空气质量指数(AQI)为68，等级为良。PM2.5浓度为48μg/m³，建议敏感人群减少户外活动。',
  '紫外线': '当前紫外线指数为7，属于强紫外线等级。建议涂抹SPF30+防晒霜，佩戴遮阳帽和太阳镜。',
  'default': '感谢您的提问！我可以为您提供天气查询、天气预测、空气质量等气象信息。您可以问我"北京天气"、"未来三天天气"等问题。'
}

// 获取AI回复
export function getAiResponse(question: string): string {
  const lowerQ = question.toLowerCase()

  // 匹配预设回复
  for (const [key, value] of Object.entries(aiResponses)) {
    if (key !== 'default' && lowerQ.includes(key.toLowerCase())) {
      return value
    }
  }

  // 城市天气匹配
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆', '天津', '苏州']
  for (const city of cities) {
    if (lowerQ.includes(city)) {
      return `${city}今天天气晴朗，气温${random(22, 35)}°C，${randomPick(['东风', '南风', '西风', '北风'])}${random(2, 5)}级，空气质量${randomPick(['优', '良'])}。祝您生活愉快！`
    }
  }

  // 自定义问题 - 提示知识库待接入
  return `感谢您的提问："${question}"

🔔 温馨提示：
AI气象知识库正在建设中，目前仅支持以下快捷查询：
• 城市天气查询（如：北京天气、上海天气）
• 未来三天天气预测
• 空气质量查询
• 台风、紫外线等信息

完整AI对话功能将在后续版本中接入大语言模型，届时可支持自由问答，敬请期待！

如需更多气象信息，请访问中国气象局官网 www.cma.gov.cn`
}
