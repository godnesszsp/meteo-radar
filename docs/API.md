# MeteoRadar API 接口文档

本文档定义了 MeteoRadar 系统的数据接口规范，用于前后端对接。

## 目录

- [接口规范](#接口规范)
- [数据模型](#数据模型)
- [气象数据接口](#气象数据接口)
- [预警信息接口](#预警信息接口)
- [AI对话接口](#ai对话接口)
- [错误码说明](#错误码说明)

## 接口规范

### 请求格式

- **协议**: HTTPS
- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

### 请求头

```http
Content-Type: application/json
Authorization: Bearer <token>
X-Request-ID: <uuid>
```

### 响应格式

```typescript
interface ApiResponse<T> {
  code: number        // 状态码
  message: string     // 提示信息
  data: T            // 响应数据
  timestamp: number  // 时间戳
}
```

### 分页响应

```typescript
interface PaginatedResponse<T> {
  code: number
  message: string
  data: {
    list: T[]         // 数据列表
    total: number     // 总数
    page: number      // 当前页
    pageSize: number  // 每页数量
  }
  timestamp: number
}
```

## 数据模型

### 天气类型

```typescript
type WeatherType = 
  | 'sunny'        // 晴
  | 'cloudy'       // 多云
  | 'overcast'     // 阴
  | 'rain'         // 小雨
  | 'heavyRain'    // 大雨
  | 'thunderstorm' // 雷阵雨
  | 'snow'         // 雪
  | 'fog'          // 雾
```

### 风向

```typescript
type WindDirection = 
  | '北风' | '东北风' | '东风' | '东南风'
  | '南风' | '西南风' | '西风' | '西北风'
```

### 预警级别

```typescript
type WarningLevel = 'blue' | 'yellow' | 'orange' | 'red'
```

### 预警类型

```typescript
type WarningType = 
  | '暴雨' | '高温' | '寒潮' | '大风'
  | '雷电' | '冰雹' | '暴雪' | '大雾'
```

### 实时数据

```typescript
interface RealtimeData {
  temperature: number      // 温度 (°C)
  humidity: number         // 湿度 (%)
  windSpeed: number        // 风速 (m/s)
  windDirection: WindDirection  // 风向
  pressure: number         // 气压 (hPa)
  precipitation: number    // 降水量 (mm)
  visibility: number       // 能见度 (km)
  uvIndex: number          // 紫外线指数
  airQuality: AirQuality   // 空气质量
  updateTime: string       // 更新时间
}

interface AirQuality {
  aqi: number              // AQI指数
  level: string            // 等级
  pm25: number             // PM2.5 (μg/m³)
  pm10: number             // PM10 (μg/m³)
  o3: number               // 臭氧 (μg/m³)
  no2: number              // 二氧化氮 (μg/m³)
  so2: number              // 二氧化硫 (μg/m³)
  co: number               // 一氧化碳 (mg/m³)
}
```

### 预测数据

```typescript
interface ForecastData {
  date: string             // 日期 (MM/DD)
  dayOfWeek: string        // 星期
  weather: WeatherType     // 天气类型
  weatherText: string      // 天气描述
  tempHigh: number         // 最高温度 (°C)
  tempLow: number          // 最低温度 (°C)
  humidity: number         // 湿度 (%)
  windSpeed: number        // 风速 (m/s)
  windDirection: WindDirection  // 风向
  precipitation: number    // 降水量 (mm)
  precipitationProb: number // 降水概率 (%)
  sunrise: string          // 日出时间
  sunset: string           // 日落时间
}
```

### 预警数据

```typescript
interface WarningData {
  id: string               // 预警ID
  type: WarningType        // 预警类型
  level: WarningLevel      // 预警级别
  title: string            // 预警标题
  content: string          // 预警内容
  publishTime: string      // 发布时间
  effectiveTime: string    // 生效时间
  expireTime: string       // 失效时间
  region: string           // 影响区域
  status: 'active' | 'expired' | 'cancelled'  // 状态
}
```

### 站点数据

```typescript
interface StationData {
  id: string               // 站点ID
  name: string             // 站点名称
  lat: number              // 纬度
  lng: number              // 经度
  altitude: number         // 海拔 (m)
  temperature: number      // 温度 (°C)
  humidity: number         // 湿度 (%)
  windSpeed: number        // 风速 (m/s)
  weather: WeatherType     // 天气类型
  weatherText: string      // 天气描述
  updateTime: string       // 更新时间
}
```

### 雷达数据

```typescript
interface RadarData {
  lat: number              // 纬度
  lng: number              // 经度
  intensity: number        // 强度 (0-1)
  type: 'light' | 'moderate' | 'heavy' | 'extreme'
  time: string             // 观测时间
}
```

## 气象数据接口

### 获取实时气象数据

**请求**

```http
GET /api/v1/weather/realtime
```

**参数**

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| lat | number | 是 | 纬度 |
| lng | number | 是 | 经度 |
| stationId | string | 否 | 站点ID |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "temperature": 28.5,
    "humidity": 65,
    "windSpeed": 3.2,
    "windDirection": "东南风",
    "pressure": 1013.2,
    "precipitation": 0,
    "visibility": 15,
    "uvIndex": 6,
    "airQuality": {
      "aqi": 68,
      "level": "良",
      "pm25": 48,
      "pm10": 85,
      "o3": 82,
      "no2": 35,
      "so2": 12,
      "co": 0.8
    },
    "updateTime": "2024-01-20T10:30:00Z"
  },
  "timestamp": 1705741800000
}
```

### 获取天气预测

**请求**

```http
GET /api/v1/weather/forecast
```

**参数**

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| lat | number | 是 | 纬度 |
| lng | number | 是 | 经度 |
| days | number | 否 | 预测天数 (1-7, 默认7) |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "date": "01/20",
      "dayOfWeek": "今天",
      "weather": "sunny",
      "weatherText": "晴",
      "tempHigh": 32,
      "tempLow": 22,
      "humidity": 55,
      "windSpeed": 3.5,
      "windDirection": "东风",
      "precipitation": 0,
      "precipitationProb": 10,
      "sunrise": "05:25",
      "sunset": "19:15"
    }
    // ... 更多天数
  ],
  "timestamp": 1705741800000
}
```

### 获取24小时温度

**请求**

```http
GET /api/v1/weather/hourly
```

**参数**

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| lat | number | 是 | 纬度 |
| lng | number | 是 | 经度 |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "hour": "00:00",
      "temp": 22.5,
      "humidity": 65,
      "precipitation": 0
    }
    // ... 24小时数据
  ],
  "timestamp": 1705741800000
}
```

## 预警信息接口

### 获取预警列表

**请求**

```http
GET /api/v1/warnings
```

**参数**

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| region | string | 否 | 区域 |
| level | string | 否 | 级别筛选 |
| status | string | 否 | 状态筛选 |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": "W20240120001",
        "type": "暴雨",
        "level": "yellow",
        "title": "暴雨黄色预警",
        "content": "预计未来6小时内将出现暴雨天气...",
        "publishTime": "2024-01-20T08:00:00Z",
        "effectiveTime": "2024-01-20T08:00:00Z",
        "expireTime": "2024-01-20T20:00:00Z",
        "region": "全市",
        "status": "active"
      }
    ],
    "total": 3,
    "page": 1,
    "pageSize": 10
  },
  "timestamp": 1705741800000
}
```

### 获取预警详情

**请求**

```http
GET /api/v1/warnings/:id
```

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "W20240120001",
    "type": "暴雨",
    "level": "yellow",
    "title": "暴雨黄色预警",
    "content": "预计未来6小时内将出现暴雨天气，请注意防范。",
    "publishTime": "2024-01-20T08:00:00Z",
    "effectiveTime": "2024-01-20T08:00:00Z",
    "expireTime": "2024-01-20T20:00:00Z",
    "region": "全市",
    "status": "active"
  },
  "timestamp": 1705741800000
}
```

## 站点数据接口

### 获取站点列表

**请求**

```http
GET /api/v1/stations
```

**参数**

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| bounds | string | 否 | 地图边界 (lat1,lng1,lat2,lng2) |
| type | string | 否 | 站点类型 |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "S001",
      "name": "北京站",
      "lat": 39.9042,
      "lng": 116.4074,
      "altitude": 43,
      "temperature": 28.5,
      "humidity": 65,
      "windSpeed": 3.2,
      "weather": "sunny",
      "weatherText": "晴",
      "updateTime": "2024-01-20T10:30:00Z"
    }
  ],
  "timestamp": 1705741800000
}
```

