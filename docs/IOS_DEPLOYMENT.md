# iOS 发布完整指南

## 前置要求

| 项目 | 说明 |
|------|------|
| Apple Developer 账号 | $99/年, [developer.apple.com](https://developer.apple.com) |
| EAS CLI | `npm install -g eas-cli` |
| Expo 账号 | `eas login` |

## 1. 配置 EAS

### 1.1 初始化 EAS 项目

```bash
eas init
```

### 1.2 配置 eas.json

更新 `eas.json` 中的 Apple Team ID 和 App Store Connect App ID：

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "你的App Store Connect App ID",
        "appleTeamId": "你的Apple Team ID"
      }
    }
  }
}
```

**获取 Apple Team ID：**
1. 登录 [developer.apple.com](https://developer.apple.com)
2. 进入 Account → Membership
3. 复制 Team ID

**获取 App Store Connect App ID：**
1. 登录 [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. 创建新 App (Bundle ID: `com.pawpal.app`)
3. 复制 Apple ID (数字)

## 2. 证书与描述文件

EAS 会自动管理证书。首次构建时会提示创建：

```bash
# EAS 自动创建并管理证书
eas build --platform ios --profile production
```

如需手动管理：
```bash
# 查看已有证书
eas credentials

# 清除证书重新生成
eas credentials --platform ios
```

## 3. 构建

### 3.1 开发构建 (Development)

```bash
# 用于开发调试，需安装 Development Client
eas build --platform ios --profile development
```

### 3.2 预览构建 (Ad-Hoc)

```bash
# 注册测试设备 UDID
eas device:create

# 构建 Ad-Hoc 版本
eas build --platform ios --profile preview
```

构建完成后，通过链接直接安装到已注册设备。

### 3.3 生产构建 (App Store)

```bash
eas build --platform ios --profile production
```

## 4. 提交到 App Store

### 4.1 通过 EAS Submit

```bash
# 提交最新构建到 TestFlight
eas submit --platform ios --profile production --latest

# 或指定构建 ID
eas submit --platform ios --profile production --id BUILD_ID
```

### 4.2 一键构建 + 提交

```bash
# 构建完成后自动提交
eas build --platform ios --profile production --auto-submit
```

## 5. TestFlight 测试

1. 构建提交后，等待 Apple 处理（通常 10-30 分钟）
2. 登录 [App Store Connect](https://appstoreconnect.apple.com)
3. 进入 App → TestFlight
4. 添加内部/外部测试员
5. 测试员通过 TestFlight App 安装测试

## 6. App Store 审核提交

### 6.1 准备素材

| 素材 | 规格 |
|------|------|
| App 图标 | 1024x1024 PNG (无透明) |
| 截图 (6.7") | 1290x2796 (iPhone 15 Pro Max) |
| 截图 (6.5") | 1284x2778 (iPhone 14 Plus) |
| 截图 (5.5") | 1242x2208 (iPhone 8 Plus) |
| App 描述 | 4000 字符以内 |
| 关键词 | 100 字符以内 |
| 隐私政策 URL | 必需 |

### 6.2 App Store 信息

```
App 名称: PawPal 宠友圈
副标题: 宠物社交，让毛孩子也有朋友圈
分类: 社交网络 / 生活
年龄分级: 4+
价格: 免费
```

### 6.3 提交审核

1. 在 App Store Connect 填写所有必需信息
2. 上传截图和预览视频
3. 填写审核备注（如需登录，提供测试账号）
4. 点击"提交审核"

### 6.4 审核注意事项

| 常见被拒原因 | 解决方案 |
|-------------|---------|
| 缺少隐私政策 | 添加隐私政策页面和 URL |
| UGC 缺少举报功能 | 实现内容举报/屏蔽功能 |
| 使用第三方登录但无 Apple Sign In | 添加 Apple Sign In |
| 权限描述不清晰 | 更新 info.plist 权限说明 |
| 崩溃或性能问题 | 充分测试后再提交 |

## 7. 版本更新

```bash
# 更新版本号（EAS 自动递增 buildNumber）
# 修改 app.json 中的 version 字段

# 构建 + 提交新版本
eas build --platform ios --profile production --auto-submit
```

## 8. 常用命令速查

```bash
# 登录
eas login

# 查看构建状态
eas build:list

# 查看提交状态
eas submit --platform ios --profile production --latest

# 注册测试设备
eas device:create

# 查看证书
eas credentials

# 更新 OTA (无需重新构建)
eas update --branch production --message "Bug fixes"
```
