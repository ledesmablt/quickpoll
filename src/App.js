import React from 'react';
import { StoreProvider, useStoreState, useStoreActions } from 'easy-peasy';

import store from './stores';
import Poll from './components/Poll';

import './App.css';

function InitialFetch() {
  const pollPageId = window.location.pathname.slice(1,);
  const fetchData = useStoreActions(actions => actions.polls.fetch);
  if (pollPageId) {
    fetchData({ pollPageId });
  };
  return null;
}

function Home() {
  const pollPageId = window.location.pathname.slice(1,);
  const pollData = useStoreState(state => state.polls.data);
  const createPollPage = useStoreActions(actions => actions.polls.createPollPage);
  if (!pollPageId) {
    return (
      <div className="Home">
        <button className="Create-page" onClick={createPollPage}>Create poll page</button>
      </div>
    )
} else {
    const polls = Object.keys(pollData.polls).map(pollKey =>
      <Poll key={pollKey} pollKey={pollKey} { ...((pollData.polls || {})[pollKey]) } />
    );
    return  (
      <div className="PollPage">
        <h2>{ pollData.title }</h2>
        { polls }
      </div>
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
