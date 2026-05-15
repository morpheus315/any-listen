# Changelog

## v0.9.1 (2026-05-15)

### 优化
- 重新设计缓存清理页面：按钮右对齐、等宽，数量为 0 时禁用而非隐藏
- 从缓存页面移除不喜欢列表（已有独立管理界面）
- 开发模式下启用更新检测，新增手动检查更新按钮

### 修复
- 修复开发模式下更新检测不运行的问题
- 修复 CI 发布步骤在 Windows runner 上误用 PowerShell 的问题

## v0.9.0 (2026-05-15)

### 数据库重构

- **歌曲 ID 统一编码**：所有持久化存储的歌曲 ID 加入 source 前缀（如 `gd-netease_1311134197`），避免网易云、酷我、QQ 等不同音源之间歌曲 ID 碰撞。涉及 `my_list_music_info`、`music_url`、`lyric`、`play_list_music_info` 四张表及 localStorage 缓存
- **music_url 表新增 quality 列**：存储 API 返回的实际音质（如 `flac24bit`），命中缓存时返回真实音质而非用户请求的音质
- **buildSongId** 幂等编码函数：在线歌曲 `{source}_{id}`，本地歌曲保持原始 ID，重复调用不叠加前缀

### 音质标签修复

- 修复音质标签始终显示用户请求值（如 `320k`）而非 API 实际返回值的问题
- 修复网易云等源返回未知 br 值（如 1230）时兜底为 `128k` 的问题，现在显示为 `1230Kbps` 格式
- 重写 `qualityLabels.svelte.ts`，使用普通对象 `$state` 替代 Map，确保 Svelte 5 跨模块反应式更新可靠
- `ListItem.svelte` 中 `$derived.by` 自动响应缓存变更，移除 Library 的手动版本号 workaround
- 添加音质解析全链路调试日志：`[gdstudio]` API 请求/响应 → `[musicUrl]` 缓存命中/未命中 → `[renderer]` 写缓存

### 缓存清理扩展

设置 → 歌曲元信息缓存页面新增独立清理按钮和「清理所有缓存」按钮：

| 清理项 | 存储位置 |
|---|---|
| 歌曲 URL 缓存 | `music_url` 表 |
| 歌词缓存 | `lyric` 表（raw 类型） |
| 音质标签 | localStorage |
| 歌曲元信息 | localStorage |
| 其他源信息 | `music_info_other_source` 表 |
| 不喜欢列表 | `dislike_list` 表 |
| 播放统计 | `play_count` 表 |
| 下载列表 | `download_list` 表 |

### 更新检测改进

- 去除开发模式下更新检测限制，dev 环境同样可用
- 设置中新增「手动检查更新」按钮
- 添加更新检测全链路调试日志
- CI 构建时从 git tag 自动提取版本号和更新日志生成 `version.json`
- 发布前自动删除同名 Release 避免新旧产物残留

### 其他优化

- 搜索结果在 API 超时或出错时保留上次结果，不清空列表
- 版本更新源改为 `morpheus315/any-listen`，仅保留 GitHub raw 及 jsDelivr 镜像
- 清理所有旧数据迁移代码（项目尚未正式发布）
