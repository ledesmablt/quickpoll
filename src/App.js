import React from 'react';
import { StoreProvider, useStoreState, useStoreActions } from 'easy-peasy';

import store from './stores';
import PollPage from './components/PollPage';
import './App.css';

function InitialFetch() {
  const pollPageId = window.location.pathname.slice(1,);
  var userName = useStoreState(state => state.polls.userName);
  const setUserName = useStoreActions(actions => actions.polls.setUserName);
  const fetchData = useStoreActions(actions => actions.polls.fetch);

  if (pollPageId) {
    if (userName === "default") {
      userName = prompt("Please enter your username (temporary)", "");
      setUserName(userName);
    } else {
      fetchData({ pollPageId });
    }
  };
  return null;
}

function Home() {
  const pollPageId = window.location.pathname.slice(1,);
  const createPollPage = useStoreActions(actions => actions.polls.createPollPage);
  
  if (!pollPageId) {
    // render home page if on root
    return (
      <div className="Home">
        <button className="Create-page" onClick={createPollPage}>Create poll page</button>
      </div>
    )
  } else {
    // render poll page
    return (
      <PollPage />
    )
  }
}

function App() {
  return (
    <div className="App">
      <StoreProvider store={store}>
        <InitialFetch />
        <h1>QuickPoll</h1>
        <Home />
      </StoreProvider>
    </div>
  );
}

export default App;
