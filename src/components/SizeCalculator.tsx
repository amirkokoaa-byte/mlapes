import React, { useState } from 'react';
import { getSizeRecommendations } from '../lib/gemini';
import { Loader2, Ruler, Weight, Maximize2, Shirt, Info, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function SizeCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [width, setWidth] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight) {
      setError('يرجى إدخال الطول والوزن على الأقل');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await getSizeRecommendations(Number(height), Number(weight), width ? Number(width) : undefined);
      setResult(res);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء حساب المقاسات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">حاسبة المقاسات الذكية</h2>
          <p className="text-neutral-500">أدخل قياساتك للحصول على توصيات دقيقة لمقاسات الملابس المختلفة.</p>
        </div>

        <form onSubmit={handleCalculate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">الطول (سم)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                <Ruler size={18} />
              </div>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="block w-full pr-10 pl-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow"
                placeholder="مثال: 175"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">الوزن (كجم)</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                <Weight size={18} />
              </div>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="block w-full pr-10 pl-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow"
                placeholder="مثال: 70"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">العرض / محيط الصدر (سم) - <span className="text-neutral-400 font-normal">اختياري</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                <Maximize2 size={18} />
              </div>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="block w-full pr-10 pl-3 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow"
                placeholder="مثال: 100"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Shirt size={20} />}
            <span>{loading ? 'جاري الحساب...' : 'احصل على المقاسات'}</span>
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div>
        {result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 text-white p-6 rounded-2xl shadow-lg h-full flex flex-col"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="text-yellow-400" size={24} />
              المقاسات الموصى بها
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700">
                <div className="text-neutral-400 text-sm mb-1">القميص</div>
                <div className="text-2xl font-bold">{result.shirt}</div>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700">
                <div className="text-neutral-400 text-sm mb-1">التيشرت</div>
                <div className="text-2xl font-bold">{result.tshirt}</div>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700">
                <div className="text-neutral-400 text-sm mb-1">البنطلون</div>
                <div className="text-2xl font-bold">{result.pants}</div>
              </div>
              <div className="bg-neutral-800/50 p-4 rounded-xl border border-neutral-700">
                <div className="text-neutral-400 text-sm mb-1">البلوفر</div>
                <div className="text-2xl font-bold">{result.pullover}</div>
              </div>
            </div>

            <div className="mt-auto bg-neutral-800/50 p-4 rounded-xl border border-neutral-700 flex gap-3">
              <Info className="shrink-0 text-blue-400" size={20} />
              <p className="text-sm text-neutral-300 leading-relaxed">{result.advice}</p>
            </div>
          </motion.div>
        ) : (
          <div className="h-full bg-neutral-100 rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 p-8 text-center min-h-[400px]">
            <Shirt size={48} className="mb-4 opacity-50" />
            <p>أدخل قياساتك واضغط على "احصل على المقاسات" لرؤية النتيجة هنا.</p>
          </div>
        )}
      </div>
    </div>
  );
}
