import React, { useState } from 'react';
import { Send, Server, CheckCircle2, XCircle, ArrowRight, Activity } from 'lucide-react';
import { simulateTransmission } from '../services/drrLogic';

interface TransmissionStepProps {
  onComplete: () => void;
}

export const TransmissionStep: React.FC<TransmissionStepProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleTransmit = async () => {
    setStatus('sending');
    setLogs([]);
    addLog('감독 당국 API와 보안 핸드셰이크 시작...');
    addLog('TLS 1.3 암호화 연결 수립 중...');
    addLog('페이로드 암호화 중 (AES-256)...');
    
    try {
      addLog('POST /api/v1/regulatory-filings 전송 중...');
      const response = await simulateTransmission();
      addLog(`응답 수신: HTTP ${response.status} OK`);
      addLog(response.message);
      setStatus('success');
    } catch (error) {
      addLog('오류: 연결 시간이 초과되었거나 호스트에 의해 거부되었습니다.');
      setStatus('error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Send className="text-regtech-600" /> 
          2단계: 데이터 자동 전송
        </h2>
        <p className="text-gray-600 mb-8">
          표준화된 XBRL 데이터가 준비되었습니다. 실제 환경에서는 API를 통해 규제 감독 기관으로 안전하게 전송됩니다.
        </p>

        <div className="flex flex-col items-center justify-center py-8">
          
          {/* Visualizing the flow */}
          <div className="flex items-center justify-center w-full max-w-2xl mb-12 relative">
            {/* Bank Node */}
            <div className="flex flex-col items-center z-10">
              <div className="w-16 h-16 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-center shadow-md">
                <Server className="text-slate-600" />
              </div>
              <span className="mt-2 text-sm font-semibold text-slate-600">금융사 내부 시스템</span>
            </div>

            {/* Connection Line & Particle */}
            <div className="flex-1 h-1 bg-gray-200 mx-4 relative overflow-hidden rounded-full">
               {status === 'sending' && (
                 <div className="absolute top-0 left-0 w-1/3 h-full bg-regtech-500 animate-slide rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]"></div>
               )}
            </div>

            {/* Supervisor Node */}
            <div className="flex flex-col items-center z-10">
              <div className={`w-16 h-16 border-2 rounded-xl flex items-center justify-center shadow-md transition-colors duration-300 ${
                status === 'success' ? 'bg-green-50 border-green-500 text-green-600' : 
                status === 'error' ? 'bg-red-50 border-red-500 text-red-600' :
                'bg-white border-slate-300 text-slate-600'
              }`}>
                {status === 'success' ? <CheckCircle2 /> : status === 'error' ? <XCircle /> : <Server />}
              </div>
              <span className="mt-2 text-sm font-semibold text-slate-600">금융 감독 당국 API</span>
            </div>
          </div>

          {/* Controls */}
          {status === 'idle' || status === 'error' ? (
            <button
              onClick={handleTransmit}
              className="px-8 py-3 bg-regtech-600 text-white rounded-full font-bold shadow-lg hover:bg-regtech-500 hover:shadow-xl transition transform active:scale-95 flex items-center gap-2"
            >
              <Activity size={18} /> 보고서 전송 시작
            </button>
          ) : status === 'sending' ? (
            <div className="text-regtech-600 font-medium animate-pulse">데이터를 전송하고 있습니다...</div>
          ) : (
            <div className="text-green-600 font-bold text-lg flex items-center gap-2">
              <CheckCircle2 size={24} /> 전송 완료
            </div>
          )}

          {/* Terminal Logs */}
          <div className="w-full max-w-2xl mt-10 bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-300 h-40 overflow-y-auto border border-slate-700 shadow-inner">
            <div className="border-b border-slate-700 pb-2 mb-2 text-slate-500 uppercase text-[10px] tracking-wider">시스템 로그</div>
            {logs.length === 0 && <span className="opacity-30">대기 중...</span>}
            {logs.map((log, i) => (
              <div key={i} className="mb-1">{log}</div>
            ))}
          </div>

        </div>

        {status === 'success' && (
          <div className="flex justify-end mt-6">
            <button
              onClick={onComplete}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition flex items-center gap-2"
            >
              결과 및 유효성 검증 확인 <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slide {
          0% { left: -30%; }
          100% { left: 100%; }
        }
        .animate-slide {
          animation: slide 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};