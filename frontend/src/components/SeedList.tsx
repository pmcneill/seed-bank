import {
  useEffect,
  useState,
} from 'react'

import { useUser } from './WithUser'
import { NewPlaythroughModal } from './modals/NewPlaythroughModal'
import { Seed } from './Seed'

interface Props {
  flag: TFlag,
}

export const SeedList : React.FC<Props> = ({ flag }) => {
  let [ seeds, set_seeds ] = useState<TSeed[]>([])
  let [ show_modal, set_show_modal ] = useState<boolean>(false);
  const user = useUser()

  useEffect(() => {
    fetch(`/api/flags/${flag.id}/seeds`)
      .then((resp) => resp.json())
      .then((s: TSeed[]) => set_seeds(s))
  }, [ flag.id ])


  const add_playthrough = (pt: TPlaythrough, seed: TSeed) => {
    if ( seeds.findIndex((s) => s.id === seed.id) === -1 ) {
      set_seeds((seeds) => seeds.concat(seed))
    }
    set_show_modal(false)
  }

  return (
    <div className="seeds">
      <h3>{flag.name}</h3>
      Flags <input type="text" size={40} readOnly={true} value={flag.value} />

      <ul>
        {seeds.map((s) => ( <li><Seed seed={s} /></li> ))}
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
