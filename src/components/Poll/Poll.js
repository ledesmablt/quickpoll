import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Option from './../Option';
import './Poll.css';

function Poll({ pollKey, title, users, options }) {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  const userName = useStoreState(state => state.polls.userName);
  const modifyPoll = useStoreActions(actions => actions.polls.modifyPoll);
  const modifyOption = useStoreActions(actions => actions.polls.modifyOption);
  
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

  // event handlers
  const createOptionHandler = () => {
    const optionPayload = {
      pollPageId, pollKey, userName,
      text: prompt("Please enter an option text", ""),
      modifiedTime: (new Date()).getTime()
    };
    const optionTexts = optionKeysSorted.map(key => options[key].text);
    if ((optionPayload.text || "") === "") {
      return;
    } else if (optionTexts.includes(optionPayload.text)) {
      alert("That option already exists.");
      return;
    } else {
      modifyOption(optionPayload);
    };
  };
  const deletePollHandler = () => {
    var confirmDelete = window.confirm("Delete this poll? This will also delete all options.");
    if (!confirmDelete) {
      return;
    } else {
      const optionPayload = {
        pollPageId, pollKey,
        action: "delete"
      };
      modifyPoll(optionPayload);
    }
  };
  
  return (
    <div className="Poll">
      <div className="PollHeader">
        <h3>{title}</h3><button className="DeletePoll" onClick={deletePollHandler}>Delete Poll</button>
      </div>
      {optionsComponents}
      <button className="CreateOption" onClick={createOptionHandler}>Add</button>
    </div>
  )
}

export default Poll;