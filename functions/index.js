const functions = require('firebase-functions').region('asia-east2');
const admin = require('firebase-admin');
const defaultPoll = require('./defaultPoll.json');

// var serviceAccount = require('./../.env.secret.json');
// if (serviceAccount) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://quickpoll-941294513.firebaseio.com"
//   });
// } else {
admin.initializeApp();
// }


function createHash() {
  return Math.floor(new Date().getTime() + Math.random() * 10**12).toString(36);
}

createPollPage = functions.https.onRequest((request, response) => {
  // create new default poll
  const pollPageId = createHash();
  var ref = admin.database().ref("page").child(pollPageId);
  var pollPage = {};
  pollPage[pollPageId] = defaultPoll;

  const snapshot = ref.set(defaultPoll);
  response.send({
    pollPageId, snapshot
  });
})

fetchPollPage = functions.https.onRequest((request, response) => {
  // fetch all poll data from pollPageId
  const pollPageId = request.body.pollPageId;
  const pollPage = admin.database().ref("page").child(pollPageId);
  
  pollPage.on("value", snapshot => {
    response.send(snapshot.val());
  }, err => {
    console.error(err);
    response.send(err);
  });
})

createPoll = functions.https.onRequest((request, response) => {
  const { pollPageId, pollKey, title } = request.body;
  const childPath = `${pollPageId}/polls`;
  var poll = admin.database().ref("page").child(childPath);
  
  var pollData = {};
  pollData[pollKey] = { title };
  const snapshot = poll.update(pollData);
  response.send(snapshot);
})

createOption = functions.https.onRequest((request, response) => {
  const { pollPageId, pollKey, optionKey, text, userName } = request.body;
  const childPath = `${pollPageId}/polls/${pollKey}/options`;
  var option = admin.database().ref("page").child(childPath);
  
  const optionData = {};
  optionData[optionKey] = { text, votes: {} };
  optionData[optionKey].votes[userName] = 1;
  const snapshot = option.update(optionData);
  response.send(snapshot);
})

modifyVote = functions.https.onRequest((request, response) => {
  const { pollPageId, pollKey, optionKey, userName, newVote } = request.body;
  const childPath = `${pollPageId}/polls/${pollKey}/options/${optionKey}/votes`;
  var userVote = admin.database().ref("page").child(childPath);
  
  const voteData = {};
  voteData[userName] = newVote;
  const snapshot = userVote.update(voteData);
  response.send(snapshot);
})