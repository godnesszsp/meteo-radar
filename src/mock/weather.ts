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

// ============================================================
// 基础工具函数
// ============================================================

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals: number = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

// 在基准值附近做微幅随机偏移（模拟传感器噪声）
function jitter(base: number, amplitude: number): number {
  return base + (Math.random() - 0.5) * amplitude * 2
}

// ============================================================
// 气象物理模型 — 基于时间的真实变化规律
// ============================================================

// 5 月底北京的气候基准值（模拟当前季节）
const CLIMATE = {
  tempDayHigh: 32,      // 白天最高温（14:00 前后）
  tempNightLow: 19,     // 夜间最低温（04:00 前后）
  tempAmplitude: 6.5,   // 半振幅 (32-19)/2
  tempCenter: 25.5,     // 中心温度 (32+19)/2
  humidityBase: 55,     // 基础湿度
  pressureBase: 1013,   // 标准气压
  windBase: 3.5,        // 基础风速 m/s
}

// 当日天气场景（首次生成后保持一整天，次日刷新）
type WeatherScene = {
  type: WeatherType
  cloudCover: number     // 0-1 云量
  rainFactor: number     // 0-1 降水因子
  windBoost: number      // 风速加成
  pressureOffset: number // 气压偏移
}

let _scene: WeatherScene | null = null
let _sceneDate: string = ''

function getDailyScene(): WeatherScene {
  const today = dayjs().format('YYYY-MM-DD')
  if (_scene && _sceneDate === today) return _scene

  // 基于季节概率生成当日天气类型（5月底：晴/多云/阵雨为主）
  const roll = Math.random()
  let type: WeatherType
  let cloudCover: number
  let rainFactor: number
  let windBoost: number
  let pressureOffset: number

  if (roll < 0.35) {
    // 35% 晴天
    type = 'sunny'
    cloudCover = 0.1
    rainFactor = 0
    windBoost = 0
    pressureOffset = 2
  } else if (roll < 0.60) {
    // 25% 多云
    type = 'cloudy'
    cloudCover = 0.5
    rainFactor = 0
    windBoost = 1
    pressureOffset = 0
  } else if (roll < 0.75) {
    // 15% 阴天
    type = 'overcast'
    cloudCover = 0.85
    rainFactor = 0.1
    windBoost = 0.5
    pressureOffset = -1
  } else if (roll < 0.88) {
    // 13% 小雨
    type = 'rain'
    cloudCover = 0.9
    rainFactor = 0.6
    windBoost = 2
    pressureOffset = -3
  } else if (roll < 0.95) {
    // 7% 大雨
    type = 'heavyRain'
    cloudCover = 1
    rainFactor = 1
    windBoost = 4
    pressureOffset = -5
  } else {
    // 5% 雷阵雨
    type = 'thunderstorm'
    cloudCover = 1
    rainFactor = 0.9
    windBoost = 5
    pressureOffset = -4
  }

  _scene = { type, cloudCover, rainFactor, windBoost, pressureOffset }
  _sceneDate = today
  return _scene
}

// 基于正弦曲线的 24h 温度模型
// 最低温 ~04:00，最高温 ~14:00，符合华北平原 5 月实况
function tempCurve(hour: number, minute: number = 0): number {
  const t = hour + minute / 60
  // 相位偏移：sin 在 π/2 (6:00) 取最小值，3π/2 (18:00) 取最大值
  // 我们需要 4:00 最低、14:00 最高，偏移 -2 小时
  const phase = ((t - 4) / 24) * 2 * Math.PI
  return CLIMATE.tempCenter + CLIMATE.tempAmplitude * (-Math.cos(phase))
}

// 湿度曲线：与温度负相关，夜间高白天低，雨天整体抬升
function humidityCurve(hour: number, scene: WeatherScene): number {
  const baseHumidity = CLIMATE.humidityBase + (scene.cloudCover - 0.3) * 20
  // 白天降湿、夜间增湿
  const diurnalOffset = -Math.sin(((hour - 6) / 24) * 2 * Math.PI) * 15
  return clamp(Math.round(baseHumidity + diurnalOffset), 30, 98)
}

