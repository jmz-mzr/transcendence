http = require("http");

var options = {
  path: "/profile",
  timeout: 2000,
};

var request = http.request(process.env.BACKEND_URL, options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode == 401) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on("error", function (err) {
  console.log("ERROR");
  process.exit(1);
});

request.end();
