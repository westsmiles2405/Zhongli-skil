# 钟离工作陪伴 — 开发文档

## 架构

```
src/
├── extension.ts      # 主入口，注册 9 条命令
├── chatPanel.ts      # Webview 侧边栏（岩元素配色）
├── dynamicReply.ts   # 意图识别引擎（deep_sad 优先）
├── persona.ts        # 台词库：开场/工作/鼓励/安慰/典故/沏茶/胡桃
├── pomodoro.ts       # 番茄钟 (PomodoroPhase 三阶段)
├── idleWatcher.ts    # 闲置监测
└── stats.ts          # 每日统计
```

## 命令清单（9 条）

| ID | 标题 | 说明 |
|----|------|------|
| `zhongli.openStage` | 今日契约 | 开场白 |
| `zhongli.startPomodoro` | 开始番茄钟 | 启动专注 |
| `zhongli.stopPomodoro` | 结束番茄钟 | 手动停止 |
| `zhongli.encourageMe` | 给我打气 | 鼓励台词 |
| `zhongli.reviewWork` | 契约审判代码 | 代码诊断 |
| `zhongli.finale` | 今日收工 | 收尾辞 |
| `zhongli.lore` | 讲个璃月典故 | 独有：历史故事 |
| `zhongli.tea` | 沏一壶好茶 | 独有：沏茶放松 |
| `zhongli.hutao` | 聊聊胡桃 | 独有：胡桃彩蛋 |

## 构建

```bash
npm install
npm run compile
```

## 打包

```bash
npx @vscode/vsce package --allow-missing-repository
```