### 获取雷达回波数据

**请求**

```http
GET /api/v1/radar
```

**参数**

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| bounds | string | 是 | 地图边界 |
| time | string | 否 | 时间点 (ISO 8601) |

**响应**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "lat": 39.95,
      "lng": 116.45,
      "intensity": 0.75,
      "type": "heavy",
      "time": "2024-01-20T10:30:00Z"
    }
  ],
  "timestamp": 1705741800000
}
```

## AI对话接口

### 发送对话消息

**请求**

```http
POST /api/v1/ai/chat
```

**请求体**

```json
{
  "message": "北京今天天气怎么样？",
  "sessionId": "session-123",
  "context": []
}
```

**响应 (普通)**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "reply": "北京今天天气晴朗，气温28°C...",
    "sessionId": "session-123",
    "timestamp": "2024-01-20T10:30:00Z"
  },
  "timestamp": 1705741800000
}
```

**响应 (流式 SSE)**

```http
Content-Type: text/event-stream

data: {"type":"start","sessionId":"session-123"}

data: {"type":"content","content":"北京"}

data: {"type":"content","content":"今天"}

data: {"type":"content","content":"天气"}

data: {"type":"end","sessionId":"session-123"}
```

### 获取对话历史

**请求**

```http
GET /api/v1/ai/history
```

**参数**

| 参数 | 类型 | 必选 | 说明 |
|------|------|------|------|
| sessionId | string | 是 | 会话ID |
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页数量 |

## 错误码说明

| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 200 | 成功 | - |
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | 检查认证信息 |
| 403 | 禁止访问 | 检查权限 |
| 404 | 资源不存在 | 检查请求路径 |
| 429 | 请求过于频繁 | 降低请求频率 |
| 500 | 服务器内部错误 | 稍后重试 |
| 502 | 网关错误 | 稍后重试 |
| 503 | 服务不可用 | 稍后重试 |

### 错误响应格式

```json
{
  "code": 400,
  "message": "参数错误：lat 不能为空",
  "data": null,
  "timestamp": 1705741800000,
  "error": {
    "field": "lat",
    "type": "required"
  }
}
```

## Mock 数据说明

当前项目使用 Mock 数据进行开发，数据定义在 `src/mock/weather.ts` 文件中。

### Mock 数据生成

```typescript
// 生成实时数据
import { generateRealtimeData } from '@/mock/weather'

const data = generateRealtimeData()
```

### 切换 Mock / 真实接口

在环境变量中配置：

```env
# .env.development
VITE_USE_MOCK=true

# .env.production
VITE_USE_MOCK=false
```

```typescript
// src/api/request.ts
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export async function getRealtimeData() {
  if (useMock) {
    return generateRealtimeData()
  }
  return request.get('/api/v1/weather/realtime')
}
```

---

如有问题，请提交 [Issue](https://github.com/godnesszsp/meteo-radar/issues)。
