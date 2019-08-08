// Scratch file for interactive node testing of the API
// Run from client folder in order to use Axios

const Axios = require("axios");

Axios.get("http://localhost:3001/api/alphabets").then(result =>
  console.log(result.data)
);

Axios.post("http://localhost:3001/api/alphabets", {
  name: "Anglish",
  chart: {
    timestamp: 0,
    cols: 5,
    letters: [{ forms: ["B", "b"], exampleWord: "", imagePath: "" }]
  }
}).then(result => console.log(result.data));

Axios.post("http://localhost:3001/api/alphabets/1565194266565/charts", {
  timestamp: 0,
  cols: 30,
  letters: [{ forms: ["A", "a"], exampleWord: "Apple", imagePath: "" }]
}).then(result => console.log(result.data));
