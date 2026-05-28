export type PostureId = "quiet" | "regular" | "early-warnings" | "high-touch";

export type Posture = {
  id: PostureId;
  title: string;
  bodyParagraphs: [string, string];
};

export const postures: Record<PostureId, Posture> = {
  quiet: {
    id: "quiet",
    title: "Quiet by default",
    bodyParagraphs: [
      "Most of the time, we'll stay quiet.",
      "We'll let you know when something important needs your attention.",
    ],
  },
  regular: {
    id: "regular",
    title: "Regular check-ins",
    bodyParagraphs: [
      "We'll send regular updates so you can keep an eye on things.",
      "You won't get alerts every day.",
    ],
  },
  "early-warnings": {
    id: "early-warnings",
    title: "Early warnings",
    bodyParagraphs: [
      "We'll give you an early heads-up when something looks off.",
      "That gives you more time to make changes.",
    ],
  },
  "high-touch": {
    id: "high-touch",
    title: "Early alerts / high-touch",
    bodyParagraphs: [
      "We'll check in sooner and more often.",
      "You can change this anytime if it feels like too much.",
    ],
  },
};
