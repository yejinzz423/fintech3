import React, { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { XBRLReport, ValidationRuleResult } from '../types';
import { validateReportData } from '../services/drrLogic';

interface ValidationStepProps {
  report: XBRLReport;
  onReset: () => void;
}

export const ValidationStep: React.FC<ValidationStepProps> = ({ report, onReset }) => {
  const results = useMemo(() => validateReportData(report), [report]);
  const failedCount = results.filter(r => !r.passed).length;
  const passedCount = results.filter(r => r.passed).length;
  const isOverallValid = failedCount === 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="text-regtech-600" /> 
          3단계: 감독 당국 검증 결과
        </h2>
        <p className="text-gray-600 mb-6">
          감독 당국 서버가 수신된 XBRL 데이터를 분석하고 규제 준수 여부를 자동으로 판별했습니다.
        </p>

        {/* Summary Card */}
        <div className={`p-6 rounded-lg border-l-4 mb-8 flex items-center justify-between ${
          isOverallValid 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div>
            <h3 className={`text-lg font-bold ${isOverallValid ? 'text-green-800' : 'text-red-800'}`}>
              {isOverallValid ? '보고서 최종 승인됨' : '보고서 승인 거부됨'}
            </h3>
            <p className={`text-sm ${isOverallValid ? 'text-green-700' : 'text-red-700'}`}>
              {isOverallValid 
                ? '모든 자동 유효성 검사가 성공적으로 통과되었습니다.' 
                : `${failedCount}개의 규칙 위반이 발견되었습니다. 데이터 수정 후 재전송이 필요합니다.`}
            </p>
          </div>
          {isOverallValid ? <CheckCircle size={40} className="text-green-500" /> : <XCircle size={40} className="text-red-500" />}
        </div>

        {/* Detailed Results Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase font-medium">
              <tr>
                <th className="px-4 py-3">판정</th>
                <th className="px-4 py-3">규칙 코드</th>
                <th className="px-4 py-3">검증 항목</th>
                <th className="px-4 py-3">상세 결과</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {result.passed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        통과
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        위반
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{result.ruleId}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{result.description}</td>
                  <td className="px-4 py-3 text-gray-600">{result.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onReset}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
          >
            <RotateCcw size={16} /> 시뮬레이션 초기화
          </button>
        </div>
      </div>
    </div>
  );
};