import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

function Option({ pollKey, optionKey, text, votes }) {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  const userName = useStoreState(state => state.polls.userName);
  const updateVote = useStoreActions(actions => actions.polls.updateVote);
  const selfVoted = (votes || {})[userName] === 1;
  
  const changeVote = () => {
    var votePayload = { pollPageId, pollKey, optionKey, userName };
    votePayload.newVote = selfVoted ? null : 1;
    updateVote(votePayload);
  };

  return (
    <div className="Option">
      <input type="checkbox" key={optionKey} checked={selfVoted} onChange={changeVote}/>
      {Object.values(votes || {}).filter(x => x === 1).length} - {text}
    </div>
  )
}

export default Option;