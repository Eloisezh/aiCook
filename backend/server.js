// const express = require("express");
// const mysql = require("mysql2/promise");
// const cors = require("cors");
// require("dotenv").config();

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Gemini client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-3-flash-preview",
// });

// // MySQL config
// const dbConfig = {
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "root",
//   database: "smart_kitchen",
// };

// /**
//  * 获取用户预设
//  */
// app.get("/api/config", async (req, res) => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     const [rows] = await connection.execute(
//       "SELECT * FROM user_config WHERE id = 1",
//     );
//     await connection.end();

//     res.json(
//       rows[0] || {
//         staples: "生抽,盐,糖",
//         preferences: "清淡",
//       },
//     );
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// /**
//  * AI 1：推荐菜名
//  */
// app.post("/api/recommend", async (req, res) => {
//   const { meat, veg, staple, staples, preferences } = req.body;

//   const prompt = `
// 你是一个擅长家庭料理的厨师。
// 冰箱里有：
// - 肉类：${meat}
// - 蔬菜：${veg}
// - 主食：${staple}

// 调味品：${staples}
// 饮食偏好：${preferences}
// 做饭时间：30-60分钟

// 请只返回 **严格 JSON**，格式如下：
// {
//   "recommendations": ["菜名1", "菜名2", "菜名3"]
// }
// `;

//   try {
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     // 尝试解析 JSON
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       throw new Error("JSON parse failed");
//     }

//     const parsed = JSON.parse(jsonMatch[0]);
//     res.json(parsed.recommendations);
//   } catch (e) {
//     res.status(500).json({ error: "AI 推荐失败" });
//   }
// });

// /**
//  * AI 2：生成具体菜谱
//  */
// app.post("/api/generate-recipe", async (req, res) => {
//   const { dishName, ingredients } = req.body;

//   const prompt = `
// 你是一个美食区UP主，请用通俗易懂的语言介绍菜谱。

// 菜名：${dishName}
// 现有食材：${ingredients}

// 请按如下格式输出：

// 食材清单：
// - 食材A
// - 食材B

// 做法：
// 1. 步骤说明（如有时间请写：煮5分钟）
// 2. ...
// `;

//   try {
//     const result = await model.generateContent(prompt);
//     res.json({ content: result.response.text() });
//   } catch (e) {
//     res.status(500).json({ error: "生成菜谱失败" });
//   }
// });

// // Server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

// Gemini client（✅ 正确）
const ai = new GoogleGenAI({
  apiKey: "AIzaSyAsGn3Yr-5UbzGJ3pGy_mGhxlnfGHYJtOI",
});

// MySQL config
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: "smart_kitchen",
};

/**
 * 获取用户预设
 */
app.get("/api/config", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM user_config WHERE id = 1",
    );
    await connection.end();

    res.json(
      rows[0] || {
        staples: "生抽,盐,糖",
        preferences: "清淡",
      },
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * AI 1：推荐菜名
 */
app.post("/api/recommend", async (req, res) => {
  const { meat, veg, staple, staples, preferences } = req.body;

  const prompt = `
你是一个擅长家庭料理的厨师。
冰箱里有：
- 肉类：${meat}
- 蔬菜：${veg}
- 主食：${staple}

调味品：${staples}
饮食偏好：${preferences}
做饭时间：30-60分钟

你必须只返回【合法 JSON】，不允许有任何多余文字。
格式如下：
{
  "recommendations": ["菜名1", "菜名2", "菜名3"]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text.trim();
    const parsed = JSON.parse(text);

    res.json(parsed.recommendations);
  } catch (e) {
    console.error("RECOMMEND ERROR:", e);
    res.status(500).json({ error: "AI 推荐失败" });
  }
});

/**
 * AI 2：生成具体菜谱
 */
app.post("/api/generate-recipe", async (req, res) => {
  const { dishName, ingredients } = req.body;

  const prompt = `
你是一个美食区UP主，请用通俗易懂的语言介绍菜谱。

菜名：${dishName}
现有食材：${ingredients}

请按如下格式输出：

食材清单：
- 食材A
- 食材B

做法：
1. 步骤说明（如有时间请写：煮5分钟）
2. ...

你必须只返回【合法 JSON】，不允许有任何多余文字。
格式如下：
{
  "main ingredients": ["食材1", "食材2", "食材3",...],
  "side ingredients": ["食材1", "食材2", "食材3",...],
  "condiment": ["调味1", "调味2", "调味3",...],
  "step": ["步骤1", "步骤2", "步骤3",...],
  "reminder": ["小贴士1", "小贴士2", "小贴士3",...],
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({ content: response.text });
  } catch (e) {
    console.error("RECIPE ERROR:", e);
    res.status(500).json({ error: "生成菜谱失败" });
  }
});

// Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
