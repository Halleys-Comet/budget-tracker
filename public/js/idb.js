let db;

// establish connection to IndexedDB database
const request = indexedDB.open('budget_tracker', 1);
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_budget', { autoIncrement: true });
  };

  // upon a successful 
request.onsuccess = function(event) {
    // when db is successfully created with its object store save reference to db in global variable
    db = event.target.result;
  
    // check if app is online, if yes run function to send all local db data to api
    if (navigator.onLine) {

    }
  };
  
  request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
  };

  function saveRecord(record) {
    //   open new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access the object store for 'new_budget'
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add recordto your store with add method
    budgetObjectStore.add(record);
  }