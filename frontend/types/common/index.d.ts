interface Game {
  id: number;
  name: string;
}

interface NewFlag {
  name: string;
  value: string;
  game_id: number;
}

interface Flag extends NewFlag {
  id: number;
}

interface NewSeed {
  seed: string;
  hash: string;
  flag_id: number;
}

interface Seed extends NewSeed {
  id: number;
  playthroughs: [Playthrough];
}

interface NewPlaythrough {
  seed: string;
  seed_description: string;
  user_id: number;
  hash: string;
  time_ms: number; // -1 for DNF
  comment: string;
  rating_fun: number;
  rating_hard: number;
}

interface Playthrough {
  id: number;
  seed_id: number;
  user_id: number;
  time_ms: number;
  comment: string;
  rating_fun: number;
  rating_hard: number;
}
