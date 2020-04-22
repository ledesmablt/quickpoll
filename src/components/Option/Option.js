import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import './Option.css';

function Option({ pollKey, optionKey, text, votes }) {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  const userName = useStoreState(state => state.polls.userName);
  const modifyOption = useStoreActions(actions => actions.polls.modifyOption);
  const updateVote = useStoreActions(actions => actions.polls.updateVote);
  const selfVoted = (votes || {})[userName] === 1;
  
  const changeVoteHandler = () => {
    const votePayload = {
      pollPageId, pollKey, optionKey, userName,
      newVote: selfVoted ? null : 1,
      modifiedTime: (new Date()).getTime()
    };
    updateVote(votePayload);
  };
  const deleteOptionHandler = () => {
    const optionPayload = {
      pollPageId, pollKey, optionKey,
      action: "delete"
    };
    modifyOption(optionPayload);
  }

  return (
    <div className="Option">
      <input type="checkbox" key={optionKey} checked={selfVoted} onChange={changeVoteHandler}/>
      <p>{Object.values(votes || {}).filter(x => x === 1).length} - {text}</p>
      <button className="Delete" onClick={deleteOptionHandler}>X</button>
    </div>
  )
}

export default Option;