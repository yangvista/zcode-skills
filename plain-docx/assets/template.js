// plain-docx 完整可运行模板 —— 案例分析报告排版规范
// 用法：复制为 generate.js，替换 children 数组内容后 node 运行
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, HeadingLevel,
  WidthType, BorderStyle, ShadingType,
} = require("docx");
const fs = require("fs");

const FONT = { ascii: "Times New Roman", eastAsia: "SimSun" };   // 正文：小四宋体
const HFONT = { ascii: "Times New Roman", eastAsia: "SimHei" };  // 标题：黑体

// 章标题：三号黑体居中，单倍行距，段前段后各 0.5 行
function chapter(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { line: 240, before: 180, after: 180 },
    children: [new TextRun({ text, size: 32, color: "000000", font: HFONT })],
  });
}

// 节标题：四号黑体居左，单倍行距，段前段后各 0.5 行
function section(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { line: 240, before: 180, after: 180 },
    children: [new TextRun({ text, size: 28, color: "000000", font: HFONT })],
  });
}

// 正文：小四宋体，1.5 倍行距，段前段后 0 行，首行缩进 2 字符
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 360, before: 0, after: 0 },
    children: [new TextRun({ text, size: 24, color: "000000", font: FONT })],
  });
}

// 表题：五号黑体居中，与表格同页
function tableTitle(text) {
  return new Paragraph({
    keepNext: true,
    alignment: AlignmentType.CENTER,
    spacing: { line: 240, before: 120, after: 60 },
    children: [new TextRun({ text, size: 21, color: "000000", font: HFONT })],
  });
}

// 黑白三线表：顶线、底线粗黑，表头下细黑线，无底纹无竖线
function plainTable(headers, rows, widths) {
  const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const thick = { style: BorderStyle.SINGLE, size: 8, color: "000000" };
  const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: thick, bottom: thick, left: NONE, right: NONE,
               insideHorizontal: NONE, insideVertical: NONE },
    rows: [
      new TableRow({
        tableHeader: true, cantSplit: true,
        children: headers.map((text, i) => new TableCell({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { line: 240 },
            children: [new TextRun({ text, size: 21, color: "000000", font: HFONT })],
          })],
          borders: { bottom: thin },
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          width: { size: widths[i], type: WidthType.PERCENTAGE },
        })),
      }),
      ...rows.map(cells => new TableRow({
        cantSplit: true,
        children: cells.map((text, i) => new TableCell({
          children: [new Paragraph({
            spacing: { line: 240 },
            children: [new TextRun({ text, size: 21, color: "000000", font: FONT })],
          })],
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          width: { size: widths[i], type: WidthType.PERCENTAGE },
        })),
      })),
    ],
  });
}

// ── 文档内容（替换此处） ──
const children = [
  chapter("一、案例背景"),
  section("（一）企业概况"),
  body("本节介绍案例企业的基本情况。正文为小四号宋体，1.5 倍行距，段前段后不空行，首行缩进两个字符。数字和字母使用 Times New Roman，例如 2026 年增长 17.5%。"),
  body("段落之间不再额外加空行，行距与段距完全由样式控制。"),
  section("（二）行业环境"),
  body("此处为正文内容。"),
  chapter("二、案例分析"),
  body("此处为正文内容。"),
  tableTitle("表 1  示例数据表"),
  plainTable(
    ["指标", "2024 年", "2025 年", "变化"],
    [
      ["营业收入（万元）", "1,200", "1,410", "+17.5%"],
      ["净利润（万元）", "180", "236", "+31.1%"],
    ],
    [34, 22, 22, 22]
  ),
  body("表格采用黑白三线表，表头下一条细线，无底纹无彩色。"),
];

// ── 组装：A4，上 25 / 下 25 / 左 30 / 右 20 mm，页眉页脚边距 15 mm ──
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 24, color: "000000" },
        paragraph: { spacing: { line: 360 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1417, bottom: 1417, left: 1701, right: 1134, header: 850, footer: 850 },
      },
    },
    // 页眉：小五宋体，从主体部分开始（本文档无封面，全文档生效）
    headers: { default: new Header({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "案例分析报告", size: 18, color: "000000", font: FONT })],
    })] }) },
    // 页码：五号宋体，页脚居中，仅当前页码
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 21, color: "000000", font: FONT })],
    })] }) },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("output.docx", buf);
  console.log("OK: output.docx,", buf.length, "bytes");
});
