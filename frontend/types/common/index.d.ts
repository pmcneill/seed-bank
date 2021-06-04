interface TGame {
  id: number;
  name: string;
}

interface TNewFlag {
  name: string;
  value: string;
  game_id: number;
}

interface TFlag extends TNewFlag {
  id: number;
}

interface TNewSeed {
  seed: string;
  hash: string;
  flag_id: number;
}

interface TSeed extends TNewSeed {
  id: number;
  playthroughs: [TPlaythrough];
  completed: boolean;
}

interface TUser {
  id: number;
  name: string;
  spoilers: boolean;
}

interface TNewPlaythrough {
  seed: string;
  seed_description: string;
  user_id: number;
  hash: string;
  time_ms: number; // -1 for DNF
  comment: string;
  rating_fun: number;
  rating_hard: number;
}

interface TPlaythrough {
  id: number;
  seed_id: number;
  user_id: number;
  user: TUser;
  time_ms: number;
  comment: string;
  rating_fun: number;
  rating_hard: number;
}
