export type RelationType = 
  | 'help' 
  | 'communication' 
  | 'trust' 
  | 'hierarchy' 
  | 'other';

export interface Option {
  id: string;
  label: string;
  description?: string;
  nextStep?: string;
  recommendationId?: string;
}

export interface QuestionNode {
  id: string;
  question: string;
  options: Option[];
}

export interface Recommendation {
  id: string;
  businessTitle: string;
  businessDescription: string;
  justification: string;
  technicalDetails: {
    method: string;
    whatItMeasures: string;
    software: string;
  };
  nextSteps: string[];
}
