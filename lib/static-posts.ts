import type { StaticPostSeed, WallPost } from "./types";

export const STATIC_POST_SEEDS: StaticPostSeed[] = [
  {
    id: "static-anna",
    author: "Anna",
    body: "Hey John, did you debug your coffee maker yet? Last cup tasted like JavaScript errors.",
    hoursAgo: 2,
  },
  {
    id: "static-adelaida",
    author: "Adelaida",
    body: "John, saw your last coding session—pretty sure you broke Stack Overflow again! 🚨",
    hoursAgo: 3,
  },
  {
    id: "static-juho",
    author: "Juho",
    body: "John, are you still coding in pajamas, or have you upgraded to full-time sweatpants mode?",
    hoursAgo: 4,
  },
  {
    id: "static-maija",
    author: "Maija",
    body: "John, rumor has it your computer has more stickers than code running on it. Confirm?",
    hoursAgo: 5,
  },
  {
    id: "static-alex",
    author: "Alex",
    body: "Yo John, just pulled an all-nighter on the assignment. Turns out sleep deprivation doesn't improve coding skills. Weird!",
    hoursAgo: 6,
  },
  {
    id: "static-sheryl",
    author: "Sheryl",
    body: "John, when are we gonna deploy your latest dance moves to production? #AgileDancer",
    hoursAgo: 8,
  },
];

export function getStaticPosts(now: number): WallPost[] {
  return STATIC_POST_SEEDS.map(({ id, author, body, hoursAgo }) => ({
    id,
    author,
    body,
    created_at: new Date(now - hoursAgo * 60 * 60 * 1000).toISOString(),
    photo_url: null,
    isStatic: true,
  }));
}
