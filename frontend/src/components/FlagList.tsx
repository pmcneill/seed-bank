import {
  useEffect,
  useState,
} from 'react'

import { NewFlagModal } from './modals/NewFlagModal'
import { useSession } from './WithSession'

interface Props {
  game_id: number;
  on_flag_change: (f: TFlag) => void;
}

export const FlagList : React.FC<Props> = (props) => {
  let [ flags, set_flags ] = useState<Array<TFlag>>([]);
  let [ show_modal, set_show_modal ] = useState<boolean>(false);
  const { user } = useSession()

  useEffect(() => {
    fetch(`/api/games/${props.game_id}/flags`)
      .then((resp) => resp.json())
      .then((flags: TFlag[]) => set_flags(flags))
  }, [ props.game_id ])


  const add_flag = (flag: TFlag) => {
    console.log("adding a flag", flag)
    set_flags((all_flags) => all_flags.concat(flag))
    set_show_modal(false)
  }

  return (
    <div className="flags">
      <h3>Flags</h3>

      <ul>
        {flags.map((f) => (
          <li key={f.id}>
            <div><a onClick={() => props.on_flag_change(f)}>{f.name}</a></div>
            <div className="flag-desc">{f.desc}</div>
          </li>
        ))}
      </ul>

      {user && <>
        <div>
          <a onClick={() => set_show_modal(true)}>Add a new flag</a>
        </div>

        {show_modal && <NewFlagModal onSave={add_flag} onCancel={() => set_show_modal(false)} game_id={props.game_id} />}
      </>}
    </div>
  )
}
