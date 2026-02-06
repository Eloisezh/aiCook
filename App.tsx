import React, { useState } from "react";
import {
  Search,
  ArrowRight,
  Loader2,
  RefreshCw,
  Flame,
  UtensilsCrossed,
  Scroll,
  Globe,
  BookOpen,
} from "lucide-react";
import { getRecommendations, getRecipeDetails } from "./services/geminiService";
import { StepCard } from "./components/StepCard";
import { IngredientChecklist } from "./components/IngredientChecklist";
import { FridgeState, DishOption, Recipe, AppStep, Language } from "./types";

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [loading, setLoading] = useState(false);
  const [fridge, setFridge] = useState<FridgeState>({
    meat: "",
    veg: "",
    staple: "",
  });
  const [options, setOptions] = useState<DishOption[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [lang, setLang] = useState<Language>("zh");

  const t = {
    title: lang === "zh" ? "灵感厨房" : "Inspiration Kitchen",
    subtitle:
      lang === "zh"
        ? "用现有食材烹饪美味"
        : "Artisan Cooking with What You Have",
    inventoryTitle: lang === "zh" ? "冰箱食材" : "Pantry & Fridge",
    meat: lang === "zh" ? "肉类 / 蛋白质" : "Proteins",
    meatPh: lang === "zh" ? "例如：牛肉、鸡蛋、豆腐" : "e.g., Beef, Eggs, Tofu",
    veg: lang === "zh" ? "蔬菜" : "Produce",
    vegPh:
      lang === "zh"
        ? "例如：青椒、番茄、蘑菇"
        : "e.g., Peppers, Tomatoes, Mushrooms",
    staple: lang === "zh" ? "主食" : "Staples",
    staplePh:
      lang === "zh" ? "例如：米饭、面条、面包" : "e.g., Rice, Noodles, Bread",
    actionRecommend: lang === "zh" ? "生成今日菜单" : "Curate Menu",
    loadingRecommend: lang === "zh" ? "正在思考搭配..." : "Chef is thinking...",
    recommendationTitle: lang === "zh" ? "为您推荐" : "Chef's Selections",
    discovered: lang === "zh" ? "3 道菜" : "3 Options",
    cookingTitle: lang === "zh" ? "食谱详情" : "The Recipe",
    steps: lang === "zh" ? "制作步骤" : "Method",
    complete: lang === "zh" ? "完成烹饪" : "Bon Appétit",
    reset: lang === "zh" ? "重置" : "Start Over",
    error: lang === "zh" ? "服务暂时不可用" : "Service unavailable",
    errorRecipe: lang === "zh" ? "读取食谱失败" : "Failed to load recipe",
    recipeCardTag: lang === "zh" ? "精选" : "Curated",
  };

  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  const handleRecommend = async () => {
    if (!fridge.meat && !fridge.veg && !fridge.staple) return;
    setLoading(true);
    try {
      const data = await getRecommendations(fridge, lang);
      setOptions(data);
      setStep(AppStep.SELECTION);
    } catch (e) {
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDish = async (dish: DishOption) => {
    setLoading(true);
    try {
      const details = await getRecipeDetails(dish.name, fridge, lang);
      setRecipe(details);
      setStep(AppStep.COOKING);
    } catch (e) {
      alert(t.errorRecipe);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setRecipe(null);
    setOptions([]);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-[#2A2318] p-3 rounded-xl shadow-lg">
              <Flame className="text-[#D97706] w-6 h-6" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2A2318] tracking-tight serif leading-none">
                {t.title}
              </h1>
              <p className="text-xs font-bold text-[#8B7355] uppercase tracking-[0.15em] mt-1.5">
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleLang}
              className="w-10 h-10 rounded-full border border-[#D6C6A6] text-[#433422] font-black text-xs hover:bg-[#D6C6A6] transition-colors flex items-center justify-center"
              title="Switch Language"
            >
              {lang === "zh" ? "EN" : "中"}
            </button>
            {step !== AppStep.INPUT && (
              <button
                onClick={handleReset}
                className="w-10 h-10 rounded-full border border-[#D6C6A6] text-[#433422] hover:bg-[#D6C6A6] transition-colors flex items-center justify-center"
              >
                <RefreshCw size={16} />
              </button>
            )}
          </div>
        </header>

        {/* STEP 1: INVENTORY (INPUT) */}
        {step === AppStep.INPUT && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="artisan-card p-8 mb-8 relative bg-white">
              <h2 className="text-xl font-bold text-[#2A2318] mb-8 serif flex items-center gap-2 border-b border-[#F0E6D2] pb-4">
                <Scroll size={20} className="text-[#D97706]" />
                {t.inventoryTitle}
              </h2>

              <div className="space-y-6">
                {[
                  { key: "meat", label: t.meat, ph: t.meatPh },
                  { key: "veg", label: t.veg, ph: t.vegPh },
                  { key: "staple", label: t.staple, ph: t.staplePh },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-bold text-[#8B7355] uppercase mb-2 block tracking-wider pl-1">
                      {field.label}
                    </label>
                    <input
                      className="artisan-input w-full p-4 text-lg font-medium text-[#2A2318] placeholder-[#D6C6A6]"
                      placeholder={field.ph}
                      value={(fridge as any)[field.key]}
                      onChange={(e) =>
                        setFridge({ ...fridge, [field.key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleRecommend}
              disabled={
                loading || (!fridge.meat && !fridge.veg && !fridge.staple)
              }
              className="w-full bg-[#2A2318] text-[#FDF6E3] py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> {t.loadingRecommend}
                </>
              ) : (
                <>
                  {t.actionRecommend} <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: SELECTION */}
        {step === AppStep.SELECTION && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-[#2A2318] serif">
                {t.recommendationTitle}
              </h2>
              <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wider border-b-2 border-[#D97706] pb-0.5">
                {t.discovered}
              </span>
            </div>

            <div className="grid gap-4">
              {options.map((dish, i) => (
                <div
                  key={i}
                  onClick={() => !loading && handleSelectDish(dish)}
                  className="artisan-card p-6 cursor-pointer group hover:border-[#D97706] transition-colors relative bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <h3 className="text-xl font-bold text-[#2A2318] serif mb-2 group-hover:text-[#D97706] transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-[#6B5A45] text-sm leading-relaxed mb-4">
                        {dish.description}
                      </p>

                      <div className="flex gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#F5EBD6] text-[#8B7355]`}
                        >
                          {dish.difficulty}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#F5EBD6] text-[#8B7355]">
                          {dish.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="w-10 h-10 rounded-full border border-[#D6C6A6] flex items-center justify-center text-[#D6C6A6] group-hover:border-[#D97706] group-hover:text-[#D97706] transition-all">
                      {loading && i === 0 ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: COOKING */}
        {step === AppStep.COOKING && recipe && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="artisan-card overflow-hidden bg-white shadow-2xl">
              {/* Header Art */}
              <div className="bg-[#2A2318] p-8 sm:p-10 text-[#FDF6E3] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-[#D97706] rounded-full blur-[80px] opacity-20 translate-x-10 -translate-y-10"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#D97706] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                    <BookOpen size={14} /> {t.recipeCardTag}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black mb-4 serif leading-tight">
                    {recipe.name}
                  </h2>
                  <p className="text-[#C0B090] text-lg font-light italic opacity-90">
                    {recipe.description}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                <div className="grid gap-10">
                  <IngredientChecklist
                    ingredients={recipe.ingredients}
                    lang={lang}
                  />

                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b border-[#D6C6A6] pb-4">
                      <h3 className="font-bold text-[#2A2318] text-xl serif">
                        {t.steps}
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {recipe.steps.map((stepItem, idx) => (
                        <StepCard
                          key={idx}
                          step={stepItem}
                          index={idx}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 text-center">
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 bg-[#2A2318] text-[#FDF6E3] font-bold uppercase tracking-widest hover:bg-[#D97706] transition-all rounded-lg shadow-lg hover:shadow-orange-200/50"
                  >
                    {t.complete}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
