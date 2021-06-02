import React from 'react';
import './App.css';

import { FlagList } from './components/FlagList'
import { SeedList } from './components/SeedList'

import {
  useState
} from 'react'

function App() {
  let [ game, _set_game ] = useState<Game>({ id: 1, name: 'Zelda II: The Adventure of Link' })
  let [ flag, set_flag ] = useState<Flag | null>(null)

  return (
    <div className="main">
      <div className="header">
        <h2>{game.name}</h2>
      </div>

      <FlagList game_id={game.id} on_flag_change={(f: Flag) => set_flag(f)}/>

      <div className="seeds">
        <h3>Seeds</h3>

        {flag && <SeedList flag_id={flag.id} />}
      </div>
    </div>
  );
}

export default App;
