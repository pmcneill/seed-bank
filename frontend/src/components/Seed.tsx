import { useState } from 'react'

import StarRatingComponent from 'react-star-rating-component'
import { from_ms } from '../util/time'

import { NewPlaythroughModal } from './modals/NewPlaythroughModal'
import { Playthrough } from './Playthrough'

import { useUser } from './WithUser'

import './Seed.css'

interface SeedProps {
  seed : TSeed;
  playthroughs: TPlaythrough[];
}

interface ToggleProps {
  value: boolean;
  onChange: (val: boolean) => void;
}

const TogglePlaythrough : React.FC<ToggleProps> = function({ value, onChange}) {
  const { user } = useUser()

  if ( ! user ) {
    return <>
      {value && <a onClick={() => onChange(false)}>Hide playthroughs</a>}
      {!value && <a onClick={() => onChange(true)}>Show playthroughs</a>}
    </>
  } else {
    return <>
      {!user.hide_ratings && <>
        {value && <a onClick={() => onChange(false)}>Hide playthroughs</a>}
        {!value && <a onClick={() => onChange(true)}>Show playthroughs</a>}
      </>}
    </>
  }
}

export const Seed : React.FC<SeedProps> = function({ seed, playthroughs }) {
  let fun = 0, hard = 0, time = 0

  let [ show_modal, set_show_modal ] = useState<boolean>(false)
  let [ show_pts, set_show_pts ] = useState<boolean>(false)
  let [ pts, set_pts ] = useState<Array<TPlaythrough>>(playthroughs)

  const { user } = useUser()

  if ( pts?.length ) {
    for ( let pt of pts ) {
      fun += pt.rating_fun
      hard += pt.rating_hard
      time += pt.time_ms
    }

    fun /= pts.length
    hard /= pts.length
    time = Math.floor(time / pts.length)
  }

  const add_playthrough = (pt: TPlaythrough, seed: TSeed) => {
    seed.playthroughs.push(pt)
    set_pts((pts) => pts.concat(pt))
    set_show_modal(false)
  }

  return (
    <div className="seed">
      <div>
        <strong>Seed</strong> <input type="text" size={15} readOnly={true} value={seed.seed}/>
        &nbsp;
        Hash: {seed.hash}
      </div>

      {!show_pts && <div className="playthrough">
        <div className="counts spoiler">
          Plays: {pts?.length || 0}
          {user && !user.hide_ratings && <>&nbsp; Avg. Time: {from_ms(time)}</>}
        </div>
        {user && !user.hide_ratings && <div className="ratings spoiler">
          Fun: <StarRatingComponent name="avg_fun" value={fun} starCount={5} editing={false} />
          &nbsp;
          Difficulty: <StarRatingComponent name="avg_hard" value={hard} starCount={5} editing={false} />
        </div>}
      </div>}

      {show_pts && pts.map((pt) => <Playthrough playthrough={pt}/>)}

      <div className="add_pt">
        <TogglePlaythrough value={show_pts} onChange={set_show_pts} />
        {user && <>
          {!user.hide_ratings && <>&nbsp;|&nbsp;</>}
          <a onClick={() => set_show_modal(true)}>Add playthrough of this seed</a>
          {show_modal && <NewPlaythroughModal onSave={add_playthrough} onCancel={() => set_show_modal(false)} flag_id={seed.flag_id} seed_id={seed.id} />}
        </>}
      </div>
    </div>
  )
}