// 风速曲线：午后对流最强，夜间最弱
function windCurve(hour: number, scene: WeatherScene): number {
  const diurnalFactor = Math.max(0, Math.sin(((hour - 6) / 24) * Math.PI))
  const base = CLIMATE.windBase + scene.windBoost
  return parseFloat((base * (0.5 + diurnalFactor * 0.8)).toFixed(1))
}

// UV 指数：正午峰值，夜间为 0，阴天/雨天衰减
function uvCurve(hour: number, scene: WeatherScene): number {
  if (hour < 6 || hour > 19) return 0
  // 太阳高度角近似
  const sunAngle = Math.sin(((hour - 6) / 13) * Math.PI)
  const cloudPenalty = 1 - scene.cloudCover * 0.7
  return clamp(Math.round(sunAngle * 11 * cloudPenalty), 0, 11)
}

// 能见度：雾天/雨天低，晴天高，清晨湿度大时最低
function visibilityCurve(hour: number, humidity: number, scene: WeatherScene): number {
  let base = 20
  // 清晨雾气
  if (hour >= 4 && hour <= 8 && humidity > 70) base -= 8
  // 雨天衰减
  if (scene.rainFactor > 0.5) base -= scene.rainFactor * 10
  // 高湿度衰减
  if (humidity > 80) base -= (humidity - 80) * 0.3
  return clamp(Math.round(base + jitter(0, 2)), 1, 30)
}

// ============================================================
// AQI 模型：早晚高峰高、午间低，风大则散
// ============================================================

function aqiModel(hour: number, windSpeed: number, scene: WeatherScene): number {
  // 基准 AQI（北京 5 月一般良~轻度）
  let base = 65
  // 早晚高峰叠加（机动车排放）
  if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) base += 30
  // 午间光化学反应 O3 升高但 PM 下降，总体 AQI 略降
  if (hour >= 12 && hour <= 15) base -= 15
  // 夜间积累
  if (hour >= 22 || hour <= 5) base += 10
  // 风速稀释效应：风速每增 1m/s，AQI 降 ~5
  base -= windSpeed * 5
  // 降雨冲刷
  if (scene.rainFactor > 0.3) base -= scene.rainFactor * 25

  return clamp(Math.round(base + jitter(0, 10)), 15, 250)
}

function aqiLevel(aqi: number): string {
  if (aqi <= 50) return '优'
  if (aqi <= 100) return '良'
  if (aqi <= 150) return '轻度污染'
  if (aqi <= 200) return '中度污染'
  return '重度污染'
}

function aqiBreakdown(aqi: number) {
  // 基于 AQI 近似拆分各污染物浓度
  const ratio = aqi / 100
  return {
    pm25: clamp(Math.round(ratio * 55 + jitter(0, 8)), 5, 200),
    pm10: clamp(Math.round(ratio * 85 + jitter(0, 12)), 10, 300),
    o3: clamp(Math.round(40 + ratio * 60 + jitter(0, 10)), 10, 200),
    no2: clamp(Math.round(20 + ratio * 30 + jitter(0, 5)), 5, 100),
    so2: clamp(Math.round(8 + ratio * 15 + jitter(0, 3)), 2, 80),
    co: parseFloat((0.5 + ratio * 1.0 + jitter(0, 0.2)).toFixed(1)),
  }
}

// ============================================================
// 导出函数 — 实时数据
// ============================================================

let _rtState: RealtimeData | null = null

export function generateRealtimeData(): RealtimeData {
  const now = dayjs()
  const hour = now.hour()
  const minute = now.minute()
  const scene = getDailyScene()

  const temperature = parseFloat(jitter(tempCurve(hour, minute), 0.3).toFixed(1))
  const humidity = clamp(Math.round(jitter(humidityCurve(hour, scene), 2)), 30, 98)
  const windSpeed = clamp(parseFloat(jitter(windCurve(hour, scene), 0.5).toFixed(1)), 0, 18)
  const windDirection = _rtState?.windDirection || randomPick<WindDirection>(['南风', '东南风', '东风', '西南风'])
  const pressure = parseFloat(jitter(CLIMATE.pressureBase + scene.pressureOffset, 0.3).toFixed(1))
  const precipitation = scene.rainFactor > 0.3
    ? clamp(parseFloat(jitter(scene.rainFactor * 12, 3).toFixed(1)), 0, 50)
    : 0
  const visibility = visibilityCurve(hour, humidity, scene)
  const uvIndex = uvCurve(hour, scene)
  const aqi = aqiModel(hour, windSpeed, scene)
  const aqiParts = aqiBreakdown(aqi)

  _rtState = {
    temperature,
    humidity,
    windSpeed,
    windDirection,
    pressure,
    precipitation,
    visibility,
    uvIndex,
    airQuality: {
      aqi,
      level: aqiLevel(aqi),
      ...aqiParts,
    }
  }
  return _rtState
}

