export interface FamilyMember {
  id: string;
  role: FamilyRole;
  name?: string;
  alive: boolean;
  gender: 'male' | 'female';
}

export type FamilyRole = 
  | 'father' | 'mother' | 'paternal_grandfather' | 'paternal_grandmother' 
  | 'maternal_grandmother' | 'husband' | 'wife' | 'son' | 'daughter'
  | 'full_brother' | 'full_sister' | 'paternal_brother' | 'paternal_sister'
  | 'maternal_brother' | 'maternal_sister' | 'paternal_uncle' | 'paternal_nephew'
  | 'grandson_son' | 'granddaughter_son';

export interface InheritanceShare {
  memberId: string;
  share: Fraction;
  shareType: 'fardh' | 'asabah' | 'blocked';
  amount?: number;
  reasoning: string;
  quranicReference?: string;
  hadithReference?: string;
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface InheritanceCase {
  deceased: {
    gender: 'male' | 'female';
  };
  familyMembers: FamilyMember[];
  estateValue?: number;
  userRole?: FamilyRole;
}

export interface CalculationResult {
  shares: InheritanceShare[];
  totalShares: Fraction;
  isAulCase: boolean;
  summary: string;
}

export interface IslamicRule {
  condition: string;
  share: Fraction;
  type: 'fardh' | 'asabah';
  quranicRef: string;
  explanation: string;
  priority: number;
}