---
name: plain-docx
description: 生成朴素、无装饰的中文 Word 纯文档（.docx）：无封面、无色块、无彩色表格，只按标准排版规范输出。凡用户要求「纯文档 / 朴素一点 / 别花里胡哨 / 不要设计感 / 课程报告 / 案例分析报告 / 作业报告 / 实验报告 / 按学校规范排版」，或明确给出字体字号、页边距、行距等排版规范时必须使用本技能；当默认 docx 技能的彩色封面模板被用户否定时，改用本技能。
---

# plain-docx：纯文档 Word 生成

生成完全朴素的 .docx。核心原则：**黑白、无装饰、规范优先**。用户给规范时逐项照做，规范未写明的项按本文默认值，不要自由发挥。

## 默认排版规范（案例分析报告标准）

| 项 | 规范 | docx-js 取值 |
|---|---|---|
| 章标题 | 三号黑体，居左，单倍行距，段前段后各 0.5 行 | `size: 32`，`eastAsia: "SimHei"`，居左，`spacing: { line: 240, before: 180, after: 180 }` |
| 节标题 | 四号黑体，居左，单倍行距，段前段后各 0.5 行 | `size: 28`，`eastAsia: "SimHei"`，居左，同上 spacing |
| 正文 | 小四宋体，1.5 倍行距，段前段后 0 行 | `size: 24`，`eastAsia: "SimSun"`，`spacing: { line: 360, before: 0, after: 0 }`，首行缩进 `firstLine: 480`（规范未述，按中文惯例默认 2 字符；用户说不要缩进就去掉） |
| 页码 | 五号宋体 | 页脚居中，`size: 21`，仅当前页码数字 |
| 页眉 | 小五宋体，从报告主体部分开始 | `size: 18`，默认内容为文档标题，居中，无框线；封面/目录所在节不放页眉 |
| 数字和字母 | Times New Roman | 所有 TextRun 统一 `ascii: "Times New Roman"` |
| 页边距 | 上 25mm、下 25mm、左 30mm、右 20mm | `margin: { top: 1417, bottom: 1417, left: 1701, right: 1134 }` |
| 页眉/页脚边距 | 上边距 15mm、下边距 15mm | `header: 850, footer: 850` |
| 纸张 | A4 纵向 | `11906 × 16838` |

换算备忘：1mm = 56.7 twips；三号 = 16pt = size 32；四号 = 14pt = size 28；小四 = 12pt = size 24；五号 = 10.5pt = size 21；小五 = 9pt = size 18。段前段后「0.5 行」按默认文档网格一行的二分之一取 180 twips。

用户给出不同规范的，以用户规范为准逐项替换上表取值，其余保持。

## 禁止事项（防花里胡哨）

- 不做封面页；不用色块、图片、彩色分隔线、页眉横线（用户要求页眉线时才加）。
- 表格一律黑白三线表：顶线、底线用粗黑线（size 8–12），表头下一条细黑线（size 4），无底纹、无彩色表头、无竖线。
- 整表不拆页：把表题做进表格首行（跨列合并、无边框的单元格），顶线/底线改用单元格边框实现（表头行上边粗线、末行下边粗线），再给所有非末行单元格的段落加 `keepNext: true`。这样表题与表格物理上不可分离、整表自动挪页。不要把表题做成表格外的独立段落——LibreOffice 不认段落到表格的 keepNext，表题会被单独留在上一页；也不要用手工 PageBreak 强制分页，内容重排后会产生大面积空白页。若表格本身就超过一页高，则允许跨页并依赖 `tableHeader: true` 自动重复表头。
- 全文纯黑 `000000`，不使用任何主题色、调色板、彩色标题。
- 默认不加目录；用户要目录时才加，且目录样式同样黑白朴素。
- 不套用 documents 技能的 R1–R7 封面配方、GO-1/DM-1 等调色板。
- 章节编号体系全文统一：默认章用「一、二、三」，节用「（一）（二）」；用户有要求（如「1.1」式）从其要求。

## 生成流程

1. 工作目录准备 Node 环境：`npm init -y && npm install docx`（已有 node_modules 则跳过）。
2. 复制本技能目录下 `assets/template.js` 为 `generate.js`，替换 `children` 数组为实际内容。
3. `node generate.js` 输出 docx。
4. 验证（可选）：用 LibreOffice 转 PDF 目检。注意沙箱内 soffice 可能启动失败（表现为 loading shared libraries 报错或挂起），需在非沙箱终端运行：`soffice --headless --convert-to pdf 文件.docx`。

`assets/template.js` 是完整可运行的样例（章标题、节标题、正文、三线表、页眉、页码俱全），照改即可，不要从零重写。

## 关键代码片段（速查）

```js
const FONT = { ascii: "Times New Roman", eastAsia: "SimSun" };   // 正文
const HFONT = { ascii: "Times New Roman", eastAsia: "SimHei" };  // 标题

// 章标题（黑体自带粗度，不再加 bold；居左对齐）
new Paragraph({
  heading: HeadingLevel.HEADING_1,
  alignment: AlignmentType.LEFT,
  spacing: { line: 240, before: 180, after: 180 },
  children: [new TextRun({ text, size: 32, color: "000000", font: HFONT })],
});

// 正文
new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  indent: { firstLine: 480 },
  spacing: { line: 360, before: 0, after: 0 },
  children: [new TextRun({ text, size: 24, color: "000000", font: FONT })],
});
```

页眉页脚（从主体开始：若文档含封面/目录，前序节要显式给空 Header/Footer，否则会继承）：

```js
headers: { default: new Header({ children: [new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "文档标题", size: 18, color: "000000", font: FONT })],
})] }) },
footers: { default: new Footer({ children: [new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ children: [PageNumber.CURRENT], size: 21, color: "000000", font: FONT })],
})] }) },
```