// ============================================================
// 导出函数 — 7 天预报
// ============================================================

let _forecastState: ForecastData[] | null = null

// 生成天气序列：相邻天气有转移概率（晴→多云概率高，晴→暴雨概率极低）
function weatherSequence(): WeatherType[] {
  const types: WeatherType[] = ['sunny', 'cloudy', 'overcast', 'rain', 'heavyRain', 'thunderstorm']
  // 转移矩阵（行=当前，列=下一状态，归一化后使用）
  const transitions: Record<WeatherType, Record<WeatherType, number>> = {
    sunny:      { sunny: 0.50, cloudy: 0.30, overcast: 0.12, rain: 0.05, heavyRain: 0.02, thunderstorm: 0.01, snow: 0, fog: 0 },
    cloudy:     { sunny: 0.25, cloudy: 0.35, overcast: 0.20, rain: 0.12, heavyRain: 0.05, thunderstorm: 0.03, snow: 0, fog: 0 },
    overcast:   { sunny: 0.10, cloudy: 0.25, overcast: 0.30, rain: 0.20, heavyRain: 0.10, thunderstorm: 0.05, snow: 0, fog: 0 },
    rain:       { sunny: 0.08, cloudy: 0.15, overcast: 0.25, rain: 0.30, heavyRain: 0.15, thunderstorm: 0.07, snow: 0, fog: 0 },
    heavyRain:  { sunny: 0.05, cloudy: 0.10, overcast: 0.20, rain: 0.30, heavyRain: 0.25, thunderstorm: 0.10, snow: 0, fog: 0 },
    thunderstorm:{ sunny: 0.10, cloudy: 0.20, overcast: 0.25, rain: 0.25, heavyRain: 0.12, thunderstorm: 0.08, snow: 0, fog: 0 },
    snow:       { sunny: 0.10, cloudy: 0.20, overcast: 0.30, rain: 0.15, heavyRain: 0.05, thunderstorm: 0.02, snow: 0.18, fog: 0 },
    fog:        { sunny: 0.15, cloudy: 0.30, overcast: 0.30, rain: 0.10, heavyRain: 0.05, thunderstorm: 0.02, snow: 0, fog: 0.08 },
  }

  const result: WeatherType[] = []
  // 首日基于当日场景
  let current = getDailyScene().type
  result.push(current)

  for (let i = 1; i < 7; i++) {
    const probs = transitions[current]
    const entries = Object.entries(probs).filter(([, p]) => p > 0) as [WeatherType, number][]
    const totalP = entries.reduce((s, [, p]) => s + p, 0)
    let roll = Math.random() * totalP
    for (const [type, prob] of entries) {
      roll -= prob
      if (roll <= 0) { current = type; break }
    }
    result.push(current)
  }
  return result
}

