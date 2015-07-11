db = new PouchDB('tile');
db.destroy().then(function () {
  // success
}).catch(function (error) {
  console.log(error);
});