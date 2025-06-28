import type { 
  InheritanceCase, 
  CalculationResult, 
  InheritanceShare, 
  FamilyMember, 
  Fraction,
  FamilyRole 
} from '../types/inheritance';
import { INHERITANCE_RULES } from '../data/islamicRules';

export class InheritanceCalculator {
  
  static calculateInheritance(inheritanceCase: InheritanceCase): CalculationResult {
    const { familyMembers, deceased, estateValue } = inheritanceCase;
    const shares: InheritanceShare[] = [];
    
    // Step 1: Determine who is blocked (Hajb)
    const activeMembers = this.determineActiveMembers(familyMembers);
    
    // Step 2: Calculate Fardh shares first
    const fardhShares = this.calculateFardhShares(activeMembers, deceased);
    
    // Step 3: Calculate total Fardh
    const totalFardh = this.addFractions(fardhShares.map(s => s.share));
    
    // Step 4: Handle Aul (if total > 1) or calculate Asabah
    const { finalShares, isAulCase } = this.handleAsabahAndAul(
      fardhShares, 
      activeMembers, 
      totalFardh
    );
    
    // Step 5: Convert to monetary amounts if estate value provided
    if (estateValue) {
      finalShares.forEach(share => {
        share.amount = this.fractionToDecimal(share.share) * estateValue;
      });
    }
    
    // Step 6: Generate summary
    const summary = this.generateSummary(finalShares, deceased, isAulCase);
    
    return {
      shares: finalShares,
      totalShares: this.addFractions(finalShares.map(s => s.share)),
      isAulCase,
      summary
    };
  }
  
  private static determineActiveMembers(familyMembers: FamilyMember[]): FamilyMember[] {
    const active = familyMembers.filter(m => m.alive);
    const blocked: string[] = [];
    
    // Father blocks paternal grandfather
    if (this.hasRole(active, 'father')) {
      blocked.push(...this.getRoleIds(active, 'paternal_grandfather'));
    }
    
    // Mother blocks grandmothers
    if (this.hasRole(active, 'mother')) {
      blocked.push(...this.getRoleIds(active, 'paternal_grandmother'));
      blocked.push(...this.getRoleIds(active, 'maternal_grandmother'));
    }
    
    // Sons block many relatives
    if (this.hasRole(active, 'son')) {
      blocked.push(...this.getRoleIds(active, 'full_brother'));
      blocked.push(...this.getRoleIds(active, 'paternal_brother'));
      blocked.push(...this.getRoleIds(active, 'maternal_brother'));
      blocked.push(...this.getRoleIds(active, 'full_sister'));
      blocked.push(...this.getRoleIds(active, 'paternal_sister'));
      blocked.push(...this.getRoleIds(active, 'maternal_sister'));
    }
    
    // Full brothers block paternal brothers
    if (this.hasRole(active, 'full_brother')) {
      blocked.push(...this.getRoleIds(active, 'paternal_brother'));
      blocked.push(...this.getRoleIds(active, 'paternal_sister'));
    }
    
    return active.filter(m => !blocked.includes(m.id));
  }
  
  private static calculateFardhShares(
    members: FamilyMember[], 
    deceased: { gender: 'male' | 'female' }
  ): InheritanceShare[] {
    const shares: InheritanceShare[] = [];
    
    for (const member of members) {
      const rules = INHERITANCE_RULES[member.role];
      if (!rules) continue;
      
      const applicableRule = this.findApplicableRule(member, members, deceased, rules);
      
      if (applicableRule && applicableRule.type === 'fardh') {
        shares.push({
          memberId: member.id,
          share: applicableRule.share,
          shareType: 'fardh',
          reasoning: applicableRule.explanation,
          quranicReference: applicableRule.quranicRef
        });
      }
    }
    
    return shares;
  }
  
  private static handleAsabahAndAul(
    fardhShares: InheritanceShare[],
    members: FamilyMember[],
    totalFardh: Fraction
  ): { finalShares: InheritanceShare[], isAulCase: boolean } {
    
    // Check if Aul case (total fardh > 1)
    if (this.fractionToDecimal(totalFardh) > 1) {
      // Proportionally reduce all fardh shares
      const reduction = this.createFraction(1, 1);
      const reducedShares = fardhShares.map(share => ({
        ...share,
        share: this.multiplyFractions(share.share, 
          this.divideFractions(reduction, totalFardh))
      }));
      
      return { finalShares: reducedShares, isAulCase: true };
    }
    
    // Calculate remaining for Asabah
    const remaining = this.subtractFractions(
      this.createFraction(1, 1), 
      totalFardh
    );
    
    const finalShares = [...fardhShares];
    
    // Find Asabah members
    const asabahMembers = members.filter(m => {
      const rules = INHERITANCE_RULES[m.role];
      if (!rules) return false;
      
      const rule = rules.find(r => r.type === 'asabah');
      return rule !== undefined;
    });
    
    if (asabahMembers.length > 0 && this.fractionToDecimal(remaining) > 0) {
      // Distribute remaining among Asabah based on priority and gender
      this.distributeAsabah(asabahMembers, remaining, finalShares);
    }
    
    return { finalShares, isAulCase: false };
  }
  
