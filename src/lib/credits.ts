// Credits utility — stub until Supabase is connected

export const CREDIT_COSTS = {
  post: 1,
  blog: 3,
  email: 2,
  image: 1,
  video_reel: 5,
  video_product: 5,
  video_ugc: 5,
  calendar: 5,
  ad_copy: 2,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export async function getUserCredits(_userId: string): Promise<number> {
  // Stub: returns 10 (free tier) until Supabase is connected
  return 10;
}

export async function deductCredits(
  _userId: string,
  _action: CreditAction
): Promise<{ success: boolean; remaining: number }> {
  // Stub: always succeeds until Supabase is connected
  return { success: true, remaining: 10 };
}

export async function hasEnoughCredits(
  _userId: string,
  action: CreditAction
): Promise<boolean> {
  // Stub: always returns true until Supabase is connected
  const cost = CREDIT_COSTS[action];
  const credits = await getUserCredits(_userId);
  return credits >= cost;
}
