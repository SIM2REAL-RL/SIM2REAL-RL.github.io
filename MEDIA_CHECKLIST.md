# 视频与素材清单

以下为**建议添加的路径，不是本压缩包已有视频的清单**。没有录像的位置保持空缺。

## 最小任务展示

先放本方法的 7 个真机视频即可，基线可在素材核实后逐一加入。

- [ ] `Pick Cube`：`assets/videos/pick-cube/ours-real.mp4`
- [ ] `PushT`：`assets/videos/push-t/ours-real.mp4`
- [ ] `Stack Cube`：`assets/videos/stack-cube/ours-real.mp4`
- [ ] `Drawer Opening`：`assets/videos/drawer-opening/ours-real.mp4`
- [ ] `Hanger Placement`：`assets/videos/hanger-placement/ours-real.mp4`
- [ ] `Door Opening`：`assets/videos/door-opening/ours-real.mp4`
- [ ] `Door Closing`：`assets/videos/door-closing/ours-real.mp4`

## 每个任务的对照材料

要为每个任务展示 4 个基线，共需 28 条基线真机视频；加上本方法的 7 条，就是 35 条。另加本方法的 7 条仿真视频时为 42 条。这个数量是页面素材配置，不代表实验试次数。

### 01. Pick Cube

```text
assets/videos/pick-cube/
  ours-real.mp4
  ours-sim.mp4        # 可选
  squint-real.mp4
  ppo-real.mp4
  bc-real.mp4
  dagger-real.mp4
```

### 02. PushT

```text
assets/videos/push-t/
  ours-real.mp4
  ours-sim.mp4        # 可选
  squint-real.mp4
  ppo-real.mp4
  bc-real.mp4
  dagger-real.mp4
```

### 03. Stack Cube

```text
assets/videos/stack-cube/
  ours-real.mp4
  ours-sim.mp4        # 可选
  squint-real.mp4
  ppo-real.mp4
  bc-real.mp4
  dagger-real.mp4
```

### 04. Drawer Opening

```text
assets/videos/drawer-opening/
  ours-real.mp4
  ours-sim.mp4        # 可选
  squint-real.mp4
  ppo-real.mp4
  bc-real.mp4
  dagger-real.mp4
```

### 05. Hanger Placement

```text
assets/videos/hanger-placement/
  ours-real.mp4
  ours-sim.mp4        # 可选
  squint-real.mp4
  ppo-real.mp4
  bc-real.mp4
  dagger-real.mp4
```

### 06. Door Opening

```text
assets/videos/door-opening/
  ours-real.mp4
  ours-sim.mp4        # 可选
  squint-real.mp4
  ppo-real.mp4
  bc-real.mp4
  dagger-real.mp4
```

### 07. Door Closing

```text
assets/videos/door-closing/
  ours-real.mp4
  ours-sim.mp4        # 可选
  squint-real.mp4
  ppo-real.mp4
  bc-real.mp4
  dagger-real.mp4
```

## 其他可选素材

| 路径 | 用途 |
|---|---|
| `assets/videos/overview.mp4` | 首页总览录像，添加后替代首页的两个任务播放器 |
| `assets/paper.pdf` | 最终匿名论文，添加后启用 Paper 按钮 |
| `assets/figures/learning-interactions.png` | 真实交互次数–成功率曲线 |
| `assets/figures/learning-time.png` | 真实训练耗时–成功率曲线 |

- 封面（可选）：`assets/posters/pick-cube.jpg`
- 封面（可选）：`assets/posters/push-t.jpg`
- 封面（可选）：`assets/posters/stack-cube.jpg`
- 封面（可选）：`assets/posters/drawer-opening.jpg`
- 封面（可选）：`assets/posters/hanger-placement.jpg`
- 封面（可选）：`assets/posters/door-opening.jpg`
- 封面（可选）：`assets/posters/door-closing.jpg`

## 命名与检查

推荐小写 MP4 文件名；脚本也可识别同名 `.webm` / `.m4v`。同一位置存在多个编码时，按 MP4、WebM、M4V 的优先顺序选择。

新增素材后运行：

```bash
python3 tools/prepare.py
python3 tools/prepare.py --check
```

图像路径、视频方法标签、任务编号、仿真/真机标签应与实际内容一致。剪辑中保留足够上下文，避免仅凭成功片段宣称整体成功率。
