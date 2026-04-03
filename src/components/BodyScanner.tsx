import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Loader2, Ruler, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { estimateBodyMeasurements, getSizeRecommendations } from '../lib/gemini';

export default function BodyScanner() {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [measurements, setMeasurements] = useState<{ height: number; weight: number; width: number } | null>(null);
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [error, setError] = useState('');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImageSrc(imageSrc);
      processImage(imageSrc);
    }
  }, [webcamRef]);

  const processImage = async (base64Image: string) => {
    setLoading(true);
    setError('');
    try {
      // Extract mime type and base64 data
      const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      
      // Step 1: Estimate measurements
      const estimated = await estimateBodyMeasurements(base64Image, mimeType);
      setMeasurements(estimated);

      // Step 2: Get size recommendations based on estimates
      const recs = await getSizeRecommendations(estimated.height, estimated.weight, estimated.width);
      setRecommendations(recs);
    } catch (err: any) {
      console.error(err);
      setError(`حدث خطأ أثناء تحليل الصورة: ${err?.message || 'تأكد من وضوح الصورة والمحاولة مرة أخرى'}`);
    } finally {
      setLoading(false);
    }
  };

  const retake = () => {
    setImageSrc(null);
    setMeasurements(null);
    setRecommendations(null);
    setError('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">المسح التلقائي للجسم (AI Scanner)</h2>
        <p className="text-neutral-500">قف أمام الكاميرا بكامل جسمك، وسيقوم الذكاء الاصطناعي بتقدير أبعادك (الطول، الوزن، العرض) وتحديد مقاساتك بدقة.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Camera / Image Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
          <div className="relative rounded-xl overflow-hidden bg-neutral-900 aspect-[3/4] flex items-center justify-center">
            {!imageSrc ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-2 border-dashed border-white/30 m-8 rounded-lg pointer-events-none flex items-center justify-center">
                  <div className="text-white/50 text-center px-4">
                    <p className="font-medium">قف بحيث يظهر جسمك كاملاً</p>
                  </div>
                </div>
                <button
                  onClick={capture}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-neutral-900 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <Camera size={28} />
                </button>
              </>
            ) : (
              <>
                <img src={imageSrc} alt="Captured" className="w-full h-full object-cover" />
                <button
                  onClick={retake}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-neutral-900 shadow-sm hover:bg-white transition-colors"
                >
                  <RefreshCw size={20} />
                </button>
                {loading && (
                  <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <Loader2 size={40} className="animate-spin mb-4 text-blue-400" />
                    <p className="font-medium">جاري تحليل أبعاد الجسم...</p>
                  </div>
                )}
              </>
            )}
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {measurements && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Ruler className="text-blue-500" />
                القياسات المستنتجة
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-neutral-50 p-4 rounded-xl text-center border border-neutral-100">
                  <p className="text-sm text-neutral-500 mb-1">الطول</p>
                  <p className="text-2xl font-bold text-neutral-900">{measurements.height}<span className="text-sm font-normal text-neutral-500 mr-1">سم</span></p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl text-center border border-neutral-100">
                  <p className="text-sm text-neutral-500 mb-1">الوزن</p>
                  <p className="text-2xl font-bold text-neutral-900">{measurements.weight}<span className="text-sm font-normal text-neutral-500 mr-1">كجم</span></p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl text-center border border-neutral-100">
                  <p className="text-sm text-neutral-500 mb-1">العرض</p>
                  <p className="text-2xl font-bold text-neutral-900">{measurements.width}<span className="text-sm font-normal text-neutral-500 mr-1">سم</span></p>
                </div>
              </div>
            </motion.div>
          )}

          {recommendations && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-green-500" />
                المقاسات الموصى بها
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 flex justify-between items-center">
                  <span className="text-neutral-600">القميص</span>
                  <span className="font-bold text-lg">{recommendations.shirt}</span>
                </div>
                <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 flex justify-between items-center">
                  <span className="text-neutral-600">البنطلون</span>
                  <span className="font-bold text-lg">{recommendations.pants}</span>
                </div>
                <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 flex justify-between items-center">
                  <span className="text-neutral-600">التيشرت</span>
                  <span className="font-bold text-lg">{recommendations.tshirt}</span>
                </div>
                <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 flex justify-between items-center">
                  <span className="text-neutral-600">البلوفر</span>
                  <span className="font-bold text-lg">{recommendations.pullover}</span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 text-blue-900 rounded-xl text-sm leading-relaxed border border-blue-100">
                <strong>نصيحة: </strong>
                {recommendations.advice}
              </div>
            </motion.div>
          )}

          {!measurements && !loading && (
            <div className="h-full flex items-center justify-center text-neutral-400 p-8 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
              التقط صورة ليقوم الذكاء الاصطناعي بتحليلها واستخراج القياسات والمقاسات المناسبة لك فوراً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
