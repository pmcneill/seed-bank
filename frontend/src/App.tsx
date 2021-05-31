import React from 'react';
import './App.css';

import { FlagList } from './components/FlagList'

import {
  useState
} from 'react'

function App() {
  let [ game, _set_game ] = useState<Game>({ id: 1, name: 'Zelda II: The Adventure of Link' })
  let [ flag, set_flag ] = useState<Flag | null>(null)

  return (
    <div className="main">
      <header className="header">
        <p>{game.name}, Flags {flag?.value}</p>
      </header>
      <nav>
        <FlagList game_id={game.id} on_flag_change={(f: Flag) => set_flag(f)}/>
      </nav>
    </div>
  );
}

export default App;
