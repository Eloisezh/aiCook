import React, { useState } from 'react';
import { Check, ShieldCheck, Star, CircleDashed } from 'lucide-react';
import { Language, Ingredient } from '../types';

interface IngredientChecklistProps {
  ingredients: Ingredient[];
  lang: Language;
}

export const IngredientChecklist: React.FC<IngredientChecklistProps> = ({ ingredients, lang }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const next = new Set(checkedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCheckedItems(next);
  };

  const t = {
    essential: lang === 'zh' ? '核心食材 (必须)' : 'Essential Items',
    optional: lang === 'zh' ? '锦上添花 (可选)' : 'Optional / Nice to have',
    ready: lang === 'zh' ? '准备就绪' : 'Ready to Cook',
  };

  const essentials = ingredients.filter(i => !i.isOptional);
  const optionals = ingredients.filter(i => i.isOptional);

  // Helper to render a list section
  const renderList = (items: Ingredient[], title: string, icon: React.ReactNode, isEssential: boolean) => (
    <div className="mb-6 last:mb-0">
      <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${isEssential ? 'text-[#8B4513]' : 'text-[#6B7280]'}`}>
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
                flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group
                ${isChecked 
                  ? 'bg-[#E8E6E1] border-transparent opacity-60' 
                  : 'bg-white border-[#D6C6A6] hover:border-[#D97706] hover:shadow-md'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center border transition-all
                  ${isChecked 
                    ? 'bg-[#65A30D] border-[#65A30D]' 
                    : `bg-transparent ${isEssential ? 'border-[#8B4513]' : 'border-[#9CA3AF]'}`
                  }
                `}>
                  {isChecked && <Check size={12} className="text-white" strokeWidth={4} />}
                </div>
                <div className="flex flex-col">
                  <span className={`font-bold text-sm leading-tight ${isChecked ? 'text-stone-500 line-through' : 'text-[#433422]'}`}>
                    {ing.item}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-serif italic ${isChecked ? 'text-stone-400' : 'text-[#8B7355]'}`}>
                {ing.amount}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );

  const allEssentialsChecked = essentials.every((ing, idx) => checkedItems.has(`${ing.item}-${idx}`));

  return (
    <div className="bg-[#F9F7F2] rounded-xl p-6 border border-[#D6C6A6] relative">
       {/* Badge */}
      <div className="absolute -top-3 left-6 bg-[#433422] text-[#FDF6E3] text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-sm rounded-sm">
        Mise en place
      </div>

      {essentials.length > 0 && renderList(essentials, t.essential, <Star size={12} fill="currentColor"/>, true)}
      {optionals.length > 0 && renderList(optionals, t.optional, <CircleDashed size={12}/>, false)}

      {allEssentialsChecked && (
        <div className="mt-4 pt-4 border-t border-[#D6C6A6] border-dashed flex justify-center animate-in fade-in slide-in-from-bottom-2">
           <span className="inline-flex items-center gap-2 text-[#65A30D] font-bold text-sm bg-[#ECFCCB] px-4 py-2 rounded-full">
             <ShieldCheck size={16}/> {t.ready}
           </span>
        </div>
      )}
    </div>
  );
};