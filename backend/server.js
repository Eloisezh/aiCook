// // const express = require("express");
// // const mysql = require("mysql2/promise");
// // const cors = require("cors");
// // require("dotenv").config();

// // const { GoogleGenerativeAI } = require("@google/generative-ai");

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // // Gemini client
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const model = genAI.getGenerativeModel({
// //   model: "gemini-3-flash-preview",
// // });

// // // MySQL config
// // const dbConfig = {
// //   host: process.env.DB_HOST || "localhost",
// //   user: process.env.DB_USER || "root",
// //   password: process.env.DB_PASSWORD || "root",
// //   database: "smart_kitchen",
// // };

// // /**
// //  * 获取用户预设
// //  */
// // app.get("/api/config", async (req, res) => {
// //   try {
// //     const connection = await mysql.createConnection(dbConfig);
// //     const [rows] = await connection.execute(
// //       "SELECT * FROM user_config WHERE id = 1",
// //     );
// //     await connection.end();

// //     res.json(
// //       rows[0] || {
// //         staples: "生抽,盐,糖",
// //         preferences: "清淡",
// //       },
// //     );
// //   } catch (e) {
// //     res.status(500).json({ error: e.message });
// //   }
// // });

// // /**
// //  * AI 1：推荐菜名
// //  */
// // app.post("/api/recommend", async (req, res) => {
// //   const { meat, veg, staple, staples, preferences } = req.body;

// //   const prompt = `
// // 你是一个擅长家庭料理的厨师。
// // 冰箱里有：
// // - 肉类：${meat}
// // - 蔬菜：${veg}
// // - 主食：${staple}

// // 调味品：${staples}
// // 饮食偏好：${preferences}
// // 做饭时间：30-60分钟

// // 请只返回 **严格 JSON**，格式如下：
// // {
// //   "recommendations": ["菜名1", "菜名2", "菜名3"]
// // }
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const text = result.response.text();

// //     // 尝试解析 JSON
// //     const jsonMatch = text.match(/\{[\s\S]*\}/);
// //     if (!jsonMatch) {
// //       throw new Error("JSON parse failed");
// //     }

// //     const parsed = JSON.parse(jsonMatch[0]);
// //     res.json(parsed.recommendations);
// //   } catch (e) {
// //     res.status(500).json({ error: "AI 推荐失败" });
// //   }
// // });

// // /**
// //  * AI 2：生成具体菜谱
// //  */
// // app.post("/api/generate-recipe", async (req, res) => {
// //   const { dishName, ingredients } = req.body;

// //   const prompt = `
// // 你是一个美食区UP主，请用通俗易懂的语言介绍菜谱。

// // 菜名：${dishName}
// // 现有食材：${ingredients}

// // 请按如下格式输出：

// // 食材清单：
// // - 食材A
// // - 食材B

// // 做法：
// // 1. 步骤说明（如有时间请写：煮5分钟）
// // 2. ...
// // `;

// //   try {
// //     const result = await model.generateContent(prompt);
// //     res.json({ content: result.response.text() });
// //   } catch (e) {
// //     res.status(500).json({ error: "生成菜谱失败" });
// //   }
// // });

// // // Server
// // const PORT = 3001;
// // app.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
// const express = require("express");
// const mysql = require("mysql2/promise");
// const cors = require("cors");
// require("dotenv").config();

// const { GoogleGenAI } = require("@google/genai");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Gemini client（✅ 正确）
// const ai = new GoogleGenAI({
//   apiKey: "AIzaSyB2fPY_DcHNwqATSq1LONcxL2VhjgyD1PM",
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

// I have these ingredients in my fridge:
// Meat/Protein:${meat}
// Vegetables:${veg}
// Staples: ${staple}

// Recommend 3 distinct dishes I can make.
// Focus on simple, delicious, and practical home cooking.

// 你必须只返回【合法 JSON】，不允许有任何多余文字。
// 格式如下：
// {
//   "recommendations": ["菜名1", "菜名2", "菜名3"]
// }
// `;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: prompt,
//     });

//     const text = response.text.trim();
//     const parsed = JSON.parse(text);

//     res.json(parsed.recommendations);
//   } catch (e) {
//     console.error("RECOMMEND ERROR:", e);
//     res.status(500).json({ error: "AI 推荐失败" });
//   }
// });

// /**
//  * AI 2：生成具体菜谱
//  */
// app.post("/api/generate-recipe", async (req, res) => {
//   const { dishName, ingredients } = req.body;

//   const prompt = `
// Create a detailed cooking guide for: ${dishName}
// Context: Practical home cooking with ingredients: ${ingredients}

// Requirements:
//     1. List ingredients with specific quantities.
//     2. INTELLIGENT SORTING: Mark ingredients as 'isOptional: true' if they are garnishes, non-essential spices, or things the user likely doesn't have but could skip without ruining the dish. Mark core ingredients as 'isOptional: false'.
//     3. Step-by-step instructions.
//     4. TIMERS: Set 'timeInSeconds' > 0 ONLY for passive waiting steps (boil, bake, simmer). Active steps = 0.

// 你必须只返回【合法 JSON】，不允许有任何多余文字。
// 格式如下：
// {
//   "name": "菜名",
//   "description": "菜品描述",
//   "tags": ["标签1", "标签2"],
//   "ingredients": [
//     {
//       "item": "食材名称",
//       "amount": "数量 (例如: 200g, 1 tbsp)",
//       "isOptional": false
//     }
//   ],
//   "steps": [
//     {
//       "instruction": "步骤说明",
//       "timeInSeconds": 0
//     }
//   ]
// }

// 说明：
// - name: 菜品名称（字符串）
// - description: 菜品描述（字符串）
// - tags: 标签数组（字符串数组）
// - ingredients: 食材数组
//   - item: 食材名称（字符串）
//   - amount: 数量，如 "200g", "1 tbsp"（字符串）
//   - isOptional: 是否可选（布尔值）
// - steps: 步骤数组
//   - instruction: 步骤说明（字符串）
//   - timeInSeconds: 被动等待时间（秒），主动步骤为 0（整数）
// `;

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3-flash-preview",
//       contents: prompt,
//     });

//     const parsed = res.json({ content: response.text });

//     /// verify
//     // 验证必填字段
//     if (
//       !parsed.name ||
//       !parsed.description ||
//       !parsed.tags ||
//       !parsed.ingredients ||
//       !parsed.steps
//     ) {
//       throw new Error("缺少必填字段");
//     }

//     // 验证数组类型
//     if (
//       !Array.isArray(parsed.tags) ||
//       !Array.isArray(parsed.ingredients) ||
//       !Array.isArray(parsed.steps)
//     ) {
//       throw new Error("tags, ingredients, steps 必须是数组");
//     }

//     // 验证 ingredients 结构
//     parsed.ingredients.forEach((ing, index) => {
//       if (!ing.item || !ing.amount || typeof ing.isOptional !== "boolean") {
//         throw new Error(`ingredients[${index}] 格式错误`);
//       }
//     });

//     // 验证 steps 结构
//     parsed.steps.forEach((step, index) => {
//       if (!step.instruction || typeof step.timeInSeconds !== "number") {
//         throw new Error(`steps[${index}] 格式错误`);
//       }
//     });
//     /// verify
//   } catch (e) {
//     console.error("RECIPE ERROR:", e);
//     res.status(500).json({ error: "生成菜谱失败" });
//   }
// });

// // Server
// const PORT = 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI, Type, Schema } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

// Gemini client initialization
const ai = new GoogleGenAI({
  apiKey:
    process.env.GEMINI_API_KEY || "AIzaSyB2fPY_DcHNwqATSq1LONcxL2VhjgyD1PM",
});

const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Get fallback recommendations based on language
 */
function getFallbackRecommendations(lang) {
  return lang === "zh"
    ? [
        {
          name: "示例：番茄炖牛腩",
          description: "温暖人心的经典炖菜。",
          calories: 350,
          difficulty: "Easy",
        },
        {
          name: "示例：青椒肉丝",
          description: "快速下饭的家常美味。",
          calories: 450,
          difficulty: "Medium",
        },
        {
          name: "示例：什锦炒饭",
          description: "简单朴实，粒粒分明。",
          calories: 600,
          difficulty: "Easy",
        },
      ]
    : [
        {
          name: "Example: Beef and Tomato Stew",
          description: "A heartwarming classic stew.",
          calories: 350,
          difficulty: "Easy",
        },
        {
          name: "Example: Pepper Steak Stir-fry",
          description: "Quick and delicious.",
          calories: 450,
          difficulty: "Medium",
        },
        {
          name: "Example: House Fried Rice",
          description: "Simple and filling.",
          calories: 600,
          difficulty: "Easy",
        },
      ];
}

/**
 * Get fallback recipe based on language
 */
function getFallbackRecipe(dishName, lang) {
  return {
    name: dishName,
    description:
      lang === "zh"
        ? "生成食谱时遇到问题，这是默认示例。"
        : "Error generating recipe, this is a default example.",
    tags: lang === "zh" ? ["示例"] : ["Example"],
    ingredients: [
      {
        item: lang === "zh" ? "主要食材" : "Main ingredient",
        amount: lang === "zh" ? "适量" : "As needed",
        isOptional: false,
      },
      {
        item: lang === "zh" ? "调味料" : "Seasoning",
        amount: lang === "zh" ? "少许" : "To taste",
        isOptional: true,
      },
    ],
    steps: [
      {
        instruction:
          lang === "zh"
            ? "准备所需食材并清洗干净。"
            : "Prepare and wash all ingredients.",
        timeInSeconds: 0,
      },
      {
        instruction:
          lang === "zh" ? "按照常规方法烹饪。" : "Cook using standard methods.",
        timeInSeconds: 300,
      },
      {
        instruction:
          lang === "zh" ? "调整口味，即可享用。" : "Season to taste and serve.",
        timeInSeconds: 0,
      },
    ],
  };
}

/**
 * AI 1: Recommend dish names
 */
app.post("/api/recommend", async (req, res) => {
  const { meat, veg, staple, lang = "zh" } = req.body;

  const langInstruction =
    lang === "zh"
      ? "Return the response in Chinese (Simplified)."
      : "Return the response in English.";

  const prompt = `
I have these ingredients in my fridge:
Meat/Protein: ${meat}
Vegetables: ${veg}
Staples: ${staple}

Recommend 3 distinct dishes I can make. 
Focus on simple, delicious, and practical home cooking.
${langInstruction}
`;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Name of the dish" },
        description: {
          type: Type.STRING,
          description: "Short appetizing description (10-15 words)",
        },
        calories: {
          type: Type.INTEGER,
          description: "Estimated calories per serving",
        },
        difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
      },
      required: ["name", "description", "calories", "difficulty"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);

    // Validate parsed data
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid AI response format");
    }

    res.json(parsed);
  } catch (error) {
    console.error("RECOMMEND ERROR:", error);

    // Return fallback data directly without error flag
    const fallbackData = getFallbackRecommendations(lang);
    res.json(fallbackData);
  }
});

