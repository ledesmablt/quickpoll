import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Poll from './../Poll';
import './PollPage.css';

function PollPage() {
  const pollPageId = useStoreState(state => state.polls.currentPage);
  var pollData = useStoreState(state => state.polls.pollData);
  var userName = useStoreState(state => state.polls.userName);
  const setUserName = useStoreActions(actions => actions.polls.setUserName);
  const userList = useStoreState(state => state.polls.userList);
  const modifyPageTitle = useStoreActions(actions => actions.polls.modifyPageTitle);
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
    userName = prompt("Please enter your username (temporary)", "");
    setUserName(userName);
  };
  const changePageTitleHandler = () => {
    var title = prompt("Please enter a new page title", pollData.title);
    modifyPageTitle({ pollPageId, title });
  };

  return  (
    <div className="PollPage">
      <div className="UserSection">
        <p className="UserInfo">Logged in as <b>{ userName }</b></p>
        <button className="ChangeUserName" onClick={changeUserNameHandler}>Change user</button>
        <p><b>Users</b>: { Array.from(userList).join(", ") }</p>
      </div>
      <div className="PageTitleContainer">
        <h2 className="PageTitle">{ pollData.title }</h2>
        <button className="ChangePageTitle" onClick={changePageTitleHandler}>Change title</button>
      </div>
      <hr />
      <div className="PollsContainer">
        { polls }
      </div>
      <button onClick={createPollHandler}>Add another poll</button>
    </div>
  )
}

export default PollPage;