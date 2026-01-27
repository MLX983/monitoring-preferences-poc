export const postures: Record<PostureId, Posture> = {
    quiet: {
      id: 'quiet',
      title: 'Quiet by default',
      message:
        "We’ll stay quiet during normal changes and speak up only when something meaningful shifts. You can adjust this anytime.",
    },
    regular: {
      id: 'regular',
      title: 'Regular check-ins',
      message:
        "We’ll check in on a steady cadence so you stay informed without day-to-day noise. You can adjust this anytime.",
    },
    'early-warnings': {
      id: 'early-warnings',
      title: 'Early warnings',
      message:
        "We’ll give you a heads-up early when costs or imbalances may become an issue. You can adjust this anytime.",
    },
    'high-touch': {
      id: 'high-touch',
      title: 'High-touch',
      message:
        "We’ll check in early and often so you have high visibility as things change. You can adjust this anytime.",
    },
  };
  