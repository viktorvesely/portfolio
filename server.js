const express = require('express')
const app = express()
const port = 3000

function inject_common(file_name, res) {
  if (file_name === "__common.js") {
    res.sendFile(`${__dirname}/common.js`);
    return true;
  }
  return false;
}

function register_project(folder) {
  app.get(`/${folder}/:file`, (req, res) => {
    let file = req.params["file"]
  
    if (inject_common(file, res)) return;
  
    let path = `${__dirname}/${folder}/${req.params["file"]}`;

    res.sendFile(path);
  });
}


function register_subfolder(folder, subfolder) {
  app.get(`/${folder}/${subfolder}/:file`, (req, res) => {
  
    let path = `${__dirname}/${folder}/${subfolder}/${req.params["file"]}`;

    res.sendFile(path);
  });
}

register_project("particles");
register_project("chaos");
register_project("durko");
register_subfolder("durko", "js");
register_subfolder("durko", "css");

app.get('/:file', (req, res) => {
  res.sendFile(`${__dirname}/overseer/${req.params["file"]}`);
})

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/overseer/index.html`)
})


app.listen(port, () => {
  console.log(`Test app ${port}`)
})