import type { FamilyRole, IslamicRule, Fraction } from '../types/inheritance';

export const QURANIC_VERSES = {
  MAIN_INHERITANCE: "Allah instructs you concerning your children: for the male, what is equal to the share of two females. But if there are [only] daughters, two or more, for them is two thirds of what he left. And if there is only one, for her is half. And for one's parents, to each one of them is a sixth of what he left if he had a child. But if he had no child and the parents [alone] inherit from him, then for his mother is one third. And if he had brothers [or sisters], for his mother is a sixth. [Distribution in] all cases [is] after [the obligation of] a will, if any, and debt. Your parents or your children - you know not which of them are nearest to you in benefit. [These shares are] an obligation [imposed] by Allah. Indeed, Allah is ever Knowing and Wise. (Quran 4:11)",
  SPOUSE_INHERITANCE: "And for you is half of what your wives leave if they have no child. But if they have a child, for you is one fourth of what they leave, after any bequest they [may have] made or debt. And for the wives is one fourth of what you leave if you have no child. But if you have a child, then for them is an eighth of what you leave, after any bequest you [may have] made or debt. (Quran 4:12)"
};

export const AUTHENTIC_HADITH = {
  ASABAH: "The Prophet (ﷺ) said: 'Give the Faraid (the shares of the inheritance that are prescribed in the Quran) to those who are entitled to receive it. Then whatever remains, should be given to the closest male relative of the deceased.' (Bukhari and Muslim)",
  MALE_GUARDIANSHIP: "The Prophet (ﷺ) said: 'The male heir (al-'asabah) inherits what is left after the Faraid have been given.' (Abu Dawud)"
};

