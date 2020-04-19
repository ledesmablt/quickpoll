const functions = require('firebase-functions').region('asia-east2');
const admin = require('firebase-admin');
const defaultPoll = require('./defaultPoll.json');
admin.initializeApp();


function createHash() {
  return Math.floor(new Date().getTime() + Math.random() * 10**12).toString(36);
}

exports.createPollPage = functions.https.onRequest((request, response) => {
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

exports.fetchPollPage = functions.https.onRequest((request, response) => {
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

exports.modifyVote = functions.https.onRequest((request, response) => {
  const { pollPageId, pollKey, optionKey, userName, newVote } = request.body;
  const childPath = `${pollPageId}/polls/${pollKey}/options/${optionKey}/votes`
  var userVote = admin.database().ref("page").child(childPath);
  
  const voteData = {};
  voteData[userName] = newVote;
  const snapshot = userVote.update(voteData);
  response.send(snapshot);
})