export function generateForecastData(): ForecastData[] {
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const windDirections: WindDirection[] = ['东风', '南风', '西风', '北风', '东北风', '西南风']

  if (!_forecastState) {
    const sequence = weatherSequence()
    // 基准高温在 30°C 附近，相邻日温差 ≤ 3°C
    let prevHigh = random(28, 34)
    let prevLow = prevHigh - random(10, 14)

    _forecastState = sequence.map((weather, i) => {
      const date = dayjs().add(i, 'day')
      // 相邻日温度连续变化
      const high = clamp(prevHigh + random(-2, 2), 22, 38)
      const low = clamp(prevLow + random(-1, 1), 14, 26)
      prevHigh = high
      prevLow = low

      const isRainy = weather === 'rain' || weather === 'heavyRain' || weather === 'thunderstorm'
      const windDir = randomPick(windDirections)

      return {
        date: date.format('MM/DD'),
        dayOfWeek: i === 0 ? '今天' : i === 1 ? '明天' : dayNames[date.day()],
        weather,
        weatherText: weatherTexts[weather],
        tempHigh: high,
        tempLow: low,
        humidity: isRainy ? random(70, 90) : random(40, 65),
        windSpeed: isRainy ? randomFloat(4, 10) : randomFloat(2, 6),
        windDirection: windDir,
        precipitation: isRainy ? randomFloat(5, 40) : 0,
        precipitationProb: isRainy ? random(60, 90) : random(5, 25),
        sunrise: '05:' + random(12, 28).toString().padStart(2, '0'),
        sunset: '19:' + random(20, 42).toString().padStart(2, '0')
      }
    })
  } else {
    // 后续轮询：温度随实时时辰平滑更新，天气类型不变
    _forecastState = _forecastState.map((item, i) => {
      const date = dayjs().add(i, 'day')
      return {
        ...item,
        date: date.format('MM/DD'),
        dayOfWeek: i === 0 ? '今天' : i === 1 ? '明天' : dayNames[date.day()],
        tempHigh: i === 0 ? _rtState?.temperature ?? item.tempHigh : item.tempHigh,
        tempLow: i === 0 ? parseFloat((item.tempLow + jitter(0, 0.2)).toFixed(1)) : item.tempLow,
        humidity: i === 0 ? (_rtState?.humidity ?? item.humidity) : item.humidity,
        windSpeed: i === 0 ? (_rtState?.windSpeed ?? item.windSpeed) : item.windSpeed,
      }
    })
  }
  return _forecastState
}

// ============================================================
// 导出函数 — 预警数据（稳定池，与当日天气场景联动）
// ============================================================

const WARNING_REGIONS = ['全市', '朝阳区', '海淀区', '丰台区', '通州区', '大兴区', '昌平区']
let _warningPool: WarningData[] | null = null
let _warningSeq = 0

function createWarning(type: WarningType, level: WarningLevel, region: string, hoursAgo: number, expireIn: number): WarningData {
  _warningSeq++
  const now = dayjs()
  return {
    id: `W${String(_warningSeq).padStart(4, '0')}`,
    type,
    level,
    title: `${type}${level === 'red' ? '红色' : level === 'orange' ? '橙色' : level === 'yellow' ? '黄色' : '蓝色'}预警`,
    content: `预计未来${expireIn}小时内，${region}将出现${type}天气，请注意防范。`,
    publishTime: now.subtract(hoursAgo, 'hour').format('YYYY-MM-DD HH:mm'),
    effectiveTime: now.subtract(hoursAgo - 1, 'hour').format('YYYY-MM-DD HH:mm'),
    expireTime: now.add(expireIn, 'hour').format('YYYY-MM-DD HH:mm'),
    region
  }
}

export function generateWarningData(): WarningData[] {
  const scene = getDailyScene()

  if (!_warningPool) {
    // 首次：根据当日天气场景生成合理的初始预警
    _warningPool = []
    if (scene.type === 'heavyRain' || scene.type === 'thunderstorm') {
      _warningPool.push(createWarning('暴雨', 'orange', '全市', 3, 6))
      _warningPool.push(createWarning('雷电', 'yellow', '海淀区', 2, 4))
    } else if (scene.type === 'rain') {
      _warningPool.push(createWarning('暴雨', 'blue', '丰台区', 4, 8))
    } else if (scene.type === 'sunny' && CLIMATE.tempDayHigh > 35) {
      _warningPool.push(createWarning('高温', 'yellow', '全市', 6, 12))
    } else {
      // 一般天气：1-2 条低级别预警
      _warningPool.push(createWarning('大风', 'blue', '通州区', 5, 10))
    }
  } else {
    // 后续轮询：模拟预警生命周期
    const now = dayjs()

    // 移除已过期的预警
    _warningPool = _warningPool.filter(w => {
      const expire = dayjs(w.expireTime, 'YYYY-MM-DD HH:mm')
      return expire.isAfter(now)
    })

    // 小概率新增预警（模拟突发天气事件）
    if (Math.random() < 0.08 && _warningPool.length < 5) {
      const possibleTypes: WarningType[] = scene.rainFactor > 0.3 ? ['暴雨', '雷电', '大风'] : ['高温', '大风', '大雾']
      const type = randomPick(possibleTypes)
      const level = randomPick<WarningLevel>(['blue', 'yellow'])
      _warningPool.push(createWarning(type, level, randomPick(WARNING_REGIONS), 0, random(4, 12)))
    }
  }
  return [..._warningPool]
}

