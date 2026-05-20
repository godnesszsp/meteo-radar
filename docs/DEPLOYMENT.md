# MeteoRadar 部署指南

本文档提供 MeteoRadar 项目的多种部署方案。

## 目录

- [环境要求](#环境要求)
- [本地构建](#本地构建)
- [静态部署](#静态部署)
- [Docker部署](#docker部署)
- [Nginx配置](#nginx配置)
- [CI/CD部署](#cicd部署)
- [生产环境优化](#生产环境优化)

## 环境要求

### 开发环境

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **pnpm**: >= 8.0.0
- **操作系统**: Windows 10+, macOS 10.15+, Linux

### 生产环境

- **Web服务器**: Nginx, Apache, Caddy
- **容器**: Docker (可选)
- **CDN**: 推荐使用CDN加速

## 本地构建

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm (推荐)
pnpm install
```

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 pnpm
pnpm build
```

构建产物将输出到 `dist` 目录。

### 预览构建结果

```bash
# 使用 npm
npm run preview

# 或使用 pnpm
pnpm preview
```

## 静态部署

### 部署到任意静态服务器

将 `dist` 目录部署到任意静态文件服务器即可。

```
dist/
├── assets/
│   ├── css/
│   ├── js/
│   └── fonts/
├── favicon.ico
└── index.html
```

### 部署到 GitHub Pages

1. 在 `package.json` 中添加部署脚本：

```json
{
  "scripts": {
    "deploy:gh": "npm run build && gh-pages -d dist"
  }
}
```

2. 安装 gh-pages：

```bash
npm install -D gh-pages
```

3. 执行部署：

```bash
npm run deploy:gh
```

### 部署到 Vercel

1. 安装 Vercel CLI：

```bash
npm i -g vercel
```

2. 部署：

```bash
vercel
```

### 部署到 Netlify

1. 在 Netlify 中连接 GitHub 仓库
2. 设置构建命令：`npm run build`
3. 设置发布目录：`dist`

## Docker部署

### Dockerfile

创建 `Dockerfile`：

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx 配置

创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/rss+xml
        image/svg+xml;
    
    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

### 构建和运行

```bash
# 构建镜像
docker build -t meteo-radar .

# 运行容器
docker run -d -p 80:80 meteo-radar

# 或使用 docker-compose
docker-compose up -d
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  meteo-radar:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

## Nginx配置

### 完整 Nginx 配置

```nginx
# /etc/nginx/conf.d/meteo-radar.conf

upstream meteo_radar_backend {
    # 如果有后端服务
    # server backend:3000;
}

server {
    listen 80;
    server_name meteo-radar.example.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name meteo-radar.example.com;
    
    root /var/www/meteo-radar;
    index index.html;
    
    # SSL 配置
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml application/rss+xml image/svg+xml;
    
    # 静态资源
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API 代理（如果有后端）
    location /api/ {
        proxy_pass http://meteo_radar_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
    
    # 错误页面
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

## CI/CD部署

### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### GitLab CI

创建 `.gitlab-ci.yml`：

```yaml
stages:
  - install
  - lint
  - build
  - deploy

cache:
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/

lint:
  stage: lint
  script:
    - npm run lint
  dependencies:
    - install

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
  dependencies:
    - install

deploy:
  stage: deploy
  script:
    - npm run build
    # 部署脚本
  only:
    - main
  dependencies:
    - install
```

## 生产环境优化

### 1. 开启 Gzip

确保服务器开启 Gzip 压缩，可减少 60-80% 的传输大小。

### 2. 配置缓存

```nginx
# 静态资源长期缓存
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

### 3. 使用 CDN

将静态资源部署到 CDN，减少服务器压力，加快访问速度。

### 4. 开启 HTTP/2

```nginx
listen 443 ssl http2;
```

### 5. 配置预加载

```html
<link rel="preload" href="/assets/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://cdn.example.com">
```

### 6. 监控和日志

配置访问日志和错误日志，便于问题排查：

```nginx
access_log /var/log/nginx/meteo-radar.access.log;
error_log /var/log/nginx/meteo-radar.error.log;
```

## 常见问题

### 1. 刷新页面 404

确保配置了 SPA 路由回退：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. 静态资源加载失败

检查 `base` 配置是否正确：

```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // 或你的子路径，如 '/meteo-radar/'
})
```

### 3. 跨域问题

配置代理或 CORS：

```nginx
# 代理配置
location /api/ {
    proxy_pass https://api.example.com/;
    add_header Access-Control-Allow-Origin *;
}
```

---

如有问题，请提交 [Issue](https://github.com/godnesszsp/meteo-radar/issues)。
