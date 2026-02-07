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
