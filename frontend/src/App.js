// import React, { useState, useEffect } from 'react';
// import { Timer, CheckCircle, ChefHat, Search, ArrowRight, Utensils } from 'lucide-react';

// const API_BASE = "http://localhost:3001/api";

// export default function App() {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [config, setConfig] = useState({ staples: '', preferences: '' });
//   const [fridge, setFridge] = useState({ meat: '', veg: '', staple: '' });
//   const [options, setOptions] = useState([]);
//   const [selectedDish, setSelectedDish] = useState('');
//   const [recipe, setRecipe] = useState(null);

//   useEffect(() => {
//     fetch(`${API_BASE}/config`).then(res => res.json()).then(setConfig);
//   }, []);

//   const getRecommendations = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/recommend`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...fridge, ...config })
//       });
//       const data = await res.json();
//       setOptions(data);
//       setStep(2);
//     } finally { setLoading(false); }
//   };

//   const getRecipe = async (dish) => {
//     setSelectedDish(dish);
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/generate-recipe`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ dishName: dish, ingredients: Object.values(fridge).join(',') })
//       });
//       const data = await res.json();
//       setRecipe(data.content);
//       setStep(3);
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen bg-[#FFFBF0] text-stone-800 p-6 font-sans">
//       <div className="max-w-md mx-auto">
//         <header className="flex items-center gap-3 mb-10">
//           <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-200">
//             <ChefHat className="text-white" />
//           </div>
//           <h1 className="text-2xl font-black text-orange-950 tracking-tight">灵感厨房</h1>
//         </header>

//         {step === 1 && (
//           <div className="space-y-6">
//             <div className="bg-white p-6 rounded-4xl shadow-sm border border-orange-100/50">
//               <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🛒 我的冰箱</h2>
//               <div className="space-y-4">
//                 {['meat', 'veg', 'staple'].map((key) => (
//                   <div key={key}>
//                     <label className="text-xs font-bold text-orange-400 uppercase ml-2 mb-1 block">
//                       {key === 'meat' ? '肉类' : key === 'veg' ? '蔬菜' : '主食'}
//                     </label>
//                     <input 
//                       className="w-full bg-orange-50/50 border-none rounded-2xl p-4 focus:ring-2 ring-orange-200 outline-none transition-all"
//                       placeholder="想吃点什么？"
//                       value={fridge[key]}
//                       onChange={e => setFridge({...fridge, [key]: e.target.value})}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <button 
//               onClick={getRecommendations}
//               disabled={loading || !fridge.meat}
//               className="w-full bg-orange-500 text-white font-bold py-5 rounded-3xl shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
//             >
//               {loading ? "AI正在巡视冰箱..." : "生成今日菜单"} <Search size={20}/>
//             </button>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <h2 className="text-xl font-bold text-orange-950 mb-6">为您推荐的三个方案:</h2>
//             {options.map((dish, i) => (
//               <div key={i} onClick={() => getRecipe(dish)}
//                 className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 hover:border-orange-400 hover:bg-orange-50/30 cursor-pointer flex justify-between items-center transition-all group">
//                 <span className="text-lg font-bold text-stone-700">{dish}</span>
//                 <ArrowRight className="text-orange-300 group-hover:translate-x-1 transition-transform" />
//               </div>
//             ))}
//             <button onClick={() => setStep(1)} className="w-full py-4 text-stone-400 text-sm">重新输入食材</button>
//           </div>
//         )}

//         {step === 3 && recipe && (
//           <div className="space-y-6 animate-in fade-in duration-500">
//             <div className="bg-white rounded-4xl shadow-2xl overflow-hidden border border-orange-100">
//               <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-8 text-white">
//                 <h2 className="text-3xl font-black">{selectedDish}</h2>
//                 <div className="flex gap-2 mt-3 opacity-90">
//                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">✨ 通俗易懂</span>
//                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">🕒 快速搞定</span>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="mb-6 whitespace-pre-line text-stone-600 bg-orange-50/50 p-4 rounded-3xl text-sm border border-orange-100/50">
//                    {recipe.split('做法：')[0]}
//                 </div>
//                 <div className="space-y-3">
//                   <h3 className="font-black text-lg text-orange-950 flex items-center gap-2 mb-4">
//                     <Utensils size={18}/> 制作步骤
//                   </h3>
//                   {recipe.split('做法：')[1]?.split('\n').filter(l => l.trim()).map((stepText, idx) => (
//                     <StepCard key={idx} text={stepText} />
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <button onClick={() => setStep(1)} className="w-full bg-stone-900 text-white py-5 rounded-3xl font-bold">完成烹饪，下回见！</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function StepCard({ text }) {
//   const [checked, setChecked] = useState(false);
//   const time = text.match(/(\d+)分钟/);
  
//   return (
//     <div 
//       onClick={() => setChecked(!checked)}
//       className={`p-4 rounded-2xl transition-all cursor-pointer border-2 ${checked ? 'bg-stone-50 border-transparent opacity-40' : 'bg-white border-orange-50 hover:border-orange-200'}`}
//     >
//       <div className="flex gap-3">
//         <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${checked ? 'bg-green-500 border-green-500' : 'border-orange-200'}`}>
//           {checked && <CheckCircle size={14} className="text-white" />}
//         </div>
//         <div className="flex-1">
//           <p className={`text-[15px] leading-relaxed ${checked ? 'line-through' : 'text-stone-700'}`}>{text}</p>
//           {time && !checked && (
//             <button onClick={(e) => { e.stopPropagation(); alert('计时器开启: ' + time[1] + '分钟'); }}
//               className="mt-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
//               <Timer size={12}/> 计时 {time[1]} 分钟
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  Play,
  Pause,
  RotateCcw,
  Hourglass,
  ShieldCheck,
  Star,
  CircleDashed,
  ArrowRight,
  Loader2,
  RefreshCw,
  Flame,
  Scroll,
  BookOpen,
  ChefHat,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const API_BASE = "http://localhost:3001/api";

