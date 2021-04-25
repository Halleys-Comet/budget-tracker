let db;

// establish connection to IndexedDB database
const request = indexedDB.open('budget_tracker', 1);
// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(e) {
    // save a reference to the database 
    const db = e.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_budget', { autoIncrement: true });
  };

  // upon a successful 
request.onsuccess = function(e) {
    // when db is successfully created with its object store save reference to db in global variable
    db = e.target.result;
  
    // check if app is online, if yes run function to send all local db data to api
    if (navigator.onLine) {
        console.log('Navigator online');
        uploadTransaction();
    }
  };
  
  request.onerror = function(e) {
    // log error here
    console.log(e.target.errorCode);
  };

  function saveRecord(record) {
    //   open new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access the object store for 'new_budget'
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add recordto your store with add method
    budgetObjectStore.add(record);
    alert('You are now offline.\nBudget Tracker will submit all offline activity to chart once internet connection is restored.')
  };

function uploadTransaction() {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) throw new Error(serverResponse);

                    const transaction = db.transaction(['new_budget'], 'readwrite');
                    const budgetObjectStore = transaction.objectStore('new_budget');
                    
                    budgetObjectStore.clear();
                    alert('All offline activity has been submitted')
                })
                .catch(err => console.log(err));
        }
    };
};


window.addEventListener('online', uploadTransaction);