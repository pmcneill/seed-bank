import {
  useState,
} from 'react'

import { useSession } from '../WithSession'

import { Modal } from './index'

import StarRatingComponent from 'react-star-rating-component'

import { is_blank } from '../../util/is_blank'
import { to_ms, from_ms } from '../../util/time'

interface NewSeedModalProps {
  flag_id: number,
  seed_id?: number,
  onSave: (pt: TPlaythrough, seed: TSeed) => void,
  onCancel: () => void,
}

async function create_seed(flag_id: number, seed: string, hash: string ) : Promise<TSeed> {
  const resp = await fetch(`/api/flags/${flag_id}/seeds`, {
    method: 'POST',
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ seed, hash, flag_id })
  })

  return resp.json()
}

async function fetch_seed(seed_id: number) : Promise<TSeed> {
  const resp = await fetch(`/api/seeds/${seed_id}`)
  return resp.json()
}

async function create_playthrough(flag_id: number, pt: TNewPlaythrough, seed_id?: number) : Promise<{ playthrough: TPlaythrough, seed: TSeed}> {


  console.log("creating playthrough for ", flag_id, " with ", pt, " and seed ", seed_id)

  if ( ! seed_id ) {
    let seed : TSeed = await create_seed(flag_id, pt.seed, pt.hash)
    console.log(seed)
    seed_id = seed.id
  }

  let resp = await fetch(`/api/seeds/${seed_id}/playthrough`, {
    method: 'POST',
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      seed_id,
      user_id: pt.user_id,
      time_ms: pt.time_ms,
      comment: pt.comment,
      rating_fun: pt.rating_fun,
      rating_hard: pt.rating_hard,
    }),
  })

  let playthrough = await resp.json() as TPlaythrough

  // Reload the seed to get the new averages
  return { playthrough, seed: await fetch_seed(seed_id) }
}

export const NewPlaythroughModal : React.FC<NewSeedModalProps> = ( { onSave, flag_id, seed_id, onCancel } ) => {
  const { user } = useSession()

  if ( ! user ) {
    throw new Error("Not logged in")
  }

  const [ pt, update_pt] = useState<TNewPlaythrough>({
    seed: seed_id ? 'given' : '',
    hash: seed_id ? 'given' : '',
    seed_description: '',
    user_id: user.id,
    time_ms: 0,
    comment: '',
    rating_fun: 0,
    rating_hard: 0,
  })

  const [ time, _set_time ] = useState<string>(from_ms(pt.time_ms))

  const update_field = (field: keyof TNewPlaythrough, value: string | number) => {
    update_pt((prior) => ({ ...prior, [field]: value }))
  }

  const set_time = (time: string) => {
    _set_time(time)
    update_field('time_ms', to_ms(time))
  }

  const record_playthrough = async () => {
    console.log(pt)

    if ( is_blank(pt.seed) || pt.time_ms === 0 || pt.rating_fun === 0 || pt.rating_hard === 0 ) {
      alert("Please enter the seed, your time, and the ratings")
      return
    }

    create_playthrough(flag_id, pt, seed_id).then(({ playthrough, seed }) => onSave(playthrough, seed))
  }

  return (
    <Modal onSave={record_playthrough} onCancel={onCancel}>
      <div className="form new-flag-form">
        <h3>Add a Playthrough</h3>
        {! seed_id && <>
          <div>
            <input type="text" size={20} name="seed" placeholder="Seed" value={pt.seed} onChange={(e) => update_field('seed', e.target.value) } />
          </div>
          <div>
            <input type="text" size={20} name="hash" placeholder="Hash" value={pt.hash} onChange={(e) => update_field('hash', e.target.value) } />
          </div>
        </>}
        <div>
          <input type="text" size={20} name="time" placeholder="Time (HH:MM:SS.SSS or DNF)" value={time} onChange={(e) => set_time(e.target.value) } />
        </div>
        <div>
          <strong>Fun:</strong><br/>
          <StarRatingComponent name="rating_fun" value={pt.rating_fun} starCount={5} onStarClick={(new_value) => update_pt((s) => ({ ...s, rating_fun: new_value })) } />
        </div>
        <div>
          <strong>Difficulty:</strong><br/>
          <StarRatingComponent name="rating_hard" value={pt.rating_hard} starCount={5} onStarClick={(new_value) => update_pt((s) => ({ ...s, rating_hard: new_value })) } />
        </div>
        <div>
          <textarea rows={5} cols={40} placeholder="Any comments?" onChange={(e) => update_field('comment', e.target.value)} value={pt.comment}/>
        </div>
      </div>
    </Modal>
  )
}
