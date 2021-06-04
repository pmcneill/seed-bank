import React from 'react'
import './App.css'

import { FlagList } from './components/FlagList'
import { SeedList } from './components/SeedList'

import { User, WithSession } from './components/WithSession'

import {
  useState,
} from 'react'

function App() {
  let [ game, _set_game ] = useState<TGame>({ id: 1, name: 'Zelda II: The Adventure of Link' })
  let [ flag, set_flag ] = useState<TFlag | null>(null)

  return (<WithSession>
    <div className="main">
      <div className="header">
        <div className="login">
          <User />
        </div>

        <h2>{game.name}</h2>
      </div>

      <FlagList game_id={game.id} on_flag_change={(f: TFlag) => set_flag(f)}/>

      {flag && <SeedList flag={flag} />}
    </div>
  </WithSession>);
}

export default App;
