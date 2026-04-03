import { GoogleGenAI, Type } from "@google/genai";

export async function getSizeRecommendations(height: number, weight: number, width?: number) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY as string });
  const widthText = width ? `العرض/محيط الصدر: ${width} سم` : 'العرض/محيط الصدر: غير متوفر';
  const prompt = `بناءً على قياسات الجسم التالية:
الطول: ${height} سم
الوزن: ${weight} كجم
${widthText}

يرجى التوصية بالمقاسات المناسبة للملابس التالية:
1. قميص
2. بنطلون
3. تيشرت
4. بلوفر

قم بإرجاع النتيجة بتنسيق JSON يحتوي على المفاتيح التالية:
- shirt (مقاس القميص)
- pants (مقاس البنطلون)
- tshirt (مقاس التيشرت)
- pullover (مقاس البلوفر)
- advice (نصيحة عامة حول شكل الجسم والملابس المناسبة)`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          shirt: { type: Type.STRING },
          pants: { type: Type.STRING },
          tshirt: { type: Type.STRING },
          pullover: { type: Type.STRING },
          advice: { type: Type.STRING },
        },
        required: ["shirt", "pants", "tshirt", "pullover", "advice"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateVirtualTryOn(
  personImageBase64: string, 
  personMimeType: string, 
  clothingImages: { url: string; mime: string }[]
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY as string });
  
  const parts: any[] = [
    {
      inlineData: {
        data: personImageBase64.split(',')[1],
        mimeType: personMimeType,
      },
    }
  ];

  clothingImages.forEach(img => {
    parts.push({
      inlineData: {
        data: img.url.split(',')[1],
        mimeType: img.mime,
      }
    });
  });

  parts.push({
    text: 'قم بتعديل الصورة الأولى (للشخص) بحيث يرتدي جميع قطع الملابس الموجودة في الصور الأخرى. اجعل التعديل واقعياً جداً وعالي الدقة (High Resolution, Photorealistic, 4k) بحيث يظهر الجسم كاملاً متناسقاً مع الملابس. حافظ على ملامح الشخص وخلفية الصورة الأصلية قدر الإمكان.',
  });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("لم يتم العثور على صورة في الرد");
}

export async function editImage(
  imageBase64: string,
  mimeType: string,
  prompt: string
) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY as string });
  
  const parts: any[] = [
    {
      inlineData: {
        data: imageBase64.split(',')[1],
        mimeType: mimeType,
      },
    },
    {
      text: prompt,
    }
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("لم يتم العثور على صورة في الرد");
}
