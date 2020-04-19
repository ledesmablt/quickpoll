import { createStore, action, computed, thunk } from 'easy-peasy';
import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_CORS_PROXY || ""}${process.env.REACT_APP_APIURL}`;
function createHash() {
  return Math.floor(new Date().getTime() + Math.random() * 10**12).toString(36);
}

const pollsModel = {
  // userName
  userName: "myName",
  setUserName: action((state, newState) => {
    state.userName = newState;
  }),

  // poll page
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

  // poll page data
  pollData: { polls: {} },
  updateData: action((state, newState) => {
    state.pollData = newState;
  }),
  fetch: thunk(async (actions, payload) => {
    await axios.post(apiUrl + "fetchPollPage", payload).then(res => {
      if (Object.keys(res.data || {}).length !== 0) {
        actions.updateData(res.data);
      } else {
        // redirect to home page if page doesn't exist
        actions.setCurrentPage("");
      }
    }).catch(err => {
      console.error(err);
    });
  }),

  // poll
  createPoll: thunk(async (actions, pollPayload) => {
    const pollKey = "poll-" + createHash();
    pollPayload = { ...pollPayload, pollKey };
    actions.createPollLocal(pollPayload);
    actions.createPollApi(pollPayload);
  }),
  createPollLocal: action((state, pollPayload) => {
    const { pollKey, title } = pollPayload;
    var pollData = JSON.parse(JSON.stringify(state.pollData));
    const options = {};
    pollData.polls[pollKey] = { title, options };
    state.pollData = pollData;
  }),
  createPollApi: thunk(async (actions, pollPayload) => {
    await axios.post(apiUrl + "createPoll", pollPayload).then(res => {
      actions.fetch(pollPayload);
      console.log(res);
    }).catch(err => {
      console.error(err);
    })
  }),

  // option
  createOption: thunk(async (actions, optionPayload) => {
    const optionKey = "option-" + createHash();
    optionPayload = { ...optionPayload, optionKey };
    actions.createOptionLocal(optionPayload);
    actions.createOptionApi(optionPayload);
  }),
  createOptionLocal: action((state, optionPayload) => {
    const { pollKey, optionKey, text, userName } = optionPayload;
    var optionVotes = {};
    optionVotes[userName] = 1;
    var pollData = JSON.parse(JSON.stringify(state.pollData));
    var currentPoll = pollData.polls[pollKey];
    currentPoll.options = currentPoll.options || {};
    currentPoll.options[optionKey] = { text, votes: optionVotes };
    state.pollData = pollData;
  }),
  createOptionApi: thunk(async (actions, optionPayload) => {
    await axios.post(apiUrl + "createOption", optionPayload).then(res => {
      actions.fetch(optionPayload);
    }).catch(err => {
      console.error(err);
    });
  }),

  // vote
  updateVote: thunk(async (actions, votePayload) => {
    actions.pushVoteLocal(votePayload);
    actions.pushVoteApi(votePayload);
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
};

const store = createStore({
  polls: pollsModel
});

export default store;