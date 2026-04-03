import React, { useState, useRef } from 'react';
import { generateVirtualTryOn } from '../lib/gemini';
import { Upload, Camera, Loader2, Image as ImageIcon, RefreshCw, Sparkles, Shirt, X, Plus, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function VirtualTryOn() {
  const [personImage, setPersonImage] = useState<{ url: string; mime: string } | null>(null);
  const [clothingImages, setClothingImages] = useState<{ url: string; mime: string }[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const personInputRef = useRef<HTMLInputElement>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);

  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPersonImage({ url: result, mime: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleClothingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (clothingImages.length + files.length > 5) {
      setError('يمكنك اختيار 5 صور كحد أقصى لقطع الملابس');
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setClothingImages(prev => [...prev, { url: result, mime: file.type }]);
      };
      reader.readAsDataURL(file);
    });
    
    if (clothingInputRef.current) clothingInputRef.current.value = '';
  };

  const removeClothingImage = (index: number) => {
    setClothingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleTryOn = async () => {
    if (!personImage || clothingImages.length === 0) {
      setError('يرجى رفع كل من صورتك الشخصية وصورة واحدة على الأقل للملابس');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await generateVirtualTryOn(
        personImage.url,
        personImage.mime,
        clothingImages
      );
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError(`حدث خطأ أثناء معالجة الصورة: ${err?.message || 'خطأ غير معروف'}. يرجى التأكد من أن الصور واضحة ومناسبة.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'clothes-virtual-tryon.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setPersonImage(null);
    setClothingImages([]);
    setResultImage(null);
    setError('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">القياس الافتراضي</h2>
        <p className="text-neutral-500">ارفع صورتك الشخصية وصور قطع الملابس (حتى 5 قطع)، وسيقوم الذكاء الاصطناعي بتركيبها عليك لترى كيف تبدو بشكل كامل.</p>
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
                onChange={handlePersonUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          {/* Clothing Images Upload */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shirt size={20} />
                قطع الملابس ({clothingImages.length}/5)
              </h3>
              {clothingImages.length > 0 && clothingImages.length < 5 && (
                <button 
                  onClick={() => clothingInputRef.current?.click()}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + إضافة المزيد
                </button>
              )}
            </div>
            
            <div className={`flex-1 border-2 border-dashed rounded-xl p-4 transition-colors relative min-h-[300px] ${
              clothingImages.length > 0 ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-300 hover:border-neutral-400 flex flex-col items-center justify-center'
            }`}>
              {clothingImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {clothingImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square bg-white rounded-lg border border-neutral-200 overflow-hidden group">
                      <img src={img.url} alt={`Clothing ${idx + 1}`} className="w-full h-full object-contain p-2" />
                      <button 
                        onClick={() => removeClothingImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {clothingImages.length < 5 && (
                    <button 
                      onClick={() => clothingInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors"
                    >
                      <Plus size={24} />
                      <span className="text-xs mt-1">إضافة</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center w-full">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">اختر حتى 5 صور لقطع الملابس</p>
                  <button 
                    onClick={() => clothingInputRef.current?.click()}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800"
                  >
                    اختيار صور
                  </button>
                </div>
              )}
              <input 
                type="file" 
                ref={clothingInputRef} 
                onChange={handleClothingUpload} 
                accept="image/*" 
                multiple
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
            <div className="flex gap-3">
              <button 
                onClick={handleDownload}
                className="text-sm bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
              >
                <Download size={16} />
                تحميل الصورة
              </button>
              <button 
                onClick={reset}
                className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <RefreshCw size={16} />
                تجربة أخرى
              </button>
            </div>
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
            disabled={!personImage || clothingImages.length === 0 || loading}
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
