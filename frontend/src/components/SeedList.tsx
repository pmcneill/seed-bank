import {
  useEffect,
  useState,
} from 'react'

import { useSession } from './WithSession'
import { NewPlaythroughModal } from './modals/NewPlaythroughModal'
import { Seed } from './Seed'

interface Props {
  flag: TFlag,
}

export const SeedList : React.FC<Props> = ({ flag }) => {
  let [ seeds, set_seeds ] = useState<TSeed[]>([])
  let [ show_modal, set_show_modal ] = useState<boolean>(false);
  const { user } = useSession()

  useEffect(() => {
    console.log("refetching flags!")
    fetch(`/api/flags/${flag.id}/seeds`)
      .then((resp) => resp.json())
      .then((s: TSeed[]) => set_seeds(s))
  }, [ flag.id ])


  const add_playthrough = (pt: TPlaythrough, seed: TSeed) => {
    set_seeds((seeds) => {
      let found = false
      for ( let i = 0 ; i < seeds.length ; i++ ) {
        if ( seeds[i].id === seed.id ) {
          seeds[i] = seed
          found = true
          break
        }
      }

      if ( ! found ) {
        seeds.push(seed)
      }

      return seeds
    })

    set_show_modal(false)
  }

  const update_seed = (orig_seed: TSeed, callback: (to_update: TSeed) => void ) => {
    set_seeds((all) => {
      let seed = all.find((s) => s.id === orig_seed.id)

      if ( seed ) {
        callback(seed)
      }

      return all
    })
  }

  return (
    <div className="seeds">
      <h3>{flag.name}</h3>
      Flags <input type="text" size={40} readOnly={true} value={flag.value} />

      <ul>
        {seeds.map((s) => ( <li><Seed key={s.id} seed={s} update_seed={update_seed}/></li> ))}
      </ul>

      {user && <>
        <div>
          <a onClick={() => set_show_modal(true)}>Add a new seed and playthrough</a>
        </div>

        {show_modal && <NewPlaythroughModal onSave={add_playthrough} onCancel={() => set_show_modal(false)} flag_id={flag.id} />}
      </>}
    </div>
  )
}
