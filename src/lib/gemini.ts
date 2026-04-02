import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getSizeRecommendations(height: number, weight: number, width: number) {
  const prompt = `بناءً على قياسات الجسم التالية:
الطول: ${height} سم
الوزن: ${weight} كجم
العرض/محيط الصدر: ${width} سم

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

export async function generateVirtualTryOn(personImageBase64: string, personMimeType: string, clothingImageBase64: string, clothingMimeType: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: personImageBase64.split(',')[1],
            mimeType: personMimeType,
          },
        },
        {
          inlineData: {
            data: clothingImageBase64.split(',')[1],
            mimeType: clothingMimeType,
          },
        },
        {
          text: 'قم بتعديل الصورة الأولى (للشخص) بحيث يرتدي قطعة الملابس الموجودة في الصورة الثانية. اجعل التعديل واقعياً قدر الإمكان مع الحفاظ على ملامح الشخص وخلفية الصورة.',
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("لم يتم العثور على صورة في الرد");
}