// ============================================================
// 导出函数 — 站点数据（各站基于地理位置微差）
// ============================================================

const STATION_BASES = [
  { id: 'S001', name: '北京站',   lat: 39.9042, lng: 116.4074, tempOffset: 0 },
  { id: 'S002', name: '海淀站',   lat: 39.9592, lng: 116.3261, tempOffset: -0.3 },
  { id: 'S003', name: '朝阳站',   lat: 39.9215, lng: 116.4435, tempOffset: 0.2 },
  { id: 'S004', name: '丰台站',   lat: 39.8585, lng: 116.2860, tempOffset: 0.4 },
  { id: 'S005', name: '通州站',   lat: 39.9046, lng: 116.6563, tempOffset: 0.5 },
  { id: 'S006', name: '大兴站',   lat: 39.7269, lng: 116.3380, tempOffset: 0.8 },
  { id: 'S007', name: '昌平站',   lat: 40.2181, lng: 116.2298, tempOffset: -1.2 },
  { id: 'S008', name: '顺义站',   lat: 40.1281, lng: 116.6544, tempOffset: -0.5 },
  { id: 'S009', name: '房山站',   lat: 39.7486, lng: 116.1430, tempOffset: 0.6 },
  { id: 'S010', name: '门头沟站', lat: 39.9374, lng: 116.1062, tempOffset: -0.8 },
]
let _stationState: StationData[] | null = null

export function generateStationData(): StationData[] {
  const now = dayjs()
  const hour = now.hour()
  const scene = getDailyScene()
  const baseTemp = tempCurve(hour)

  _stationState = STATION_BASES.map(s => {
    // 纬度越高温度越低（约 -0.6°C / 0.1°纬度），城区热岛效应 +0.5°C
    const stationTemp = parseFloat((baseTemp + s.tempOffset + jitter(0, 0.3)).toFixed(1))
    const stationHumidity = clamp(Math.round(humidityCurve(hour, scene) + jitter(0, 5)), 30, 98)
    const stationWind = clamp(parseFloat(jitter(windCurve(hour, scene), 1).toFixed(1)), 0, 15)
    return {
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      temperature: stationTemp,
      humidity: stationHumidity,
      windSpeed: stationWind,
      weather: scene.type,
      weatherText: weatherTexts[scene.type],
    }
  })
  return _stationState
}

// ============================================================
// 导出函数 — 雷达回波（回波团缓慢移动，强度随场景变化）
// ============================================================

let _radarState: RadarData[] | null = null
let _radarDrift = 0

