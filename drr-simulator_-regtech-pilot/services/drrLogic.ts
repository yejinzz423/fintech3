import { RawAssetData, XBRLReport, ValidationRuleResult } from '../types';

// 1. Data Standardization Logic
export const parseCSV = (csvInput: string): RawAssetData[] => {
  const lines = csvInput.trim().split('\n');
  const data: RawAssetData[] = [];

  // Skip header if exists, assuming simple CSV structure: ID, Value, Date
  // If the first line contains "id" or "asset" or "자산", we skip it.
  const startIndex = lines[0].toLowerCase().includes('id') || lines[0].includes('자산') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 3) {
      data.push({
        assetId: parts[0].trim(),
        value: parseFloat(parts[1].trim()),
        date: parts[2].trim(),
      });
    }
  }
  return data;
};

export const convertToXBRLJSON = (data: RawAssetData[]): XBRLReport => {
  const report: XBRLReport = {
    header: {
      taxonomy: "ifrs-full-2024",
      entity: "FIN-INST-001",
      reportDate: new Date().toISOString().split('T')[0],
    },
    facts: {}
  };

  // Transform raw rows into "Facts"
  data.forEach((row) => {
    const conceptName = `Assets.FinancialValue.${row.assetId}`;
    
    if (!report.facts[conceptName]) {
      report.facts[conceptName] = [];
    }

    report.facts[conceptName].push({
      contextRef: `AsOf_${row.date}`,
      unitRef: "KRW", // Changed to KRW for Korean context
      decimals: 0,
      value: row.value
    });
  });

  return report;
};

// 2. Transmission Simulation (Mock API)
export const simulateTransmission = async (): Promise<{ status: number; message: string }> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 90% chance of success for demo purposes
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    return { status: 200, message: "보고서가 성공적으로 접수되었습니다. 유효성 검증 대기 중입니다." };
  } else {
    throw new Error("503 서비스 사용 불가: 게이트웨이 시간 초과");
  }
};

// 3. Validation Logic (Rule Engine)
export const validateReportData = (report: XBRLReport): ValidationRuleResult[] => {
  const results: ValidationRuleResult[] = [];
  const today = new Date();

  // Extract all facts
  Object.entries(report.facts).forEach(([concept, facts]) => {
    facts.forEach(fact => {
      // Rule 1: Values cannot be negative (Simulating basic solvency check)
      const val = Number(fact.value);
      const isPositive = val >= 0;
      results.push({
        ruleId: "R001-자산건전성",
        description: `${concept}의 자산 가치 검증`,
        passed: isPositive,
        details: isPositive 
          ? `값 ${val.toLocaleString()}은(는) 유효합니다.` 
          : `값 ${val.toLocaleString()}은(는) 유효하지 않습니다 (0 이상이어야 함).`
      });

      // Rule 2: Date cannot be in the future
      const contextDateStr = fact.contextRef.replace('AsOf_', '');
      const reportDate = new Date(contextDateStr);
      const isPastOrToday = reportDate <= today;
      
      results.push({
        ruleId: "R002-보고기한준수",
        description: `${concept}의 보고 기준일 검증`,
        passed: isPastOrToday,
        details: isPastOrToday
          ? `날짜 ${contextDateStr}은(는) 유효합니다.`
          : `날짜 ${contextDateStr}은(는) 미래 날짜로 설정되어 있어 유효하지 않습니다.`
      });
    });
  });

  return results;
};