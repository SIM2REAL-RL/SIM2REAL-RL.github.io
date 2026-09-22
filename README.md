# Sim2Real-RL 匿名论文网站

一套可直接发布到 GitHub Pages 的静态网页。英文前端，中文部署说明。无需 React、Node.js、npm、数据库或付费服务器。

页面包含首页仿真/真机展示、7 个任务卡片、4 个基线的并排比较、CFA/APC 方法图、成功率表格，以及可选的学习曲线。

**当前交付是真实可运行的前端，但不含实验录像和实验数值。没有的视频显示占位提示；未报告的结果显示 `—`，不是 0。网站还没有代你发布到 GitHub。**

## 1. 先预览

解压后打开本目录的 `index.html`。也可以在终端进入本目录，再运行：

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

然后在本机浏览器访问 `http://127.0.0.1:8000/`。这个命令只是本地预览，并不会发布网站；关闭终端服务后，本地服务器停止。

随交付另外提供的 `sim2real-rl-preview.html` 是单文件外观预览，不是需要上传的源码。正式部署使用本目录中的 `index.html` 和 `assets/`。

## 2. 文件在哪里

```text
sim2real-rl-site/
├── index.html                  # 网页结构、介绍文字
├── .nojekyll                    # 关闭 Jekyll 处理
├── robots.txt                  # 请求搜索引擎不索引；不是访问控制
├── README.md                   # 本说明
├── MEDIA_CHECKLIST.md           # 7 个任务对应的素材命名清单
├── SOURCE_NOTES.md              # 内容来源与未填内容说明
├── FILE_MANIFEST.txt            # 此次交付实际包含的文件清单
├── assets/
│   ├── css/style.css           # 配色、布局、手机适配
│   ├── js/content.js           # 标题、任务名称、基线、真实结果
│   ├── js/media-index.js       # 扫描素材后自动生成的媒体索引
│   ├── figures/cfa.png         # 输入文稿第 17 页 Figure 2 的裁图
│   ├── figures/apc.png         # 输入文稿第 17 页 Figure 3 的裁图
│   ├── figures/favicon.svg     # 自写的图标
│   ├── posters/                # 可选任务封面，初始没有实验图片
│   └── videos/                 # 7 个任务文件夹，初始没有视频
└── tools/
    └── prepare.py              # 本地检查文件并更新媒体索引
```

`assets/paper.pdf`、`assets/videos/overview.mp4` 和学习曲线图片都是**预留位置，不是已经存在的交付文件**。原始输入 PDF 没有被直接放入公开站点；请自行加入最终匿名稿。

## 3. 放入视频：推荐方式

每个任务一个文件夹。同一个任务的不同方法用文件名区分。以 Pick Cube 为例：

```text
assets/videos/pick-cube/
├── ours-real.mp4       # 本方法的真机视频
├── ours-sim.mp4        # 本方法的仿真视频，可选
├── squint-real.mp4     # Squint 的真机视频
├── ppo-real.mp4        # LeRobot/PPO 的真机视频
├── bc-real.mp4         # BC 的真机视频
└── dagger-real.mp4     # DAgger 的真机视频
```

全部 7 个任务的文件夹名：

| 网站任务名 | 文件夹名 |
|---|---|
| Pick Cube | `pick-cube` |
| PushT | `push-t` |
| Stack Cube | `stack-cube` |
| Drawer Opening | `drawer-opening` |
| Hanger Placement | `hanger-placement` |
| Door Opening | `door-opening` |
| Door Closing | `door-closing` |

文件名使用小写，并与上面的命名完全一致。每个方法也支持对应的 `*-sim.mp4`；没有仿真录像就不必添加。

素材放好后，在网站文件夹中运行：

```bash
python3 tools/prepare.py
python3 tools/prepare.py --check
```

脚本只依赖 Python 3.9 或以上的标准库。它只扫描实际存在且非空的文件，更新 `assets/js/media-index.js`，不会生成假视频、补造数值或改动 `content.js`。**把更新后的 `media-index.js` 和视频一起上传**；只把视频丢进文件夹、不更新索引，页面不会自动知道新素材已经存在。

刷新页面，就可以看到视频。首页默认展示 PushT 的仿真/真机；在 `content.js` 修改 `featuredTask` 可以换成另一个任务。

若你准备了全部任务的总览视频，放到 `assets/videos/overview.mp4` 后再运行脚本，首页会改为总览视频。总览视频不是必需的。

