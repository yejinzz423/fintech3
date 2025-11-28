import React, { useState, useRef } from 'react';
import { FileCode, ArrowRight, Loader2, Sparkles, BookOpen, Upload } from 'lucide-react';
import { generateSampleData } from '../services/geminiService';
import { parseCSV, convertToXBRLJSON } from '../services/drrLogic';
import { XBRLReport } from '../types';

interface DataInputStepProps {
  onComplete: (raw: string, standardized: XBRLReport) => void;
}

// Pre-defined static example data
const DEFAULT_DATA = `KOSPI_Samsung_Elec, 75000000, 2023-12-15
KOSPI_SK_Hynix, 54000000, 2023-11-20
Bond_Gov_KR_10Y, 62000000, 2023-10-05
ETF_KODEX_Lev, 31000000, 2023-09-12
Cash_KRW, 15000000, 2023-11-30`;

export const DataInputStep: React.FC<DataInputStepProps> = ({ onComplete }) => {
  const [csvInput, setCsvInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewJSON, setPreviewJSON] = useState<XBRLReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (type: 'clean' | 'dirty') => {
    setIsGenerating(true);
    const data = await generateSampleData(type);
    setCsvInput(data);
    setPreviewJSON(null); // Reset preview on new data
    setIsGenerating(false);
  };

  const handleDefaultData = () => {
    setCsvInput(DEFAULT_DATA);
    setPreviewJSON(null);
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setCsvInput(content);
        setPreviewJSON(null);
      }
    };
    reader.readAsText(file);
    // Reset inputs so same file can be selected again if needed
    event.target.value = '';
  };

  const handleTransform = () => {
    if (!csvInput.trim()) return;
    const rawData = parseCSV(csvInput);
    const standardized = convertToXBRLJSON(rawData);
    setPreviewJSON(standardized);
  };

  const handleNext = () => {
    if (previewJSON) {
      onComplete(csvInput, previewJSON);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileCode className="text-regtech-600" /> 
          1단계: 데이터 표준화 (XBRL)
        </h2>
        <p className="text-gray-600 mb-6">
          원본 금융 장부 데이터(CSV)를 입력하거나 샘플 데이터를 생성하세요. 
          시스템이 이를 표준 규제 택소노미(Taxonomy)에 맞춰 XBRL 포맷으로 변환합니다.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <label className="text-sm font-semibold text-gray-700">원본 CSV 데이터</label>
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".csv,text/csv,text/plain"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full hover:bg-slate-200 transition flex items-center gap-1"
                >
                  <Upload size={12}/> CSV 파일 업로드
                </button>
                 <button
                  onClick={handleDefaultData}
                  className="text-xs bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full hover:bg-slate-200 transition flex items-center gap-1"
                >
                  <BookOpen size={12}/> 기본 예시 불러오기
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
                <button
                  onClick={() => handleGenerate('clean')}
                  disabled={isGenerating}
                  className="flex-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-lg hover:bg-emerald-100 transition disabled:opacity-50 flex justify-center items-center gap-1"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} AI 생성 (정상)
                </button>
                <button
                  onClick={() => handleGenerate('dirty')}
                  disabled={isGenerating}
                  className="flex-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-2 rounded-lg hover:bg-amber-100 transition disabled:opacity-50 flex justify-center items-center gap-1"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={12}/> : <Sparkles size={12}/>} AI 생성 (오류 포함)
                </button>
            </div>

            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-regtech-500 focus:border-transparent outline-none resize-none bg-gray-50"
              placeholder={`AssetID, Value, Date\n예시:\nSamsung_Elec, 750000, 2023-10-01\n...`}
            />
            <button
              onClick={handleTransform}
              disabled={!csvInput.trim()}
              className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileCode size={16} /> XBRL 포맷으로 변환하기
            </button>
          </div>

          {/* Output Preview Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">표준화된 출력 (JSON/XBRL)</label>
            </div>
            <div className="w-full h-64 p-4 font-mono text-xs border border-gray-300 rounded-lg bg-slate-900 text-green-400 overflow-auto relative">
              {previewJSON ? (
                <pre>{JSON.stringify(previewJSON, null, 2)}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                  <FileCode size={48} className="mb-2 opacity-50" />
                  <p>데이터 변환 대기 중...</p>
                </div>
              )}
            </div>
            <button
              onClick={handleNext}
              disabled={!previewJSON}
              className="w-full py-2 bg-regtech-600 text-white rounded-lg hover:bg-regtech-500 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95 duration-200"
            >
              데이터 전송 단계로 이동 <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};