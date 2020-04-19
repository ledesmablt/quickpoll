import { createStore, action, computed, thunk } from 'easy-peasy';
import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_CORS_PROXY || ""}${process.env.REACT_APP_APIURL}`;

const pollsModel = {
  currentPage: window.location.pathname.slice(1,),
  setCurrentPage: action((state, newState) => {
    state.currentPage = newState;
    window.location.pathname = "/" + newState;
  }),
  createPollPage: thunk(async (actions, payload) => {
    await axios.get(apiUrl + "createPollPage").then(res => {
      actions.setCurrentPage(res.data.pollPageId);
    }).catch(err => {
      console.error(err);
    })
  }),

  userName: "myName",
  setUserName: action((state, newState) => {
    state.userName = newState;
  }),
  
  pollData: { polls: {} },
  updateData: action((state, newState) => {
    state.pollData = newState;
  }),
  fetch: thunk(async (actions, payload) => {
    await axios.post(apiUrl + "fetchPollPage", payload).then(res => {
      actions.updateData(res.data || {})
    }).catch(err => {
      console.error(err);
    });
  }),

  pushVoteLocal: action((state, votePayload) => {
    const { pollKey, optionKey, userName, newVote } = votePayload;
    var pollData = JSON.parse(JSON.stringify(state.pollData));
    var currentOption = pollData.polls[pollKey].options[optionKey];
    currentOption.votes = currentOption.votes || {};
    currentOption.votes[userName] = newVote;
    state.pollData = pollData;
  }),
  pushVoteApi: thunk(async (actions, votePayload) => {
    await axios.post(apiUrl + "modifyVote", votePayload).then(res => {
      actions.fetch(votePayload);
    }).catch(err => {
      console.error(err);
    });
  }),
  updateVote: thunk(async (actions, votePayload) => {
    actions.pushVoteLocal(votePayload);
    actions.pushVoteApi(votePayload);
  })
};

const store = createStore({
  polls: pollsModel
});

export default store;