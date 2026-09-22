# 内容来源与边界

## 论文内容

输入来源为提供的 `Sim2Real.pdf`，20 页，题名：

**Sim2Real-RL: Efficient Visual Reinforcement Learning for Zero-Shot Embodied Manipulation**。

网站不是此前另一个 SWM/LLM 原子技能项目的主页，未把其他项目的功能混入本文。

| 网页内容 | 输入稿件对应位置 |
|---|---|
| 标题及匿名状态 | 第 1 页题名和作者栏 |
| 非对称 actor–critic、RGB+proprioception、随机化仿真 | 第 4–5 页，§3.1 |
| CFA 方法简介 | 第 5–6 页，§3.2 |
| APC 方法简介 | 第 6 页，§3.3 |
| 每个任务独立训练一个策略 | 第 7 页，§4.1 续段 |
| 7 个任务 | 第 8 页 Table 1；第 19 页 Table 5 |
| Squint、LeRobot/PPO、BC、DAgger | 第 7 页，§4.2；第 8 页 Table 1 |
| `assets/figures/cfa.png` | 第 17 页 Figure 2 的实际裁图 |
| `assets/figures/apc.png` | 第 17 页 Figure 3 的实际裁图 |

稿件摘要写了 six tasks，引言/贡献中写了 eight tasks；实验表列出 7 项。网站依据本次明确要求与 Table 1 使用 **7 个任务**，这不代表输入 PDF 中的矛盾已经被修改。正式定稿时应同步核对摘要、引言、图表、附录和网站。

网页简介是依据方法部分写的简述，不是假装逐字复现当前仍带 `x%` 等占位符的摘要。没有把不存在的优于基线幅度、具体成功率或训练时间写成已测结论。

## 尚未提供的材料

当前没有附带实际任务录像、基线录像、试次结果或学习曲线。网站为这些内容留了接口；所有未核实数值保持 `null`。所附图 2/3 是计算流程示意，不是测得的 attention heatmap。

原始输入 PDF 没有包含在公开站点目录中。`assets/paper.pdf` 是最终匿名稿的预留路径；添加后运行索引脚本才会启用链接。

目前没有代码仓库链接、arXiv 链接、作者名单、机构、学校标识或编造的投稿编号。不要将 "Anonymous submission" 改成 "Accepted"，除非已有真实接收结果。

## 设计参考

页面类型参考提供的 ReMAC-ManiCraft 项目主页：论文标题/介绍、方法、任务可视化和实验区块。

参考地址：https://remac-manicraft.github.io/

本项目独立编写 HTML/CSS/JS，没有搬用参考站论文文字、视频、图像或第三方统计代码；也没有声称复刻其全部视觉细节。页面中的方法裁图来自本次提供的论文，而非参考站。

## 发布与隐私

当前交付仅为本地文件，不表示 GitHub 部署已完成。本前端不主动追踪访客；平台侧安全日志不在前端控制范围内，不能据此承诺“整个托管平台零日志”。
