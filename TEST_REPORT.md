# 验证记录

验证日期：2026-09-22。

## 范围

已在本地 Chromium 对同一套 HTML/CSS/JS 做浏览器渲染与交互测试。为适配运行环境，浏览器测试使用 CSS/JS 与实际方法图内联后的页面；原始源码的本地资源路径另行进行存在性检查。

视频共同播放等功能使用独立的本地测试图案录像验证，该录像没有作为实验素材交付。测试中用于检验百分比和均值的临时数值也没有写入交付配置。

没有登录用户的新 GitHub 账号，没有创建仓库或代替用户上线，没有核实尚未提供的实验视频、结果和最终匿名稿。线上域名、部署结果与真实媒体兼容性需在发布后再次检查。

## 检查结果

共通过 33 项检查：

- PASS — Seven task cards and seven selector entries
- PASS — No fabricated table results
- PASS — Unconfigured paper and code buttons disabled
- PASS — Unconfigured playback controls disabled
- PASS — Gallery simulation switch
- PASS — All seven tasks and all baseline selections render
- PASS — Comparison simulation domain switch
- PASS — Task modal opens with matched title and two domains
- PASS — Task modal routes to corresponding comparison
- PASS — Method figure zoom loads real extracted image
- PASS — Escape closes dialog
- PASS — No page-level horizontal overflow at 360px
- PASS — No page-level horizontal overflow at 390px
- PASS — No page-level horizontal overflow at 768px
- PASS — No page-level horizontal overflow at 1024px
- PASS — No page-level horizontal overflow at 1440px
- PASS — Mobile menu opens
- PASS — Mobile menu closes
- PASS — No JavaScript errors in default interaction tests
- PASS — No external requests in inline rendering
- PASS — Real video elements load the local playback fixture
- PASS — Play together starts both video elements
- PASS — Pause all pauses both video elements
- PASS — Shared playback speed
- PASS — Restart resets both players
- PASS — Zero observed successes renders as 0%, not missing
- PASS — Macro mean computes only after all task results exist
- PASS — Unreported baseline means remain missing
- PASS — Index check passes for shipped files
- PASS — Indexer detects new file not yet indexed
- PASS — Indexer writes exact relative video path
- PASS — Strict check detects missing remaining task videos
- PASS — Indexer rejects invalid trial counts

## 交付默认数据

7 个任务，5 个方法（含本方法），35 个结果单元均为 null。实际实验视频数为 0。Paper / Code 链接未启用。两张方法图来自提供的稿件第 17 页。

`python3 tools/prepare.py --check` 已通过。`--strict` 在本交付中应当失败，因为未提供 7 条本方法真机录像；这不是前端运行错误。