export const INHERITANCE_RULES: Record<FamilyRole, IslamicRule[]> = {
  father: [
    {
      condition: "When deceased has children",
      share: { numerator: 1, denominator: 6 },
      type: 'fardh',
      quranicRef: "Quran 4:11",
      explanation: "The father receives 1/6 when the deceased has children",
      priority: 1
    },
    {
      condition: "When deceased has no children",
      share: { numerator: 1, denominator: 1 },
      type: 'asabah',
      quranicRef: "Quran 4:11",
      explanation: "The father inherits as residuary heir when there are no children",
      priority: 2
    }
  ],
  mother: [
    {
      condition: "When deceased has children or siblings",
      share: { numerator: 1, denominator: 6 },
      type: 'fardh',
      quranicRef: "Quran 4:11",
      explanation: "The mother receives 1/6 when the deceased has children or siblings",
      priority: 1
    },
    {
      condition: "When deceased has no children and no siblings",
      share: { numerator: 1, denominator: 3 },
      type: 'fardh',
      quranicRef: "Quran 4:11",
      explanation: "The mother receives 1/3 when there are no children or siblings",
      priority: 2
    }
  ],
  husband: [
    {
      condition: "When deceased wife has no children",
      share: { numerator: 1, denominator: 2 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "The husband receives 1/2 when his wife has no children",
      priority: 1
    },
    {
      condition: "When deceased wife has children",
      share: { numerator: 1, denominator: 4 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "The husband receives 1/4 when his wife has children",
      priority: 2
    }
  ],
  wife: [
    {
      condition: "When deceased husband has no children",
      share: { numerator: 1, denominator: 4 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "The wife receives 1/4 when her husband has no children",
      priority: 1
    },
    {
      condition: "When deceased husband has children",
      share: { numerator: 1, denominator: 8 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "The wife receives 1/8 when her husband has children",
      priority: 2
    }
  ],
  son: [
    {
      condition: "Always inherits as residuary heir",
      share: { numerator: 1, denominator: 1 },
      type: 'asabah',
      quranicRef: "Quran 4:11",
      explanation: "Sons inherit the remainder after Fardh shares are distributed",
      priority: 1
    }
  ],
  daughter: [
    {
      condition: "One daughter only, no sons",
      share: { numerator: 1, denominator: 2 },
      type: 'fardh',
      quranicRef: "Quran 4:11",
      explanation: "A single daughter receives 1/2 when there are no sons",
      priority: 1
    },
    {
      condition: "Two or more daughters, no sons",
      share: { numerator: 2, denominator: 3 },
      type: 'fardh',
      quranicRef: "Quran 4:11",
      explanation: "Multiple daughters share 2/3 when there are no sons",
      priority: 2
    },
    {
      condition: "With sons present",
      share: { numerator: 1, denominator: 2 },
      type: 'asabah',
      quranicRef: "Quran 4:11",
      explanation: "With sons, daughters inherit half of what sons receive",
      priority: 3
    }
  ],
  full_brother: [
    {
      condition: "No father, no sons, no grandsons",
      share: { numerator: 1, denominator: 1 },
      type: 'asabah',
      quranicRef: "Quran 4:176",
      explanation: "Full brothers inherit as residuary heirs when not blocked",
      priority: 1
    }
  ],
  full_sister: [
    {
      condition: "One sister, no brothers, no father, no sons",
      share: { numerator: 1, denominator: 2 },
      type: 'fardh',
      quranicRef: "Quran 4:176",
      explanation: "A single full sister receives 1/2 when conditions are met",
      priority: 1
    },
    {
      condition: "Two or more sisters, no brothers, no father, no sons",
      share: { numerator: 2, denominator: 3 },
      type: 'fardh',
      quranicRef: "Quran 4:176",
      explanation: "Multiple full sisters share 2/3 when conditions are met",
      priority: 2
    }
  ],
  paternal_brother: [
    {
      condition: "No father, no sons, no full brothers",
      share: { numerator: 1, denominator: 1 },
      type: 'asabah',
      quranicRef: "Sunnah - residuary inheritance",
      explanation: "Paternal brothers inherit as residuary when not blocked",
      priority: 1
    }
  ],
  paternal_sister: [
    {
      condition: "No father, no sons, no full siblings, no paternal brothers",
      share: { numerator: 1, denominator: 2 },
      type: 'fardh',
      quranicRef: "Sunnah - analogous to full sisters",
      explanation: "Paternal sisters follow similar rules to full sisters",
      priority: 1
    }
  ],
  maternal_brother: [
    {
      condition: "No father, no sons, only one maternal sibling",
      share: { numerator: 1, denominator: 6 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "A single maternal brother receives 1/6",
      priority: 1
    },
    {
      condition: "No father, no sons, multiple maternal siblings",
      share: { numerator: 1, denominator: 3 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "Multiple maternal siblings share 1/3 equally",
      priority: 2
    }
  ],
  maternal_sister: [
    {
      condition: "No father, no sons, only one maternal sibling",
      share: { numerator: 1, denominator: 6 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "A single maternal sister receives 1/6",
      priority: 1
    },
    {
      condition: "No father, no sons, multiple maternal siblings",
      share: { numerator: 1, denominator: 3 },
      type: 'fardh',
      quranicRef: "Quran 4:12",
      explanation: "Multiple maternal siblings share 1/3 equally",
      priority: 2
    }
  ],
  paternal_grandfather: [
    {
      condition: "When no father is present",
      share: { numerator: 1, denominator: 6 },
      type: 'fardh',
      quranicRef: "Sunnah - same as father's position",
      explanation: "Paternal grandfather takes father's position when father is absent",
      priority: 1
    }
  ],
  paternal_grandmother: [
    {
      condition: "When no mother is present",
      share: { numerator: 1, denominator: 6 },
      type: 'fardh',
      quranicRef: "Authentic Hadith",
      explanation: "Paternal grandmother receives 1/6 when mother is absent",
      priority: 1
    }
  ],
  maternal_grandmother: [
    {
      condition: "When no mother is present",
      share: { numerator: 1, denominator: 6 },
      type: 'fardh',
      quranicRef: "Authentic Hadith",
      explanation: "Maternal grandmother receives 1/6 when mother is absent",
      priority: 1
    }
  ],
  paternal_uncle: [
    {
      condition: "When no closer male relatives exist",
      share: { numerator: 1, denominator: 1 },
      type: 'asabah',
      quranicRef: "Sunnah - closest male relative",
      explanation: "Paternal uncle inherits as residuary when no closer relatives",
      priority: 1
    }
  ],
  paternal_nephew: [
    {
      condition: "When no closer male relatives exist",
      share: { numerator: 1, denominator: 1 },
      type: 'asabah',
      quranicRef: "Sunnah - closest male relative",
      explanation: "Paternal nephew inherits as residuary when no closer relatives",
      priority: 1
    }
  ],
  grandson_son: [
    {
      condition: "When no sons exist",
      share: { numerator: 1, denominator: 1 },
      type: 'asabah',
      quranicRef: "Sunnah - male descendant",
      explanation: "Grandsons through sons inherit when no direct sons",
      priority: 1
    }
  ],
  granddaughter_son: [
    {
      condition: "When no sons or daughters exist",
      share: { numerator: 1, denominator: 2 },
      type: 'fardh',
      quranicRef: "Sunnah - analogous to daughters",
      explanation: "Granddaughters through sons follow similar rules to daughters",
      priority: 1
    }
  ]
};

export const ROLE_DESCRIPTIONS: Record<FamilyRole, string> = {
  father: "Father of the deceased",
  mother: "Mother of the deceased", 
  paternal_grandfather: "Father's father",
  paternal_grandmother: "Father's mother",
  maternal_grandmother: "Mother's mother",
  husband: "Husband of the deceased",
  wife: "Wife of the deceased",
  son: "Son of the deceased",
  daughter: "Daughter of the deceased",
  full_brother: "Full brother (same father and mother)",
  full_sister: "Full sister (same father and mother)",
  paternal_brother: "Paternal half-brother (same father)",
  paternal_sister: "Paternal half-sister (same father)",
  maternal_brother: "Maternal half-brother (same mother)",
  maternal_sister: "Maternal half-sister (same mother)",
  paternal_uncle: "Father's brother",
  paternal_nephew: "Brother's son",
  grandson_son: "Son's son",
  granddaughter_son: "Son's daughter"
};