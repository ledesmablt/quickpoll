import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

function Option({ pollKey, optionKey, text, votes }) {
  const currentUser = useStoreState(state => state.polls.currentUser);
  const updateVote = useStoreActions(actions => actions.polls.updateVote);
  const selfVoted = (votes || {})[currentUser] === 1;
  
  const handleChange = (event) => {
    var votePayload = { pollKey, optionKey };
    votePayload.newVote = selfVoted ? null : 1;
    updateVote(votePayload);
  };

  return (
    <div className="Option">
      <input type="checkbox" key={optionKey} checked={selfVoted} onChange={handleChange}/>
      {Object.values(votes || {}).filter(x => x === 1).length} - {text}
    </div>
  )
}

export default Option;