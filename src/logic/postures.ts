// Confirmation modal messaging grouped by user posture.
// Postures are broader than strategies and are not shown to users.
// Used only after the user taps "Save".

export type PostureId = 'quiet' | 'regular' | 'early-warnings' | 'high-touch';

export interface Posture {
  id: PostureId;
  title: string;
  message: string;
}

export const postures: Record<PostureId, Posture> = {
    quiet: {
        title: 'Quiet by default',
        message:
          "We’ll stay quiet during normal changes and speak up only when something meaningful shifts. You can adjust this anytime.",
      },
      
      regular: {
        title: 'Regular check-ins',
        message:
          "We’ll check in on a steady cadence so you stay informed without day-to-day noise. You can adjust this anytime.",
      },
      
      'early-warnings': {
        title: 'Early warnings',
        message:
          "We’ll give you a heads-up early when costs or imbalances look like they may become an issue. You can adjust this anytime.",
      },
      
      'high-touch': {
        title: 'High-touch',
        message:
          "We’ll check in early and often so you have high visibility as things change. You can adjust this anytime.",
      },
};
