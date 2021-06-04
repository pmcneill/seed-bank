import StarRatingComponent from 'react-star-rating-component'
import { from_ms } from '../util/time'
import { useSession } from './WithSession'

interface Props {
  playthrough: TPlaythrough;
}

export const Playthrough : React.FC<Props> = function({ playthrough }) {
  const { user } = useSession()

  return (
    <div className="playthrough">
      Playthrough by <strong>{playthrough.user?.name || (user ? user.name : 'unknown')}</strong> in <strong>{from_ms(playthrough.time_ms)}</strong>:<br/>
      Fun: <StarRatingComponent name="fun" starCount={5} editing={false} value={playthrough.rating_fun} /><br/>
      Difficulty: <StarRatingComponent name="hard" starCount={5} editing={false} value={playthrough.rating_hard} /><br/>
      {playthrough.comment && <>
        Comment:<br/>
        {playthrough.comment}
      </>}
    </div>
  )
}
