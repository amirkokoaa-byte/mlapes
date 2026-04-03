import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Image as ImageIcon, Shirt, Plus, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function ARMirror() {
  const webcamRef = useRef<Webcam>(null);
  const clothingInputRef = useRef<HTMLInputElement>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);

  const handleClothingUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setClothingImage(result);
    };
    reader.readAsDataURL(file);
    
    if (clothingInputRef.current) clothingInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">مرآة الواقع المعزز (AR Mirror)</h2>
        <p className="text-neutral-500">افتح الكاميرا وارفع صورة لقطعة ملابس، ثم قم بتحريكها وتكبيرها لتناسب جسمك وكأنك تقف أمام مرآة حقيقية.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shirt size={20} />
              قطعة الملابس
            </h3>
            
            {clothingImage ? (
              <div className="relative aspect-square bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden group">
                <img src={clothingImage} alt="Clothing" className="w-full h-full object-contain p-4" />
                <button 
                  onClick={() => setClothingImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => clothingInputRef.current?.click()}
                className="w-full aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:border-neutral-400 transition-colors"
              >
                <Plus size={32} className="mb-2" />
                <span className="text-sm font-medium">اختر قطعة ملابس</span>
              </button>
            )}
            <input 
              type="file" 
              ref={clothingInputRef} 
              onChange={handleClothingUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            {clothingImage && (
              <p className="text-xs text-neutral-500 mt-4 text-center">
                يمكنك سحب قطعة الملابس فوق الكاميرا لتغيير موضعها
              </p>
            )}
          </div>
        </div>

        {/* AR Mirror View */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
            <div className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-[4/3] md:aspect-video flex items-center justify-center">
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored={true}
                videoConstraints={{ facingMode: "user" }}
                className="w-full h-full object-cover"
              />
              
              {/* Draggable Clothing Overlay */}
              {clothingImage && (
                <motion.div
                  drag
                  dragMomentum={false}
                  className="absolute cursor-move touch-none"
                  style={{ width: '250px', height: '250px' }}
                  initial={{ x: 0, y: 0 }}
                >
                  <img 
                    src={clothingImage} 
                    alt="AR Overlay" 
                    className="w-full h-full object-contain drop-shadow-2xl"
                    draggable={false}
                  />
                  {/* Resize Handle (Visual only for now, actual resize requires more complex state) */}
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm opacity-0 hover:opacity-100 transition-opacity cursor-se-resize" />
                </motion.div>
              )}

              {!clothingImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm">
                    ارفع صورة ملابس لتبدأ التجربة
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
