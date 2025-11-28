import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSampleData = async (scenario: 'clean' | 'dirty'): Promise<string> => {
  try {
    const prompt = scenario === 'clean' 
      ? "Generate a CSV string with 5 rows of financial asset data. Format: AssetID, Value, Date (YYYY-MM-DD). Data should be realistic, positive numbers, dates within last year. Do not include markdown blocks."
      : "Generate a CSV string with 5 rows of financial asset data. Format: AssetID, Value, Date (YYYY-MM-DD). Include at least one negative value and one future date (next year) to trigger validation errors. Do not include markdown blocks.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "데이터 생성 오류";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data if API fails
    if (scenario === 'clean') {
      return `KOSPI_Samsung_Elec, 75000000, 2023-12-01
KOSPI_SK_Hynix, 12500000, 2023-11-15
Bond_KR_Gov_10Y, 500000000, 2023-10-20
ETF_KODEX_200, 3000000, 2023-12-10
Cash_KRW_Reserve, 100000000, 2023-11-30`;
    } else {
      return `KOSPI_Samsung_Elec, -500000, 2023-12-01
Future_Asset_Error, 1000000, 2025-01-01
Valid_Asset_A, 500000, 2023-11-20`;
    }
  }
};