# PawPal 体验站设计文档

## 概述

为 PawPal 宠友圈创建 Web 体验站，部署于 Vercel，连接 Supabase 后端，集成 GLM 模型作为 AI 宠物匹配师。

## 决策记录

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 站点类型 | 交互式 Demo + AI Chat | 平衡展示价值与开发成本 |
| AI 角色 | 宠物社交 AI 匹配师 | 结合咨询与匹配推荐，展示核心价值 |
| Web 框架 | Next.js 15 (App Router) | Vercel 原生支持，API Routes 隐藏 Key |
| 设计风格 | 暗黑科技风 | 与移动端品牌一致 (#0A0A0A + #FF2D55) |

## 架构

```
┌─────────────────────────────────────────┐
│           Vercel (Next.js 15)           │
├─────────────────────────────────────────┤
│  Pages:                                 │
│  /           → Landing + Feature Demo   │
│  /chat       → AI 宠物匹配师            │
│  /api/chat   → GLM Proxy (隐藏Key)      │
├─────────────────────────────────────────┤
│  Supabase Client (读取宠物/视频数据)      │
│  GLM API (环境变量: GLM_API_KEY)         │
└─────────────────────────────────────────┘
```

**技术栈**:
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 4
- Framer Motion (动画)
- Supabase JS Client (复用移动端数据库)
- GLM API (通过 Next.js API Route 代理)

## 页面结构

### 首页 `/`

单页滚动式体验:

1. **Hero 区域** — 品牌标题 + 动态背景 + CTA "开始体验"
2. **功能展示区** — 3D 手机 mockup 展示视频流、匹配、聊天三大功能
3. **数据看板** — 从 Supabase 实时拉取统计（宠物数、匹配数、视频数）
4. **AI 体验入口** — 突出的 "AI 宠物匹配师" 入口卡片
5. **技术架构** — 展示技术栈图
6. **下载引导** — App Store / TestFlight 链接

### AI 聊天页 `/chat`

全屏对话界面:

- 左侧: 聊天对话（类 ChatGPT 界面）
- 右侧: AI 推荐的宠物匹配卡片（从 Supabase 拉取）
- 功能: 描述你的宠物 → AI 分析性格 → 推荐匹配对象 → 展示宠物卡片

## GLM 集成

```
用户输入 → /api/chat → GLM API → 返回流式响应
                ↕
        Supabase (查询宠物数据作为 context)
```

- API Route `/api/chat` 代理 GLM 请求
- Key 存于 `GLM_API_KEY` 环境变量
- System prompt 设定 AI 为 "PawPal 宠物匹配师" 角色
- 支持流式输出 (SSE)
- AI 可调用 Supabase 查询宠物数据，给出基于真实数据的推荐

## 项目结构

```
web/                              # 体验站 (Next.js)
├── app/
│   ├── layout.tsx                # Root layout (dark theme)
│   ├── page.tsx                  # Landing page
│   ├── chat/page.tsx             # AI chat page
│   └── api/chat/route.ts        # GLM proxy API
├── components/
│   ├── landing/                  # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── FeatureShowcase.tsx
│   │   ├── StatsBoard.tsx
│   │   ├── AIEntry.tsx
│   │   └── TechStack.tsx
│   ├── chat/                     # Chat components
│   │   ├── ChatPanel.tsx
│   │   ├── MessageBubble.tsx
│   │   └── PetRecommendCard.tsx
│   └── ui/                       # Shared UI
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── glm.ts                    # GLM API helper
├── tailwind.config.ts
├── .env.local                    # GLM_API_KEY, SUPABASE_*
└── package.json
```

放在现有项目的 `web/` 子目录，与移动端共存。

## 设计规范

| 属性 | 值 |
|------|-----|
| 背景色 | #0A0A0A |
| 主色调 | #FF2D55 |
| 辅助色 | #FF6B6B |
| 文字色 | #FFFFFF / #999999 |
| 圆角 | 12px / 16px |
| 字体 | Inter / system-ui |
| 动画 | Framer Motion, 流畅微交互 |

## 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
GLM_API_KEY=xxx           # 服务端专用，不暴露给前端
GLM_MODEL=glm-4-flash     # GLM 模型名称
```