  private static distributeAsabah(
    asabahMembers: FamilyMember[],
    remaining: Fraction,
    shares: InheritanceShare[]
  ): void {
    
    // Sort by priority (sons first, then brothers, etc.)
    const sortedAsabah = asabahMembers.sort((a, b) => {
      const priorityOrder: Record<FamilyRole, number> = {
        son: 1, grandson_son: 2, father: 3, paternal_grandfather: 4,
        full_brother: 5, paternal_brother: 6, paternal_uncle: 7,
        paternal_nephew: 8, daughter: 9, granddaughter_son: 10,
        full_sister: 11, paternal_sister: 12, maternal_brother: 13,
        maternal_sister: 14, husband: 15, wife: 16, mother: 17,
        paternal_grandmother: 18, maternal_grandmother: 19
      };
      
      return (priorityOrder[a.role] || 999) - (priorityOrder[b.role] || 999);
    });
    
    // Give all remaining to the highest priority Asabah
    const primaryAsabah = sortedAsabah[0];
    
    shares.push({
      memberId: primaryAsabah.id,
      share: remaining,
      shareType: 'asabah',
      reasoning: `Inherits remaining ${this.fractionToString(remaining)} as residuary heir (Asabah)`,
      quranicReference: 'Hadith: Give Faraid to those entitled, remainder to closest male relative'
    });
  }
  
  private static findApplicableRule(
    member: FamilyMember,
    allMembers: FamilyMember[],
    deceased: { gender: 'male' | 'female' },
    rules: any[]
  ) {
    // This would contain complex logic to determine which rule applies
    // Based on the presence/absence of other family members
    
    // Simplified version - just return the first rule for now
    // In a full implementation, this would check all conditions
    return rules[0];
  }
  
  // Helper methods for fraction arithmetic
  private static createFraction(num: number, den: number): Fraction {
    const gcd = this.gcd(num, den);
    return { numerator: num / gcd, denominator: den / gcd };
  }
  
  private static addFractions(fractions: Fraction[]): Fraction {
    if (fractions.length === 0) return { numerator: 0, denominator: 1 };
    
    let result = fractions[0];
    for (let i = 1; i < fractions.length; i++) {
      result = this.addTwoFractions(result, fractions[i]);
    }
    return result;
  }
  
  private static addTwoFractions(a: Fraction, b: Fraction): Fraction {
    const num = a.numerator * b.denominator + b.numerator * a.denominator;
    const den = a.denominator * b.denominator;
    return this.createFraction(num, den);
  }
  
  private static subtractFractions(a: Fraction, b: Fraction): Fraction {
    const num = a.numerator * b.denominator - b.numerator * a.denominator;
    const den = a.denominator * b.denominator;
    return this.createFraction(num, den);
  }
  
  private static multiplyFractions(a: Fraction, b: Fraction): Fraction {
    return this.createFraction(a.numerator * b.numerator, a.denominator * b.denominator);
  }
  
  private static divideFractions(a: Fraction, b: Fraction): Fraction {
    return this.createFraction(a.numerator * b.denominator, a.denominator * b.numerator);
  }
  
  private static fractionToDecimal(fraction: Fraction): number {
    return fraction.numerator / fraction.denominator;
  }
  
  private static fractionToString(fraction: Fraction): string {
    if (fraction.denominator === 1) return fraction.numerator.toString();
    return `${fraction.numerator}/${fraction.denominator}`;
  }
  
  private static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }
  
  // Helper methods for checking family members
  private static hasRole(members: FamilyMember[], role: FamilyRole): boolean {
    return members.some(m => m.role === role);
  }
  
  private static getRoleIds(members: FamilyMember[], role: FamilyRole): string[] {
    return members.filter(m => m.role === role).map(m => m.id);
  }
  
  private static generateSummary(
    shares: InheritanceShare[],
    deceased: { gender: 'male' | 'female' },
    isAulCase: boolean
  ): string {
    let summary = `Inheritance calculation for deceased ${deceased.gender}:\n\n`;
    
    if (isAulCase) {
      summary += "This is an Aul case where total Fardh shares exceed 100%, so all shares are proportionally reduced.\n\n";
    }
    
    shares.forEach(share => {
      summary += `- ${share.shareType.toUpperCase()}: ${this.fractionToString(share.share)}`;
      if (share.amount) {
        summary += ` (${share.amount.toLocaleString()} currency units)`;
      }
      summary += `\n  ${share.reasoning}\n\n`;
    });
    
    return summary;
  }
}