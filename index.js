// script to access api calls
let apiCall = require("./api-calls.js");

// reports presence of secrets file
const fs = require("fs");
fs.exists("./secrets.json", (isExist) => {
  if (isExist) {
    console.log("secrets file is present, proceeding");
  }
  else {
    console.log("secrets file is not present, ask Ethan for his secrets");
    process.exit();
  }
})

// dirty way to test returned strings from API calls
apiCall.GetCurrentConditions().then(string => {
  console.log(string);
})







