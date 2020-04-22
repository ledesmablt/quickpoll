import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Poll from './../Poll';
import './PollPage.css';

function PollPage() {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  const pollData = useStoreState(state => state.polls.pollData);
  const userName = useStoreState(state => state.polls.userName);
  const userList = useStoreState(state => state.polls.userList);
  const setUserName = useStoreActions(actions => actions.polls.setUserName);
  const modifyPoll = useStoreActions(actions => actions.polls.modifyPoll);

  const polls = Object.keys(pollData.polls || {}).map(pollKey =>
    <Poll key={pollKey} pollKey={pollKey} { ...((pollData.polls || {})[pollKey]) } />
  );

  // event handlers
  const createPollHandler = () => {
    const pollPayload = {
      pollPageId,
      title: prompt("Please enter a poll title", "")
    };
    if ((pollPayload.title || "") === "") {
      return;
    } else {
      modifyPoll(pollPayload);
    };
  };
  const changeUserNameHandler = () => {
    var userName = prompt("Please enter your username (temporary)", "");
    setUserName(userName);
  };

  return  (
    <div className="PollPage">
      <div className="UserSection">
        <p className="UserInfo">Logged in as <b>{ userName }</b></p>
        <button className="ChangeUserName" onClick={changeUserNameHandler}>Change</button>
        <p><b>Users</b>: { Array.from(userList).join(", ") }</p>
      </div>
      <h2>{ pollData.title }</h2>
      <hr />
      <div className="PollsContainer">
        { polls }
      </div>
      <button onClick={createPollHandler}>Add another poll</button>
    </div>
  )
}

export default PollPage;