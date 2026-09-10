export type Category = "web" | "pwn" | "crypto" | "cloud" | "forensics";
export type Difficulty = "easy" | "medium" | "hard" | "insane";

export type Challenge = {
  slug: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  solves: number;
  blurb: string;
  firstBlood: string;
};

export const CHALLENGES: Challenge[] = [
  {
    slug: "sqli-warmup",
    title: "SQLi Warmup",
    category: "web",
    difficulty: "easy",
    points: 100,
    solves: 812,
    blurb: "A login form that trusts a little too much. Slip past it.",
    firstBlood: "r00tkit",
  },
  {
    slug: "buffer-bash",
    title: "Buffer Bash",
    category: "pwn",
    difficulty: "medium",
    points: 250,
    solves: 341,
    blurb: "Classic stack smash with a twist. Mind the canary.",
    firstBlood: "seg_fault",
  },
  {
    slug: "rsa-riddle",
    title: "RSA Riddle",
    category: "crypto",
    difficulty: "hard",
    points: 500,
    solves: 96,
    blurb: "Small exponent, shared modulus, big mistake.",
    firstBlood: "modmath",
  },
  {
    slug: "leaky-bucket",
    title: "Leaky Bucket",
    category: "cloud",
    difficulty: "medium",
    points: 300,
    solves: 204,
    blurb: "A misconfigured object store is leaking more than files.",
    firstBlood: "cl0udy",
  },
  {
    slug: "jwt-none",
    title: "None Shall Pass",
    category: "web",
    difficulty: "medium",
    points: 275,
    solves: 288,
    blurb: "The token verifier has an alg-shaped hole in it.",
    firstBlood: "b64baron",
  },
  {
    slug: "ghost-in-ram",
    title: "Ghost in the RAM",
    category: "forensics",
    difficulty: "hard",
    points: 450,
    solves: 71,
    blurb: "Carve the secret out of a memory dump before it fades.",
    firstBlood: "volatility",
  },
  {
    slug: "heap-heist",
    title: "Heap Heist",
    category: "pwn",
    difficulty: "insane",
    points: 750,
    solves: 12,
    blurb: "Tcache poisoning against a hardened allocator. Good luck.",
    firstBlood: "glibc_ghoul",
  },
  {
    slug: "oracle-padded",
    title: "Padded Oracle",
    category: "crypto",
    difficulty: "medium",
    points: 325,
    solves: 158,
    blurb: "The server tells you a bit too much about your padding.",
    firstBlood: "cbc_king",
  },
  {
    slug: "meta-role",
    title: "Metadata Role-Play",
    category: "cloud",
    difficulty: "hard",
    points: 500,
    solves: 63,
    blurb: "SSRF into the instance metadata service. Assume the role.",
    firstBlood: "imds_pls",
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  web: "Web",
  pwn: "Binary / Pwn",
  crypto: "Crypto",
  cloud: "Cloud",
  forensics: "Forensics",
};

export type Player = {
  rank: number;
  handle: string;
  points: number;
  flags: number;
  streak: number;
  country: string;
};

export const PLAYERS: Player[] = [
  { rank: 1, handle: "r00tkit", points: 8420, flags: 41, streak: 12, country: "SE" },
  { rank: 2, handle: "seg_fault", points: 7980, flags: 39, streak: 8, country: "DE" },
  { rank: 3, handle: "modmath", points: 7610, flags: 36, streak: 15, country: "JP" },
  { rank: 4, handle: "cl0udy", points: 6890, flags: 34, streak: 5, country: "US" },
  { rank: 5, handle: "b64baron", points: 6320, flags: 33, streak: 9, country: "BR" },
  { rank: 6, handle: "volatility", points: 5980, flags: 30, streak: 4, country: "IN" },
  { rank: 7, handle: "glibc_ghoul", points: 5640, flags: 28, streak: 7, country: "PL" },
  { rank: 8, handle: "cbc_king", points: 5210, flags: 27, streak: 3, country: "FR" },
  { rank: 9, handle: "imds_pls", points: 4870, flags: 25, streak: 6, country: "CA" },
  { rank: 10, handle: "nullptr", points: 4510, flags: 24, streak: 2, country: "AU" },
];
