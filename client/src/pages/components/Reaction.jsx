import likeReact from '../../assets/like.svg'
import heartReact from '../../assets/heart.svg'
import { createReaction, removeReaction } from '../../api/operations';
import { useCallback } from 'react';

const REACTS = {
  like: 1,
  heart: 2
}

// reactId refers to the id of the specific react gesture (i.e. like = 1, heart = 2)
// id_react refers to the id of the reaction on the postgres db
function Reaction({ reactorId, postId, reactId, id_react }) {

  const handleReact = useCallback(async (e) => {
    const target = e.currentTarget;
    const isClicked = target?.classList.contains('clicked');
    const react = target?.dataset?.name_react;

    let result, input = { reactorId, postId };

    if (react && !isClicked) {
      input['reactId'] = REACTS[react];
      result = await createReaction(input)
    }

    // clicking a previously clicked react removes the reaction
    if (react) {
      result = await removeReaction({ id_react })
    }

    if (result?.statusText === "OK") console.log(`Post ${postId} successfully updated`)

    return location.reload();
  }, [])

  return (
    <span className='flex flex-center flex-row reaction'>
      <div
        data-id_react={id_react} data-name_react={'like'} className={`react like ${(reactorId >= 0 && 'clicked') || ''} ${(reactId === 2 && 'disabled') || ''}`} onClick={handleReact} >
        <img src={likeReact} alt="Like" />
      </div>
      <div data-id_react={id_react} data-name_react={'heart'} className={`react heart ${(reactorId >= 0 && 'clicked') || ''} ${(reactId === 1 && 'disabled') || ''}`} onClick={handleReact}>
        <img src={heartReact} alt="Heart" />
      </div>
    </span>
  )
}

export default Reaction;