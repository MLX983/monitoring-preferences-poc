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
    primaryLine: "We'll send one monthly update and stay quiet the rest of the time.",
    reasonChips: ['You want fewer alerts', 'A monthly check-in is enough'],
  },
  S2: {
    id: 'S2',
    primaryLine: "We'll send a weekly recap so you can keep an eye on things without daily alerts.",
    reasonChips: ['You want regular updates', "You don't need daily alerts"],
  },
  S3: {
    id: 'S3',
    primaryLine: "We'll stay quiet when things look normal and let you know when something changes.",
    reasonChips: ['You want fewer alerts', 'You still want to know when something looks different'],
  },
  S4: {
    id: 'S4',
    primaryLine: "We'll warn you early if your bill looks like it may be higher than usual.",
    reasonChips: ["You don't want surprise charges", 'You want time to make changes'],
  },
  S5: {
    id: 'S5',
    primaryLine: "We'll check each device so one line doesn't use much more than the others.",
    reasonChips: ['You want us to watch each device', 'Uneven use matters to you'],
  },
  S6: {
    id: 'S6',
    primaryLine: "We'll only alert you when we're confident something needs your attention.",
    reasonChips: ['You want fewer interruptions', 'You only want alerts when they really matter'],
  },
  S7: {
    id: 'S7',
    primaryLine: "We'll check in sooner so you have more time to make changes.",
    reasonChips: ['You want early warnings', 'You want more help staying ahead'],
  },
};
