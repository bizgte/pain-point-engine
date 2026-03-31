/**
 * Video rotation config for WF2.
 * 4-5 channels get video on a rotating schedule.
 * All 13 channels always get images.
 * Rotation is date-based — deterministic, no DB needed.
 */

export const ALL_CHANNELS = [
  '5ubzero', 'thesmartlist', 'wealthnector', 'salalawigan', 'moode',
  'baileysjournal', 'redflagscan', 'gdprverify', 'velocityinvoice',
  'operria', 'taglearning', 'appublishing', 'piperapplabs',
];

// Channels eligible for video (premium channels with highest engagement potential)
export const VIDEO_ELIGIBLE_CHANNELS = [
  '5ubzero',        // Tech/AI — high video engagement
  'thesmartlist',   // Business tips — strong reel performance
  'wealthnector',   // Finance — aspirational video content
  'operria',        // B2B — demo/explainer style
  'taglearning',    // Education — tutorial format
  'moode',          // Lifestyle — mood/story format
  'velocityinvoice',// SaaS — product showcase
];

/**
 * Returns which 4 channels get video today.
 * Rotates deterministically by day-of-week — no duplicates week over week.
 * Week repeats every 7 days, each day 4 different channels get video.
 */
export function getVideoChannelsForDate(date: Date = new Date()): string[] {
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ... 6=Sat

  // 7 days × 4 channels, rotate through VIDEO_ELIGIBLE_CHANNELS
  const rotation: Record<number, string[]> = {
    0: ['5ubzero', 'thesmartlist', 'wealthnector', 'operria'],          // Sunday
    1: ['taglearning', 'moode', 'velocityinvoice', '5ubzero'],          // Monday
    2: ['thesmartlist', 'wealthnector', 'operria', 'taglearning'],       // Tuesday
    3: ['moode', 'velocityinvoice', '5ubzero', 'thesmartlist'],          // Wednesday
    4: ['wealthnector', 'operria', 'taglearning', 'moode'],              // Thursday
    5: ['velocityinvoice', '5ubzero', 'thesmartlist', 'wealthnector'],   // Friday
    6: ['operria', 'taglearning', 'moode', 'velocityinvoice'],           // Saturday
  };

  return rotation[dayOfWeek] ?? rotation[0];
}

/**
 * Returns whether a specific channel gets video today.
 */
export function channelGetsVideoToday(channel: string, date: Date = new Date()): boolean {
  const videoChannels = getVideoChannelsForDate(date);
  return videoChannels.includes(channel.toLowerCase().replace(/[^a-z0-9]/g, ''));
}

/**
 * Returns full schedule for next 7 days (for Alfred's planning).
 */
export function getVideoSchedule(): Array<{ day: string; channels: string[] }> {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      day: `${days[date.getDay()]} ${date.toISOString().split('T')[0]}`,
      channels: getVideoChannelsForDate(date),
    };
  });
}