### 完全不运行 Python 的方式

在 `assets/js/content.js` 中找到对应任务的 `"media": {}`，改为：

```javascript
"media": {
  "ours": {
    "real": "assets/videos/pick-cube/ours-real.mp4",
    "sim": "assets/videos/pick-cube/ours-sim.mp4"
  },
  "squint": {
    "real": "assets/videos/pick-cube/squint-real.mp4"
  }
}
```

只写真实存在的路径；没有视频的字段不写。这些手写配置优先于自动索引。同样的方法适用于 `ppo`、`bc`、`dagger`。保持双引号、不要在最后一个字段后加逗号，可以继续兼容检查脚本。

## 4. 添加真实结果

打开 `assets/js/content.js`，找到任务的 `results`。默认均为 `null`。

下面**仅演示语法，不是论文的实验结果**：

```javascript
"results": {
  "ours": { "successes": 17, "trials": 20 },
  "squint": null,
  "ppo": null,
  "bc": null,
  "dagger": null
}
```

前端根据成功次数/总次数计算百分比，并显示原始次数。不需要手算和手填百分比。真正测得 0 次成功时填 `successes: 0` 和真实的正数 `trials`；没有测试或没有核实的结果保持 `null`。

Mean 行是 7 个任务成功率的等权平均。某个方法只有部分任务有数据时，不显示这个方法的 Mean，避免不同覆盖范围的平均值混在一起比较。

`evaluationNote` 可以补充最终核实的评测说明，例如每个方法的训练种子、测试条件、试次数和成功标准。当前留空，不会显示未落实的协议承诺。

## 5. 加论文、代码和图片

**论文：** 将最终核对过的匿名 PDF 放到 `assets/paper.pdf`，运行 `python3 tools/prepare.py`，Paper 按钮自动启用。此前按钮明确显示未配置，并不会跳到错误链接。不要直接公开仍含占位符的草稿。

**代码：** 在 `assets/js/content.js` 顶部把 `codeUrl` 改为匿名代码仓库的 HTTPS 地址。确认仓库作者信息、历史提交和所有文件均已匿名。不要填写非匿名个人仓库。

**任务封面：** 可选地添加 `assets/posters/pick-cube.jpg` 等与任务 ID 同名的图片，再更新媒体索引。封面只是预览，不代表已经提供录像。

**方法图：** 当前两张是从输入稿件第 17 页 Figure 2/3 裁出的实际示意图，不是合成实验图。可以同名替换为最终高清导出图；若稿件图号发生变化，同步修改 `index.html` 的图注。

**学习曲线：** 页面默认不显示不存在的曲线。加入 `assets/figures/learning-interactions.png` 和/或 `assets/figures/learning-time.png`，再更新媒体索引后，相应栏目会出现。图片需自行标明评价域、单位、图例、种子/方差信息，不使用合成曲线代替测量结果。

## 6. GitHub Pages 上线：网页操作

### 6.1 使用匿名账号并检查邮箱隐私

确认右上角当前登录的是匿名账号。打开个人 `Settings → Emails`，打开 `Keep my email addresses private`。GitHub 文档说明，这样在网页界面操作时会默认使用 noreply 提交邮箱；本地 Git 的作者信息需要单独配置。

### 6.2 新建网站仓库

选择 `+ → New repository`。假设匿名用户名是 `anon-robotics-2027`（仅示例），仓库名填写：

```text
anon-robotics-2027.github.io
```

使用你自己匿名账号的实际用户名，而不是照抄示例。个人站点仓库名须是 `<用户名>.github.io`。使用 GitHub Free 时选择 **Public**；可以打开 Add README，便于进入仓库后上传文件。

### 6.3 上传解压后的内容

在仓库首页选择 `Add file → Upload files`。上传本文件夹**里面的文件和子文件夹**，保持层级结构，最后提交到 `main`。

正确：仓库首页直接有 `index.html`、`assets/`。

错误：仓库首页只有一个 ZIP；或者首页下面多包了一层 `sim2real-rl-site/index.html`。

保留 `.nojekyll`。Linux 文件管理器可按 Ctrl+H 显示隐藏文件。不要把原始录像、旧项目的 `.git`、个人配置、缓存、模型权重、密钥或无关文档一起拖进去。

### 6.4 启用 Pages

```text
仓库 Settings
→ Pages
→ Build and deployment
→ Source: Deploy from a branch
→ Branch: main
→ Folder: / (root)
→ Save
```