export function generateRadarData(): RadarData[] {
  const scene = getDailyScene()
  const centerLat = 39.9042
  const centerLng = 116.4074

  if (!_radarState) {
    const data: RadarData[] = []
    const clusters = scene.rainFactor > 0.3 ? random(4, 8) : random(2, 4)

    for (let c = 0; c < clusters; c++) {
      const clusterLat = centerLat + randomFloat(-0.35, 0.35)
      const clusterLng = centerLng + randomFloat(-0.45, 0.45)
      const clusterSize = random(5, 15)
      const baseIntensity = scene.rainFactor > 0.5 ? 0.4 + Math.random() * 0.5 : 0.1 + Math.random() * 0.5

      for (let i = 0; i < clusterSize; i++) {
        const intensity = clamp(baseIntensity + jitter(0, 0.15), 0.05, 1)
        let type: RadarData['type'] = 'light'
        if (intensity > 0.75) type = 'extreme'
        else if (intensity > 0.5) type = 'heavy'
        else if (intensity > 0.25) type = 'moderate'

        data.push({
          lat: clusterLat + randomFloat(-0.05, 0.05),
          lng: clusterLng + randomFloat(-0.05, 0.05),
          intensity: parseFloat(intensity.toFixed(2)),
          type
        })
      }
    }
    _radarState = data
  } else {
    // 回波团缓慢东移（模拟天气系统移动），强度随场景衰减/增强
    _radarDrift += 0.002 // 每次轮询东移约 200m
    const intensityTrend = scene.rainFactor > 0.3 ? 0.02 : -0.03 // 雨天增强，晴天消散

    _radarState = _radarState.map(item => {
      const newIntensity = clamp(item.intensity + intensityTrend + jitter(0, 0.03), 0.05, 1)
      let type: RadarData['type'] = 'light'
      if (newIntensity > 0.75) type = 'extreme'
      else if (newIntensity > 0.5) type = 'heavy'
      else if (newIntensity > 0.25) type = 'moderate'

      return {
        lat: item.lat,
        lng: item.lng + _radarDrift * (Math.random() * 0.5 + 0.5),
        intensity: parseFloat(newIntensity.toFixed(2)),
        type
      }
    })
  }
  return _radarState
}

// ============================================================
// 导出函数 — 24h 温度曲线（与实时数据联动）
// ============================================================

export function generateHourlyTemp(): { hour: string; temp: number }[] {
  const scene = getDailyScene()
  const data: { hour: string; temp: number }[] = []

  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00'
    const temp = parseFloat(tempCurve(i).toFixed(1))
    data.push({ hour, temp })
  }
  return data
}

// ============================================================
// 导出函数 — 风玫瑰图（当日主风向频率最高）
// ============================================================

let _windRoseState: { direction: string; speed: number; frequency: number }[] | null = null

export function generateWindRoseData(): { direction: string; speed: number; frequency: number }[] {
  const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北']

  if (!_windRoseState) {
    // 主风向（与 windDirection 对应）频率最高
    const mainDir = _rtState?.windDirection?.replace('风', '') || '南'
    _windRoseState = directions.map(dir => {
      const isMain = dir === mainDir
      return {
        direction: dir,
        speed: isMain ? randomFloat(5, 10) : randomFloat(1, 5),
        frequency: isMain ? random(20, 35) : random(3, 12),
      }
    })
  } else {
    // 微调：主风向保持高频，其余小幅波动
    _windRoseState = _windRoseState.map(item => ({
      direction: item.direction,
      speed: parseFloat(jitter(item.speed, 0.3).toFixed(1)),
      frequency: clamp(Math.round(jitter(item.frequency, 1)), 2, 40),
    }))
  }
  return _windRoseState
}

// ============================================================
// 导出函数 — 降水数据（与场景联动）
// ============================================================

export function generatePrecipitationData(): { time: string; value: number }[] {
  const scene = getDailyScene()
  const data: { time: string; value: number }[] = []

  // 降水集中在下午~傍晚（对流性降水典型时段）
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '0') + ':00'
    let value = 0
    if (scene.rainFactor > 0.3) {
      if (i >= 13 && i <= 19) {
        // 降水高峰
        value = parseFloat((scene.rainFactor * randomFloat(3, 15)).toFixed(1))
      } else if (i >= 10 && i <= 21) {
        // 零星降水
        value = parseFloat((scene.rainFactor * randomFloat(0, 4)).toFixed(1))
      }
    }
    data.push({ time: hour, value })
  }
  return data
}

// ============================================================
// AI 对话（保持不变）
// ============================================================

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

export function getAiResponse(question: string): string {
  const lowerQ = question.toLowerCase()

  for (const [key, value] of Object.entries(aiResponses)) {
    if (key !== 'default' && lowerQ.includes(key.toLowerCase())) {
      return value
    }
  }

  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '重庆', '天津', '苏州']
  for (const city of cities) {
    if (lowerQ.includes(city)) {
      return `${city}今天天气晴朗，气温${random(22, 35)}°C，${randomPick(['东风', '南风', '西风', '北风'])}${random(2, 5)}级，空气质量${randomPick(['优', '良'])}。祝您生活愉快！`
    }
  }

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
