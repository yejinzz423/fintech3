export interface RawAssetData {
  assetId: string;
  value: number;
  date: string; // YYYY-MM-DD
}

// Simulating a simplified XBRL-like JSON structure
export interface XBRLFact {
  contextRef: string; // e.g., "AsOf_2023-10-27"
  unitRef: string;    // e.g., "USD"
  decimals: number;
  value: number | string;
}

export interface XBRLReport {
  header: {
    taxonomy: string;
    entity: string;
    reportDate: string;
  };
  facts: {
    [conceptName: string]: XBRLFact[];
  };
}

export interface ValidationRuleResult {
  ruleId: string;
  description: string;
  passed: boolean;
  details: string;
}

export enum StepState {
  IDLE = 'idle',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error'
}