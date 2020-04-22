import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Option from './../Option'

function Poll({ pollKey, title, users, options }) {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  const userName = useStoreState(state => state.polls.userName);
  const modifyOption = useStoreActions(actions => actions.polls.modifyOption)
  const optionKeysSorted = (Object.keys(options || {}).length === 0)
    ? []
    : Object.keys(options).map(optionKey => {
      let { votes, modifiedTime } = options[optionKey];
      let optionVotes = votes || {};
      let totalVotes = Object.keys(optionVotes).map(voteKey =>
        optionVotes[voteKey] || 0
      );
      return {
        optionKey,
        modifiedTime,
        totalVotes: (totalVotes.length === 0) ? 0 : totalVotes.reduce((a,b) => a + b)
      }
    }).sort((a,b) => {
      // sort by votes and modifiedTime descending
      let voteDiff = b.totalVotes - a.totalVotes;
      return (voteDiff !== 0) ? voteDiff : b.modifiedTime - a.modifiedTime
    }).map(obj => obj.optionKey);
  
  const optionsComponents = optionKeysSorted.map(optionKey =>
    <Option key={optionKey} pollKey={pollKey} optionKey={optionKey} { ...options[optionKey] } />
  );

  const createOptionHandler = () => {
    // do now allow adding of duplicate option text
    const optionPayload = {
      pollPageId, pollKey, userName,
      text: prompt("Please enter an option text", ""),
      modifiedTime: (new Date()).getTime()
    };
    if ((optionPayload.text || "") === "") {
      return;
    } else {
      modifyOption(optionPayload);
    };
  };
  
  return (
    <div className="Poll">
      <h3>{title}</h3>
      {optionsComponents}
      <button onClick={createOptionHandler}>Add</button>
    </div>
  )
}

export default Poll;