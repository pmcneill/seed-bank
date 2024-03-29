import {
  useState
} from 'react'

import { Modal } from './index'

interface NewFlagModalProps {
  game_id: number,
  onSave: (flag: TFlag) => void,
  onCancel: () => void,
}

export const NewFlagModal : React.FC<NewFlagModalProps> = ( { onSave, game_id, ...props } ) => {
  const [ new_flag, update_flag ] = useState<TNewFlag>({ name: '', desc: '', value: '', game_id: 1 })

  const update_field = (field: keyof TNewFlag, value: string) => {
    update_flag((prior) => ({ ...prior, [field]: value }))
  }

  const create_flag = async () => {
    if ( ! new_flag.name || new_flag.name.trim() === '' || ! new_flag.value || new_flag.value.trim() === '' ) {
      alert("Description and flags are required.")
      return
    }

    let resp = await fetch(`/api/games/${game_id}/flags`, {
      method: 'POST',
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(new_flag),
    })

    let flag = await resp.json() as TFlag

    onSave(flag)
  }

  return (
    <Modal onSave={create_flag} {...props}>
      <div className="form new-flag-form">
        <h3>Create New Flag</h3>
        <div>
          <input type="text" size={30} name="name" placeholder="Name" value={new_flag.name} onChange={(e) => update_field('name', e.target.value) } />
        </div>
        <div>
          <input type="text" size={30} name="desc" placeholder="Short description" value={new_flag.desc} onChange={(e) => update_field('desc', e.target.value) } />
        </div>
        <div>
          <input type="text" size={30} name="flags" placeholder="Flags" value={new_flag.value} onChange={(e) => update_field('value', e.target.value) } />
        </div>
      </div>
    </Modal>
  )
}