不需要选择主题，也不需要创建 React 项目。GitHub 会部署已经写好的静态文件。等待部署完成后，在 Pages 设置中点击 **Visit site**；官方说明更新可能需要最多约 10 分钟。部署失败先看仓库的 Actions 页日志。

以上示例的个人站点地址是：

```text
https://anon-robotics-2027.github.io/
```

若你已经建的是普通仓库 `project-page`，也可以使用同样代码和 `main / (root)`；其网站地址会是 `https://你的匿名用户名.github.io/project-page/`。本模板的资源使用相对路径，两种形式都支持。

### 6.5 更新

以后修改网页文字、放新视频或更新数值后，重新检查并上传变化的文件即可。新增/删除媒体需要同步更新 `media-index.js`。同名替换视频不需要改网页路径。部署后使用强制刷新检查最新内容。

**不要为了替换视频而删除整个仓库。**

## 7. 视频体积与播放

本模板不捆绑第三方播放器。播放器使用浏览器原生视频元素，默认静音；对照区域支持并排播放、一起暂停、从头播放与统一播放倍速。共同起播只方便观看，不表示两段轨迹来自相同初始条件，也不代表严格逐帧同步。

建议优先用 H.264 编码的 MP4；同是 `.mp4` 后缀，不同内部编码的浏览器兼容性也可能不同。一个 10–20 MB 左右的短视频通常更便于网页上传；具体码率按场景细节自行取舍。**压缩后确认物体、接触和终止状态仍然清楚，不用播放倍速伪装执行效率。**

GitHub 官方文档当前列出的限制：网页上传单文件 25 MiB、一次最多 100 个文件；命令行可添加不超过 100 MiB 的单文件。Pages 发布站点总大小不超过 1 GB，月带宽有 100 GB 的软限制。不要把超大素材或 Git LFS 指针当成普通可直接播放的视频来部署。

已有 FFmpeg 时，可参考下面的压缩命令。它会去掉音轨和输入元数据；不会替你遮挡画面中的姓名或标识：

```bash
ffmpeg -i input.mp4 -map 0:v:0 \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p \
  -an -map_metadata -1 -movflags +faststart output.mp4
```

输入输出使用不同文件名，保留原始录像。需要保留已匿名的音频时，不要直接照抄 `-an`。

## 8. 投稿前检查

ICLR 2027 官方要求演示链接完全匿名，且不能通过访客追踪暴露审稿人身份。这个前端没有统计 SDK、远程字体、嵌入式 YouTube、Cookie、LocalStorage、访客计数器或跟踪请求；但不能因此保证托管平台完全没有安全日志。GitHub 官方说明，Pages 会为安全目的记录访客 IP。不要尝试利用任何日志或访问数据识别审稿人；对主办方如何界定托管安全日志仍有疑问时，应咨询会议方。

公开前逐项核对：账号、仓库、提交作者/邮箱、HTML、文件名、PDF 属性、图像/视频元数据和视频画面，不含真实作者、学校、实验室、个人账号或身份线索。去掉可识别的水印、桌面通知、语音姓名及无关屏幕内容。

`robots.txt` 和 `noindex` 只是请求搜索引擎不索引，不是密码保护；网址及公开仓库仍然能被访问。**匿名 OpenReview 账号不是本方案的一部分，论文投稿作者信息仍按会议要求如实填写。**

建议运行：

```bash
python3 tools/prepare.py --check
```

额外使用 `--strict` 可以检查每个任务是否都配置了本方法的真机录像；它不会检查 28 条基线录像是否齐全，也不能代替人工匿名审计：

```bash
python3 tools/prepare.py --check --strict
```

在无痕窗口检查线上网址、7 个任务、不同基线、手机布局、所有已启用链接和播放器。网页是补充展示，不替代投稿系统中的正式论文与补充材料。

## 9. 官方操作依据

核对日期：2026-09-22。界面文案或限制可能更新，以对应官方文档为准。

- GitHub 建站：https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- 发布分支设置：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- 文件上传：https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- Pages 限制：https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- 提交邮箱：https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address
- Pages 数据收集：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- ICLR 2027 Author Guidelines：https://iclr.cc/Conferences/2027/AuthorGuidelines
- FFmpeg 命令与容器选项：https://ffmpeg.org/ffmpeg.html 、https://ffmpeg.org/ffmpeg-formats.html
