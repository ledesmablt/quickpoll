import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

function Option({ optionKey, text, votes }) {
  const currentUser = useStoreState(state => state.polls.currentUser);
  const updateVote = useStoreActions(actions => actions.polls.updateVote);
  const selfVoted = Object.keys(votes || {}).includes(currentUser);
  
  const handleChange = (event) => {
    updateVote(event.target.includes("checked"));
  };

  return (
    <div className="Option">
      <input type="checkbox" key={optionKey} checked={selfVoted} onChange={handleChange}/>
      {Object.keys(votes || {}).length} - {text}
    </div>
  )
}

export default Option;