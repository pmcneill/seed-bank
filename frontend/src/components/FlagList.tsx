import {
  useState,
} from 'react'

interface Props {
  game_id: number;
  on_flag_change: (f: Flag) => void;
}

export const FlagList : React.FC<Props> = (props) => {
  let [ flags, set_flags ] = useState<Array<Flag>>([]);

  (async () => {
    let resp = await fetch(`/api/games/${props.game_id}/flags`),
      json = await resp.json() as Flag[]

    set_flags(json)
  })()

  return (
    <div className="flags">
      <h3>Flags</h3>

      <ul>
        {flags.map((f) => (
          <li><a onClick={() => props.on_flag_change(f)}>{f.id} {f.name}</a></li>
        ))}
      </ul>
    </div>
  )
}
