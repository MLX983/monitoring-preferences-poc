// Strategy definitions used by the Results card.
// Includes display copy and reason chips.
// Not used directly by the confirmation modal.

export type StrategyId = 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7';

export interface Strategy {
  id: StrategyId;
  primaryLine: string;
  reasonChips: [string, string];
}

export const strategies: Record<StrategyId, Strategy> = {
  S1: {
    id: 'S1',
    primaryLine: "We’ll send a monthly overview so you can review it all at once.",
    reasonChips: ['Low interruption', 'Review monthly'],
  },
  S2: {
    id: 'S2',
    primaryLine: "We’ll check in weekly with a quick recap of what changed.",
    reasonChips: ['Keep me informed', 'Steady cadence'],
  },
  S3: {
    id: 'S3',
    primaryLine: "We'll stay quiet unless we spot meaningful changes that need your attention.",
    reasonChips: ['Avoid noise', 'Changes matter'],
  },
  S4: {
    id: 'S4',
    primaryLine: "We’ll warn you early when costs look like they may run higher than usual.",
    reasonChips: ['No surprise charges', 'Early action'],
  },
  S5: {
    id: 'S5',
    primaryLine: "We'll watch individual devices and flag imbalances before they become problems.",
    reasonChips: ['Watch devices', 'Spot imbalances'],
  },
  S6: {
    id: 'S6',
    primaryLine: "We'll only reach out when something truly needs your attention.",
    reasonChips: ['Don’t bother me', 'Only essentials'],
  },
  S7: {
    id: 'S7',
    primaryLine: "We'll keep you informed early and often so you're always in the loop.",
    reasonChips: ['Keep me informed', 'Step in early'],
  },
};
