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
  
  data: {},
  updateData: action((state, newState) => {
    state.data = newState;
  }),
  fetch: thunk(async (actions, payload) => {
    await axios.post(apiUrl + "fetchPollPage", payload).then(res => {
      actions.updateData(res.data || {})
    }).catch(err => {
      console.error(err);
    });
  })
};

const store = createStore({
  polls: pollsModel
});

export default store;