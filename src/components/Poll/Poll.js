import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Option from './../Option'

function Poll({ pollKey, title, users, options }) {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  const userName = useStoreState(state => state.polls.userName);
  const createOption = useStoreActions(actions => actions.polls.createOption)
  const optionsComponents = Object.keys(options || {}).map(optionKey =>
    <Option key={optionKey} pollKey={pollKey} optionKey={optionKey} { ...options[optionKey] } />
  );

  const createOptionHandler = () => {
    // do now allow adding of duplicate option text
    const optionPayload = {
      pollPageId, pollKey, userName,
      text: prompt("Please enter an option text", ""),
    };
    if ((optionPayload.text || "") === "") {
      return;
    } else {
      createOption(optionPayload);
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