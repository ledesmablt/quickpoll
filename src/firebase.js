import * as firebase from 'firebase/app';
import 'firebase/database';

const defaultPoll= require('./defaultPoll.json');

const firebaseConfig = require('./firebase-credentials.json');
firebase.initializeApp(firebaseConfig);

function createHash() {
  return Math.floor(new Date().getTime() + Math.random() * 10**12).toString(36);
}

export async function createPollPage() {
  // create new default poll
  const pollPageId = createHash();
  var ref = firebase.database().ref("page").child(pollPageId);
  return ref.set(defaultPoll).then(snapshot => {
    return {
      pollPageId, snapshot
    };
  });
}


export async function fetchPollPage(payload) {
  // fetch all poll data from pollPageId
  const pollPageId = payload.pollPageId;
  const pollPage = firebase.database().ref("page").child(pollPageId);
  
  return pollPage.once("value").then(snapshot => {
    return snapshot.val();
  }, err => {
    console.error(err);
    return err;
  });
}

export async function createPoll(payload) {
  const { pollPageId, pollKey, title } = payload;
  const childPath = `${pollPageId}/polls`;
  var poll = firebase.database().ref("page").child(childPath);
  
  var pollData = {};
  pollData[pollKey] = { title };
  const snapshot = poll.update(pollData);
  return snapshot;
}

export async function deletePoll(payload) {
  const { pollPageId, pollKey } = payload;
  const childPath = `${pollPageId}/polls/${pollKey}`;
  var poll = firebase.database().ref("page").child(childPath);
  const snapshot = poll.remove();
  return snapshot;
}

export async function createOption(payload) {
  const { pollPageId, pollKey, optionKey, text, userName } = payload;
  const childPath = `${pollPageId}/polls/${pollKey}/options`;
  var option = firebase.database().ref("page").child(childPath);
  
  const optionData = {};
  optionData[optionKey] = { text, votes: {} };
  optionData[optionKey].votes[userName] = 1;
  const snapshot = option.update(optionData);
  return snapshot;
}

export async function deleteOption(payload) {
  const { pollPageId, pollKey, optionKey } = payload;
  const childPath = `${pollPageId}/polls/${pollKey}/options/${optionKey}`;
  var option = firebase.database().ref("page").child(childPath);
  const snapshot = option.remove();
  return snapshot;
}

export async function modifyVote(payload) {
  const { pollPageId, pollKey, optionKey, userName, newVote, modifiedTime } = payload;
  const childPath = `${pollPageId}/polls/${pollKey}/options/${optionKey}`;
  var option = firebase.database().ref("page").child(childPath);
  var userVote = option.child('votes');
  
  const voteData = {};
  voteData[userName] = newVote;
  const snapshot = [userVote.update(voteData), option.update({ modifiedTime })];
  return snapshot;
}