// ============ StepCard Component ============
function StepCard({ step, index, lang }) {
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(step.timeInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const hasTimer = step.timeInSeconds > 0;
  const progress = ((step.timeInSeconds - timeLeft) / step.timeInSeconds) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = (e) => {
    e.stopPropagation();
    if (timeLeft === 0) return;
    setIsRunning(!isRunning);
  };

  const resetTimer = (e) => {
    e.stopPropagation();
    setIsRunning(false);
    setTimeLeft(step.timeInSeconds);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const t = {
    done: lang === "zh" ? "完成" : "DONE",
    reset: lang === "zh" ? "重置" : "Reset",
  };

  return (
    <div
      onClick={() => setCompleted(!completed)}
      className={`
        relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer group select-none
        ${
          completed
            ? "bg-stone-200/50 border-stone-300 opacity-60 scale-[0.98]"
            : "bg-[#FFFBF0] border-[#8B7355] hover:border-[#D97706] shadow-[4px_4px_0px_rgba(67,52,34,0.1)] hover:shadow-[6px_6px_0px_rgba(217,119,6,0.2)] hover:-translate-y-1"
        }
      `}
    >
      <div className="p-5 sm:p-6 flex gap-4 items-start">
        <div className="mt-1 shrink-0">
          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center text-base font-black border-2 transition-all duration-300 shadow-sm
            ${
              completed
                ? "bg-[#65A30D] border-[#65A30D] text-white scale-110"
                : "bg-[#FDF6E3] border-[#8B7355] text-[#8B7355] group-hover:border-[#D97706] group-hover:text-[#D97706] group-hover:scale-110"
            }
          `}
          >
            {completed ? <Check size={18} strokeWidth={4} /> : index + 1}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-[17px] leading-relaxed font-bold transition-colors duration-300 ${completed ? "text-stone-400 line-through" : "text-[#433422]"}`}
          >
            {step.instruction}
          </p>

          {hasTimer && !completed && (
            <div className="mt-4 inline-flex items-center gap-0 bg-gradient-to-r from-[#433422] to-[#2A2318] p-1.5 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#2A2318] rounded-lg border border-[#5C4830]">
                {timeLeft === 0 ? (
                  <Check size={18} className="text-[#65A30D]" />
                ) : (
                  <Hourglass
                    size={18}
                    className={
                      isRunning
                        ? "text-[#D97706] animate-pulse"
                        : "text-stone-400"
                    }
                  />
                )}
                <span
                  className={`font-mono font-bold text-base tracking-widest ${timeLeft === 0 ? "text-[#65A30D]" : "text-[#FDF6E3]"}`}
                >
                  {timeLeft === 0 ? t.done : formatTime(timeLeft)}
                </span>
              </div>

              <div className="flex items-center px-1">
                {timeLeft > 0 && (
                  <button
                    onClick={toggleTimer}
                    className="p-2.5 text-[#FDF6E3] hover:text-[#D97706] active:scale-90 transition-all rounded-lg hover:bg-[#433422]/50"
                  >
                    {isRunning ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                  </button>
                )}

                {timeLeft < step.timeInSeconds && (
                  <button
                    onClick={resetTimer}
                    className="p-2.5 text-stone-500 hover:text-white active:scale-90 transition-all rounded-lg hover:bg-[#433422]/50"
                    title={t.reset}
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
              </div>

              {timeLeft > 0 && timeLeft < step.timeInSeconds && (
                <div
                  className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#D97706] to-[#F59E0B] rounded-full"
                  style={{
                    width: `${progress}%`,
                    transition: "width 1s linear",
                  }}
                ></div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ IngredientChecklist Component ============
function IngredientChecklist({ ingredients, lang }) {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const toggleItem = (id) => {
    const next = new Set(checkedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedItems(next);
  };

  const t = {
    essential: lang === "zh" ? "核心食材 (必须)" : "Essential Items",
    optional: lang === "zh" ? "锦上添花 (可选)" : "Optional / Nice to have",
    ready: lang === "zh" ? "准备就绪" : "Ready to Cook",
  };

  const essentials = ingredients.filter((i) => !i.isOptional);
  const optionals = ingredients.filter((i) => i.isOptional);

  const renderList = (items, title, icon, isEssential) => (
    <div className="mb-6 last:mb-0">
      <h4
        className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${isEssential ? "text-[#8B4513]" : "text-[#6B7280]"}`}
      >
        {icon} {title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {items.map((ing, idx) => {
          const id = `${ing.item}-${idx}`;
          const isChecked = checkedItems.has(id);

          return (
            <div
              key={id}
              onClick={() => toggleItem(id)}
              className={`
                flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer group
                ${
                  isChecked
                    ? "bg-[#E8E6E1] border-transparent opacity-60"
                    : "bg-white border-[#D6C6A6] hover:border-[#D97706] hover:shadow-lg hover:-translate-y-0.5"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all
                  ${
                    isChecked
                      ? "bg-[#65A30D] border-[#65A30D] scale-110"
                      : `bg-transparent ${isEssential ? "border-[#8B4513]" : "border-[#9CA3AF]"} group-hover:scale-110`
                  }
                `}
                >
                  {isChecked && (
                    <Check size={14} className="text-white" strokeWidth={4} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-bold text-base leading-tight ${isChecked ? "text-stone-500 line-through" : "text-[#433422]"}`}
                  >
                    {ing.item}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-serif italic ${isChecked ? "text-stone-400" : "text-[#8B7355]"}`}
              >
                {ing.amount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const allEssentialsChecked = essentials.every((ing, idx) =>
    checkedItems.has(`${ing.item}-${idx}`)
  );

  return (
    <div className="bg-gradient-to-br from-[#F9F7F2] to-[#FDF6E3] rounded-2xl p-6 border-2 border-[#D6C6A6] relative shadow-sm">
      <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#433422] to-[#2A2318] text-[#FDF6E3] text-[11px] font-bold px-4 py-1.5 uppercase tracking-widest shadow-md rounded-lg flex items-center gap-2">
        <ChefHat size={14} />
        Mise en place
      </div>

      {essentials.length > 0 &&
        renderList(
          essentials,
          t.essential,
          <Star size={14} fill="currentColor" />,
          true
        )}
      {optionals.length > 0 &&
        renderList(optionals, t.optional, <CircleDashed size={14} />, false)}

      {allEssentialsChecked && (
        <div className="mt-4 pt-4 border-t-2 border-[#D6C6A6] border-dashed flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="inline-flex items-center gap-2 text-[#65A30D] font-bold text-base bg-gradient-to-r from-[#ECFCCB] to-[#D9F99D] px-5 py-2.5 rounded-full shadow-md">
            <ShieldCheck size={18} /> {t.ready}
          </span>
        </div>
      )}
    </div>
  );
}

// ============ Main App Component ============
export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fridge, setFridge] = useState({
    meat: "",
    veg: "",
    staple: "",
  });
  const [options, setOptions] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [lang, setLang] = useState("zh");

  const t = {
    title: lang === "zh" ? "灵感厨房" : "Inspiration Kitchen",
    subtitle:
      lang === "zh"
        ? "用现有食材烹饪美味"
        : "Artisan Cooking with What You Have",
    inventoryTitle: lang === "zh" ? "冰箱食材" : "Pantry & Fridge",
    meat: lang === "zh" ? "肉类 / 蛋白质" : "Proteins",
    meatPh: lang === "zh" ? "例如:牛肉、鸡蛋、豆腐" : "e.g., Beef, Eggs, Tofu",
    veg: lang === "zh" ? "蔬菜" : "Produce",
    vegPh:
      lang === "zh"
        ? "例如:青椒、番茄、蘑菇"
        : "e.g., Peppers, Tomatoes, Mushrooms",
    staple: lang === "zh" ? "主食" : "Staples",
    staplePh:
      lang === "zh" ? "例如:米饭、面条、面包" : "e.g., Rice, Noodles, Bread",
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
      const res = await fetch(`${API_BASE}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fridge, lang }),
      });
      const data = await res.json();

      setOptions(data);
      setStep(2);
    } catch (e) {
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDish = async (dish) => {
    setLoading(true);
    try {
      const ingredients = Object.values(fridge).filter(Boolean).join(", ");
      const res = await fetch(`${API_BASE}/generate-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dishName: dish.name, ingredients, lang }),
      });
      const data = await res.json();

      setRecipe(data);
      setStep(3);
    } catch (e) {
      alert(t.errorRecipe);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setRecipe(null);
    setOptions([]);
  };

  // Difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFFBF5] to-[#FFF5E6] p-4 sm:p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#2A2318] to-[#1A1410] p-3 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D97706]/20 to-transparent"></div>
              <Flame className="text-[#D97706] w-7 h-7 relative z-10" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#2A2318] to-[#433422] bg-clip-text text-transparent tracking-tight leading-none">
                {t.title}
              </h1>
              <p className="text-xs font-bold text-[#8B7355] uppercase tracking-[0.15em] mt-2 flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#D97706]" />
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleLang}
              className="w-11 h-11 rounded-full border-2 border-[#D6C6A6] bg-white text-[#433422] font-black text-xs hover:bg-[#D6C6A6] hover:scale-110 transition-all shadow-md flex items-center justify-center"
              title="Switch Language"
            >
              {lang === "zh" ? "EN" : "中"}
            </button>
            {step !== 1 && (
              <button
                onClick={handleReset}
                className="w-11 h-11 rounded-full border-2 border-[#D6C6A6] bg-white text-[#433422] hover:bg-[#D6C6A6] hover:scale-110 transition-all shadow-md flex items-center justify-center"
                title={t.reset}
              >
                <RefreshCw size={18} />
              </button>
            )}
          </div>
        </header>

        {/* STEP 1: INVENTORY (INPUT) */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="artisan-card p-8 sm:p-10 mb-8 relative bg-white shadow-xl rounded-2xl border-2 border-[#F0E6D2]">
              <div className="absolute -top-4 left-8 bg-gradient-to-r from-[#D97706] to-[#F59E0B] px-4 py-1.5 rounded-full shadow-lg">
                <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Scroll size={14} />
                  Step 1
                </span>
              </div>

              <h2 className="text-2xl font-black text-[#2A2318] mb-8 mt-2 flex items-center gap-3 border-b-2 border-[#F0E6D2] pb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
                  <Scroll size={20} className="text-white" />
                </div>
                {t.inventoryTitle}
              </h2>

              <div className="space-y-6">
                {[
                  { key: "meat", label: t.meat, ph: t.meatPh },
                  { key: "veg", label: t.veg, ph: t.vegPh },
                  { key: "staple", label: t.staple, ph: t.staplePh },
                ].map((field) => (
                  <div key={field.key} className="group">
                    <label className="text-xs font-bold text-[#8B7355] uppercase mb-2 block tracking-wider pl-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></div>
                      {field.label}
                    </label>
                    <input
                      className="artisan-input w-full p-4 text-lg font-medium text-[#2A2318] placeholder-[#D6C6A6] border-2 border-[#F0E6D2] rounded-xl focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 transition-all outline-none"
                      placeholder={field.ph}
                      value={fridge[field.key]}
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
              className="w-full bg-gradient-to-r from-[#2A2318] via-[#433422] to-[#2A2318] text-[#FDF6E3] py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#D97706]/0 via-[#D97706]/20 to-[#D97706]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    {t.loadingRecommend}
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    {t.actionRecommend}
                    <ArrowRight size={22} />
                  </>
                )}
              </span>
            </button>
          </div>
        )}

        {/* STEP 2: SELECTION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between px-2 mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#2A2318] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
                    <ChefHat size={20} className="text-white" />
                  </div>
                  {t.recommendationTitle}
                </h2>
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-wider bg-gradient-to-r from-[#D97706] to-[#F59E0B] px-4 py-2 rounded-full shadow-lg">
                {t.discovered}
              </span>
            </div>

            <div className="grid gap-5">
              {options.map((dish, i) => (
                <div
                  key={i}
                  onClick={() => !loading && handleSelectDish(dish)}
                  className="artisan-card p-6 cursor-pointer group hover:border-[#D97706] transition-all relative bg-white shadow-lg hover:shadow-2xl border-2 border-[#F0E6D2] rounded-2xl hover:-translate-y-1"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFF8F0] to-[#F5EBD6] border-2 border-[#D6C6A6] flex items-center justify-center font-black text-[#D97706] text-lg shadow-sm group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-[#2A2318] mb-2 group-hover:text-[#D97706] transition-colors leading-tight">
                            {dish.name}
                          </h3>
                          <p className="text-[#6B5A45] text-sm leading-relaxed">
                            {dish.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border ${getDifficultyColor(dish.difficulty)} shadow-sm`}
                        >
                          {dish.difficulty}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 shadow-sm flex items-center gap-1.5">
                          <Flame size={12} />
                          {dish.calories} kcal
                        </span>
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-full border-2 border-[#D6C6A6] bg-white flex items-center justify-center text-[#D6C6A6] group-hover:border-[#D97706] group-hover:text-[#D97706] group-hover:scale-110 transition-all shadow-md">
                      {loading && i === 0 ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: COOKING */}
        {step === 3 && recipe && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="artisan-card overflow-hidden bg-white shadow-2xl rounded-3xl border-2 border-[#F0E6D2]">
              <div className="bg-gradient-to-br from-[#2A2318] via-[#433422] to-[#2A2318] p-10 sm:p-12 text-[#FDF6E3] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97706] rounded-full blur-[120px] opacity-20 translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F59E0B] rounded-full blur-[100px] opacity-10 -translate-x-10 translate-y-10"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-[#D97706] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                    <BookOpen size={16} />
                    <span>{t.recipeCardTag}</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-[#D97706] to-transparent"></div>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
                    {recipe.name}
                  </h2>
                  <p className="text-[#C0B090] text-xl font-light italic opacity-90 leading-relaxed">
                    {recipe.description}
                  </p>
                  <div className="flex gap-2 mt-6 flex-wrap">
                    {recipe.tags &&
                      recipe.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#433422] text-[#D97706] border border-[#D97706]/30"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-12 bg-gradient-to-br from-[#FFFBF5] to-[#FFF8F0]">
                <div className="grid gap-12">
                  <IngredientChecklist
                    ingredients={recipe.ingredients}
                    lang={lang}
                  />

                  <div className="space-y-8">
                    <div className="flex items-center gap-4 border-b-2 border-[#D6C6A6] pb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] flex items-center justify-center shadow-md">
                        <Clock size={20} className="text-white" />
                      </div>
                      <h3 className="font-black text-[#2A2318] text-2xl">
                        {t.steps}
                      </h3>
                    </div>

                    <div className="space-y-4">
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

                <div className="mt-14 pt-10 text-center border-t-2 border-dashed border-[#D6C6A6]">
                  <button
                    onClick={handleReset}
                    className="px-10 py-4 bg-gradient-to-r from-[#2A2318] via-[#433422] to-[#2A2318] text-[#FDF6E3] font-bold uppercase tracking-widest hover:from-[#D97706] hover:via-[#F59E0B] hover:to-[#D97706] transition-all duration-500 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-3"
                  >
                    <TrendingUp size={20} />
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