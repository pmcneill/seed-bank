import {
  useEffect,
  useState,
} from 'react'

import { NewPlaythroughModal } from './modals/NewPlaythroughModal'

interface Props {
  flag_id: number,
}

export const SeedList : React.FC<Props> = ({ flag_id }) => {
  let [ seeds, set_seeds ] = useState<Seed[]>([])
  let [ show_modal, set_show_modal ] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/flags/${flag_id}/seeds`)
      .then((resp) => resp.json())
      .then((s: Seed[]) => set_seeds(s))
  }, [ flag_id ])


  const add_playthrough = (pt: Playthrough, seed: Seed) => {
    if ( seeds.findIndex((s) => s.id === seed.id) === -1 ) {
      set_seeds((seeds) => seeds.concat(seed))
    }
    set_show_modal(false)
  }

  return (
    <div className="seeds">
      <ul>
        {seeds.map((s) => (
          <li>{s.id} {s.seed}: {s.playthroughs?.length}</li>
        ))}
      </ul>

      <div>
        <a onClick={() => set_show_modal(true)}>Add a new seed and playthrough</a>
      </div>

      {show_modal && <NewPlaythroughModal onSave={add_playthrough} onCancel={() => set_show_modal(false)} flag_id={flag_id} />}
    </div>
  )
}
