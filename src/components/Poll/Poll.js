import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Option from './../Option'

function Poll({ pollKey, title, users, options }) {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  const userName = useStoreState(state => state.polls.userName);
  const updateOption = useStoreActions(actions => actions.polls.updateOption)
  const optionsComponents = Object.keys(options).map(optionKey =>
    <Option key={optionKey} pollKey={pollKey} optionKey={optionKey} { ...options[optionKey] } />
  );

  const addOption = () => {
    // do now allow adding of duplicate option text
    var optionPayload = {
      pollKey, pollPageId, userName,
      text: "hello world"
    }
    updateOption(optionPayload)
  }
  
  return (
    <div className="Poll">
      <h3>{title}</h3>
      {optionsComponents}
      <button onClick={addOption}>Add</button>
    </div>
  )
}

export default Poll;