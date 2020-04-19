import { createStore, action, computed, thunk } from 'easy-peasy';
import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_CORS_PROXY || ""}${process.env.REACT_APP_APIURL}`;

const pollsModel = {
  currentPage: "",
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

  currentUser: "myName",
  setCurrentUser: action((state, newState) => {
    state.currentUser = newState;
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
    const currentUser = state.currentUser;
    const { pollKey, optionKey, newVote } = votePayload;
    var pollData = JSON.parse(JSON.stringify(state.pollData));
    var currentOption = pollData.polls[pollKey].options[optionKey];
    currentOption.votes = currentOption.votes || {};
    currentOption.votes[currentUser] = newVote;
    state.pollData = pollData;
  }),
  updateVote: thunk(async (actions, votePayload) => {
    actions.pushVoteLocal(votePayload);
    // push vote to API
  })
};

const store = createStore({
  polls: pollsModel
});

export default store;