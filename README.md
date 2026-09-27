# zcode-skills

我的 ZCode 技能库。每个子目录是一个独立技能，按 [ZCode skill 规范](https://zcode.ai) 组织（`<name>/SKILL.md`，可选 `assets/`、`references/`、`scripts/`）。

## 技能清单

### plain-docx

生成朴素、无装饰的中文 Word 纯文档（.docx）：无封面、无色块、无彩色表格，按标准排版规范输出。

默认排版规范（案例分析报告标准）：

| 项 | 规范 |
|---|---|
| 章标题 | 三号黑体居中，单倍行距，段前段后各 0.5 行 |
| 节标题 | 四号黑体居左，单倍行距，段前段后各 0.5 行 |
| 正文 | 小四号宋体，1.5 倍行距，段前段后 0 行 |
| 页码 | 五号宋体，页脚居中 |
| 页眉 | 小五号宋体，从报告主体部分开始 |
| 数字和字母 | Times New Roman |
| 页边距 | 上 25mm / 下 25mm / 左 30mm / 右 20mm，页眉页脚边距 15mm |

适用场景：课程报告、案例分析报告、作业报告等一切「不要花里胡哨设计、简单纯文档」的 Word 输出。

## 安装

把技能目录复制到 `~/.zcode/skills/` 即可被 ZCode 发现：

```bash
git clone https://github.com/yangvista/zcode-skills.git
cp -r zcode-skills/plain-docx ~/.zcode/skills/
```

Windows（Git Bash）下 `~` 即 `C:\Users\<用户名>`。
