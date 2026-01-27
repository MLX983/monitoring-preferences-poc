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
    reasonChips: ['Low interruptions', 'Review monthly'],
  },
  S2: {
    id: 'S2',
    primaryLine: "We’ll check in weekly with a quick recap of what changed.",
    reasonChips: ['Regular updates', 'Steady cadence'],
  },
  S3: {
    id: 'S3',
    primaryLine: "We’ll ignore everyday ups and downs and speak up when patterns change.",
    reasonChips: ['Avoid noise', 'Changes matter'],
  },
  S4: {
    id: 'S4',
    primaryLine: "We’ll warn you early when costs may run higher than usual.",
    reasonChips: ['No surprises', 'Early action'],
  },
  S5: {
    id: 'S5',
    primaryLine: "We’ll watch individual devices and flag imbalances early.",
    reasonChips: ['Watch devices', 'Spot imbalances'],
  },
  S6: {
    id: 'S6',
    primaryLine: "We’ll stay quiet and only reach out when something truly needs attention.",
    reasonChips: ['Don’t bother me', 'Only essentials'],
  },
  S7: {
    id: 'S7',
    primaryLine: "We’ll check in early and often so you stay in the loop.",
    reasonChips: ['Keep me informed', 'Step in early'],
  },
};
