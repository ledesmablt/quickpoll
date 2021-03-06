import { createStore, action, computed, thunk } from 'easy-peasy';
import * as firebaseFunctions from './../firebase';

function createHash() {
  return Math.floor(new Date().getTime() + Math.random() * 10**12).toString(36);
}

const pollsModel = {
  // userName
  userName: "default",
  setUserName: action((state, newUserName) => {
    state.userName = newUserName || ("anonymous-" + createHash());
  }),
  userList: computed(state => {
    let polls = state.pollData.polls;
    var users = [];
    for (let pollKey in polls) {
      if (typeof polls[pollKey] === "undefined") {
        continue;
      }
      let options = polls[pollKey].options;
      for (let optionKey in options) {
        let votes = options[optionKey].votes;
        users = users.concat(Object.keys(votes || {}));
      }
    }
    return new Set(users);
  }),

  // poll page
  currentPage: window.location.pathname.slice(1,),
  setCurrentPage: action((state, newState) => {
    state.currentPage = newState;
    window.location.pathname = "/" + newState;
  }),
  createPollPage: thunk((actions, payload) => {
    firebaseFunctions.createPollPage().then(res => {
      actions.setCurrentPage(res.pollPageId);
    }).catch(err => {
      console.error(err);
    })
  }),
  modifyPageTitle: thunk((actions, payload) => {
    actions.modifyPageTitleLocal(payload.title);
    firebaseFunctions.modifyPageTitle(payload).then(res => {
      actions.fetch(payload);
    }).catch(err => {
      console.error(err);
    })
  }),
  modifyPageTitleLocal: action((state, title) => {
    state.pollData.title = title;
  }),

  // poll page data
  pollData: { polls: {} },
  updateData: action((state, newState) => {
    state.pollData = newState;
  }),
  fetch: thunk((actions, payload) => {
    firebaseFunctions.fetchPollPage(payload).then(res => {
      if (res) {
        actions.updateData(res);
      } else {
        // redirect to home page if page doesn't exist
        actions.setCurrentPage("");
      }
    }).catch(err => {
      console.error(err);
    });
  }),

  // poll
  modifyPoll: thunk((actions, pollPayload) => {
    const pollKey = pollPayload.pollKey || "poll-" + createHash();
    pollPayload = { ...pollPayload, pollKey };
    actions.modifyPollLocal(pollPayload);
    actions.modifyPollFirebase(pollPayload);
  }),
  modifyPollLocal: action((state, pollPayload) => {
    const { pollKey, title, action } = pollPayload;
    var pollData = JSON.parse(JSON.stringify(state.pollData));
    if (action === "delete") {
      delete pollData.polls[pollKey];
    } else {
      const options = {};
      if (typeof pollData.polls === "undefined") {
        pollData.polls = {};
      }
      pollData.polls[pollKey] = { title, options };
    }
    state.pollData = pollData;
  }),
  modifyPollFirebase: thunk((actions, pollPayload) => {
    let promise;
    switch (pollPayload.action) {
      case "delete":
        promise = firebaseFunctions.deletePoll(pollPayload);
        break;
      default:
        promise = firebaseFunctions.createPoll(pollPayload);
        break;
    }
    promise.then(res => {
      actions.fetch(pollPayload);
    }).catch(err => {
      console.error(err);
    })
  }),

  // option
  modifyOption: thunk((actions, optionPayload) => {
    const optionKey = optionPayload.optionKey || "option-" + createHash();
    optionPayload = { ...optionPayload, optionKey };
    actions.modifyOptionLocal(optionPayload);
    actions.modifyOptionFirebase(optionPayload);
  }),
  modifyOptionLocal: action((state, optionPayload) => {
    const { pollKey, optionKey, text, userName, modifiedTime, action } = optionPayload;
    var votes = {};
    votes[userName] = 1;
    var pollData = JSON.parse(JSON.stringify(state.pollData));
    if (typeof pollData.polls === "undefined") {
      pollData.polls = {};
    }
    var currentPoll = pollData.polls[pollKey];
    currentPoll.options = currentPoll.options || {};
    if (action === "delete") {
      delete currentPoll.options[optionKey];
    } else {
      currentPoll.options[optionKey] = { text, modifiedTime, votes };
    }
    state.pollData = pollData;
  }),
  modifyOptionFirebase: thunk((actions, optionPayload) => {
    let promise;
    switch (optionPayload.action) {
      case "delete":
        promise = firebaseFunctions.deleteOption(optionPayload);
        break;
      default:
        promise = firebaseFunctions.createOption(optionPayload);
        break;
    }
    promise.then(res => {
      actions.fetch(optionPayload);
    }).catch(err => {
      console.error(err);
    });
  }),

  // vote
  updateVote: thunk((actions, votePayload) => {
    actions.pushVoteLocal(votePayload);
    actions.pushVoteFirebase(votePayload);
  }),
  pushVoteLocal: action((state, votePayload) => {
    const { pollKey, optionKey, userName, newVote, modifiedTime } = votePayload;
    var pollData = JSON.parse(JSON.stringify(state.pollData));
    var currentOption = pollData.polls[pollKey].options[optionKey];
    currentOption.votes = currentOption.votes || {};
    currentOption.votes[userName] = newVote;
    currentOption.modifiedTime = modifiedTime;
    state.pollData = pollData;
  }),
  pushVoteFirebase: thunk((actions, votePayload) => {
    firebaseFunctions.modifyVote(votePayload).then(res => {
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