/**
 * AI 2: Generate detailed recipe
 */
app.post("/api/generate-recipe", async (req, res) => {
  const { dishName, ingredients, lang = "zh" } = req.body;

  const langInstruction =
    lang === "zh"
      ? "Return the response in Chinese (Simplified)."
      : "Return the response in English.";

  const prompt = `
Create a detailed cooking guide for: ${dishName}.
Context: Practical home cooking with ingredients: ${ingredients}.

Requirements:
1. List ingredients with specific quantities.
2. INTELLIGENT SORTING: Mark ingredients as 'isOptional: true' if they are garnishes, non-essential spices, or things the user likely doesn't have but could skip without ruining the dish. Mark core ingredients as 'isOptional: false'.
3. Step-by-step instructions.
4. TIMERS: Set 'timeInSeconds' > 0 ONLY for passive waiting steps (boil, bake, simmer). Active steps = 0.

${langInstruction}
`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING, description: "Ingredient name" },
            amount: {
              type: Type.STRING,
              description: "Quantity (e.g., 200g, 1 tbsp)",
            },
            isOptional: {
              type: Type.BOOLEAN,
              description: "True if ingredient can be omitted",
            },
          },
          required: ["item", "amount", "isOptional"],
        },
      },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            instruction: { type: Type.STRING },
            timeInSeconds: {
              type: Type.INTEGER,
              description:
                "Passive waiting time in seconds (0 for active steps)",
            },
          },
          required: ["instruction", "timeInSeconds"],
        },
      },
    },
    required: ["name", "description", "tags", "ingredients", "steps"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);

    // Validation
    if (
      !parsed.name ||
      !parsed.description ||
      !parsed.tags ||
      !parsed.ingredients ||
      !parsed.steps
    ) {
      throw new Error("Missing required fields");
    }

    if (
      !Array.isArray(parsed.tags) ||
      !Array.isArray(parsed.ingredients) ||
      !Array.isArray(parsed.steps)
    ) {
      throw new Error("tags, ingredients, steps must be arrays");
    }

    parsed.ingredients.forEach((ing, index) => {
      if (!ing.item || !ing.amount || typeof ing.isOptional !== "boolean") {
        throw new Error(`ingredients[${index}] format error`);
      }
    });

    parsed.steps.forEach((step, index) => {
      if (!step.instruction || typeof step.timeInSeconds !== "number") {
        throw new Error(`steps[${index}] format error`);
      }
    });

    res.json(parsed);
  } catch (error) {
    console.error("RECIPE ERROR:", error);

    // Return fallback data directly without error flag
    const fallbackData = getFallbackRecipe(dishName, lang);
    res.json(fallbackData);
  }
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
