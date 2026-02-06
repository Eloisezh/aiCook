import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FridgeState, DishOption, Recipe, Language } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Generates dish recommendations based on fridge contents.
 */
export const getRecommendations = async (
  fridge: FridgeState,
  lang: Language,
): Promise<DishOption[]> => {
  const langInstruction =
    lang === "zh"
      ? "Return the response in Chinese (Simplified)."
      : "Return the response in English.";

  const prompt = `
    I have these ingredients in my fridge:
    Meat/Protein: ${fridge.meat}
    Vegetables: ${fridge.veg}
    Staples: ${fridge.staple}
    
    Recommend 3 distinct dishes I can make. 
    Focus on simple, delicious, and practical home cooking.
    ${langInstruction}
  `;

  const schema: Schema = {
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
    return JSON.parse(text) as DishOption[];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Fallback data
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
};

/**
 * Generates a detailed recipe for a selected dish.
 */
export const getRecipeDetails = async (
  dishName: string,
  fridge: FridgeState,
  lang: Language,
): Promise<Recipe> => {
  const langInstruction =
    lang === "zh"
      ? "Return the response in Chinese (Simplified)."
      : "Return the response in English.";

  const prompt = `
    Create a detailed cooking guide for: ${dishName}.
    Context: Practical home cooking with ingredients: ${fridge.meat}, ${fridge.veg}, ${fridge.staple}.
    
    Requirements:
    1. List ingredients with specific quantities.
    2. INTELLIGENT SORTING: Mark ingredients as 'isOptional: true' if they are garnishes, non-essential spices, or things the user likely doesn't have but could skip without ruining the dish. Mark core ingredients as 'isOptional: false'.
    3. Step-by-step instructions.
    4. TIMERS: Set 'timeInSeconds' > 0 ONLY for passive waiting steps (boil, bake, simmer). Active steps = 0.
    
    ${langInstruction}
  `;

  const schema: Schema = {
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
    return JSON.parse(text) as Recipe;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    // Fallback data
    return {
      name: dishName,
      description:
        lang === "zh"
          ? "生成食谱时遇到问题，请重试。"
          : "Error generating recipe, please try again.",
      tags: ["Error"],
      ingredients: [{ item: "?", amount: "", isOptional: false }],
      steps: [
        {
          instruction: lang === "zh" ? "请重试。" : "Please try again.",
          timeInSeconds: 0,
        },
      ],
    };
  }
};
