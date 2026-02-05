import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle, ChefHat, Search, ArrowRight, Utensils } from 'lucide-react';

const API_BASE = "http://localhost:3001/api";

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ staples: '', preferences: '' });
  const [fridge, setFridge] = useState({ meat: '', veg: '', staple: '' });
  const [options, setOptions] = useState([]);
  const [selectedDish, setSelectedDish] = useState('');
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/config`).then(res => res.json()).then(setConfig);
  }, []);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fridge, ...config })
      });
      const data = await res.json();
      setOptions(data);
      setStep(2);
    } finally { setLoading(false); }
  };

  const getRecipe = async (dish) => {
    setSelectedDish(dish);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate-recipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName: dish, ingredients: Object.values(fridge).join(',') })
      });
      const data = await res.json();
      setRecipe(data.content);
      setStep(3);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-stone-800 p-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-3 mb-10">
          <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-200">
            <ChefHat className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-orange-950 tracking-tight">灵感厨房</h1>
        </header>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-4xl shadow-sm border border-orange-100/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">🛒 我的冰箱</h2>
              <div className="space-y-4">
                {['meat', 'veg', 'staple'].map((key) => (
                  <div key={key}>
                    <label className="text-xs font-bold text-orange-400 uppercase ml-2 mb-1 block">
                      {key === 'meat' ? '肉类' : key === 'veg' ? '蔬菜' : '主食'}
                    </label>
                    <input 
                      className="w-full bg-orange-50/50 border-none rounded-2xl p-4 focus:ring-2 ring-orange-200 outline-none transition-all"
                      placeholder="想吃点什么？"
                      value={fridge[key]}
                      onChange={e => setFridge({...fridge, [key]: e.target.value})}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={getRecommendations}
              disabled={loading || !fridge.meat}
              className="w-full bg-orange-500 text-white font-bold py-5 rounded-3xl shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "AI正在巡视冰箱..." : "生成今日菜单"} <Search size={20}/>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-orange-950 mb-6">为您推荐的三个方案:</h2>
            {options.map((dish, i) => (
              <div key={i} onClick={() => getRecipe(dish)}
                className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100 hover:border-orange-400 hover:bg-orange-50/30 cursor-pointer flex justify-between items-center transition-all group">
                <span className="text-lg font-bold text-stone-700">{dish}</span>
                <ArrowRight className="text-orange-300 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
            <button onClick={() => setStep(1)} className="w-full py-4 text-stone-400 text-sm">重新输入食材</button>
          </div>
        )}

        {step === 3 && recipe && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white rounded-4xl shadow-2xl overflow-hidden border border-orange-100">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-8 text-white">
                <h2 className="text-3xl font-black">{selectedDish}</h2>
                <div className="flex gap-2 mt-3 opacity-90">
                   <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">✨ 通俗易懂</span>
                   <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">🕒 快速搞定</span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6 whitespace-pre-line text-stone-600 bg-orange-50/50 p-4 rounded-3xl text-sm border border-orange-100/50">
                   {recipe.split('做法：')[0]}
                </div>
                <div className="space-y-3">
                  <h3 className="font-black text-lg text-orange-950 flex items-center gap-2 mb-4">
                    <Utensils size={18}/> 制作步骤
                  </h3>
                  {recipe.split('做法：')[1]?.split('\n').filter(l => l.trim()).map((stepText, idx) => (
                    <StepCard key={idx} text={stepText} />
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setStep(1)} className="w-full bg-stone-900 text-white py-5 rounded-3xl font-bold">完成烹饪，下回见！</button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepCard({ text }) {
  const [checked, setChecked] = useState(false);
  const time = text.match(/(\d+)分钟/);
  
  return (
    <div 
      onClick={() => setChecked(!checked)}
      className={`p-4 rounded-2xl transition-all cursor-pointer border-2 ${checked ? 'bg-stone-50 border-transparent opacity-40' : 'bg-white border-orange-50 hover:border-orange-200'}`}
    >
      <div className="flex gap-3">
        <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${checked ? 'bg-green-500 border-green-500' : 'border-orange-200'}`}>
          {checked && <CheckCircle size={14} className="text-white" />}
        </div>
        <div className="flex-1">
          <p className={`text-[15px] leading-relaxed ${checked ? 'line-through' : 'text-stone-700'}`}>{text}</p>
          {time && !checked && (
            <button onClick={(e) => { e.stopPropagation(); alert('计时器开启: ' + time[1] + '分钟'); }}
              className="mt-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
              <Timer size={12}/> 计时 {time[1]} 分钟
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
