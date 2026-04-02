import React, { useState, useRef } from 'react';
import { generateVirtualTryOn } from '../lib/gemini';
import { Upload, Camera, Loader2, Image as ImageIcon, RefreshCw, Sparkles, Shirt } from 'lucide-react';
import { motion } from 'motion/react';

export default function VirtualTryOn() {
  const [personImage, setPersonImage] = useState<{ url: string; mime: string } | null>(null);
  const [clothingImage, setClothingImage] = useState<{ url: string; mime: string } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const personInputRef = useRef<HTMLInputElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'person' | 'clothing') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (type === 'person') {
        setPersonImage({ url: result, mime: file.type });
      } else {
        setClothingImage({ url: result, mime: file.type });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      setError('يرجى رفع كل من صورتك الشخصية وصورة الملابس');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await generateVirtualTryOn(
        personImage.url,
        personImage.mime,
        clothingImage.url,
        clothingImage.mime
      );
      setResultImage(result);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء معالجة الصورة. قد تكون الصور غير واضحة أو غير مدعومة.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPersonImage(null);
    setClothingImage(null);
    setResultImage(null);
    setError('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">القياس الافتراضي</h2>
        <p className="text-neutral-500">ارفع صورتك الشخصية وصورة قطعة الملابس التي تود تجربتها، وسيقوم الذكاء الاصطناعي بتركيبها عليك لترى كيف تبدو.</p>
      </div>

      {!resultImage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Person Image Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera size={20} />
              صورتك الشخصية
            </h3>
            <div 
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors overflow-hidden relative min-h-[300px] ${
                personImage ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              {personImage ? (
                <>
                  <img src={personImage.url} alt="Person" className="absolute inset-0 w-full h-full object-contain p-2" />
                  <button 
                    onClick={() => setPersonImage(null)}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm p-2 rounded-full text-neutral-600 hover:text-neutral-900 z-10"
                  >
                    <RefreshCw size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                    <Camera size={32} />
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">التقط صورة أو اختر من المعرض</p>
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => personInputRef.current?.click()}
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
                    >
                      اختيار صورة
                    </button>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={personInputRef} 
                onChange={(e) => handleImageUpload(e, 'person')} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Clothing Image Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shirt size={20} />
              صورة الملابس
            </h3>
            <div 
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors overflow-hidden relative min-h-[300px] ${
                clothingImage ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              {clothingImage ? (
                <>
                  <img src={clothingImage.url} alt="Clothing" className="absolute inset-0 w-full h-full object-contain p-2" />
                  <button 
                    onClick={() => setClothingImage(null)}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm p-2 rounded-full text-neutral-600 hover:text-neutral-900 z-10"
                  >
                    <RefreshCw size={16} />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">اختر صورة قطعة الملابس</p>
                  <div className="flex gap-2 justify-center">
                    <button 
                      onClick={() => clothingInputRef.current?.click()}
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
                    >
                      اختيار صورة
                    </button>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={clothingInputRef} 
                onChange={(e) => handleImageUpload(e, 'clothing')} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 max-w-2xl mx-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="text-yellow-500" size={24} />
              النتيجة
            </h3>
            <button 
              onClick={reset}
              className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
            >
              <RefreshCw size={16} />
              تجربة أخرى
            </button>
          </div>
          <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
            <img src={resultImage} alt="Virtual Try On Result" className="w-full h-auto max-h-[600px] object-contain" />
          </div>
        </motion.div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-50 text-red-600 rounded-lg text-center text-sm border border-red-100">
          {error}
        </div>
      )}

      {!resultImage && (
        <div className="text-center">
          <button
            onClick={handleTryOn}
            disabled={!personImage || !clothingImage || loading}
            className="px-8 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-lg shadow-neutral-900/20"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                جاري المعالجة...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                تطبيق القياس الافتراضي
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
