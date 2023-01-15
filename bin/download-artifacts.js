const cheerio = require('cheerio');
const axios = require('axios');
const { spawn } = require('child_process');

const sevenBin = require('7zip-bin')
const { extractFull } = require('node-7z')
const pathTo7zip = sevenBin.path7za

let URL = "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/"
axios.get(URL)
  .then(response => {
    const $ = cheerio.load(response.data)
    let u = URL + $("a").attr("href").replace("./", "")
    download(u, () => {
      extract('server.7z', () => {
        delFile('server.7z', () => {
          console.log("DONE")
        })
      })
    })
  })

const delFile = (file, cb) => {
  const ls = spawn('rm', ['-r', file]);
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    cb(0)
  });
}

const extract = (file, cb) => {
  const seven = extractFull(file, './artifacts/', {
    $bin: pathTo7zip,
    $progress: true
  })
  seven.on('progress', function (progress) {
    console.log(progress) //? { percent: 67, fileCount: 5, file: undefinded }
  })
  seven.on('end', ()=> setTimeout(cb, 1000))
  seven.on('error', (err) => console.log(err))
}

const download = (u, cb) => {
    const ls = spawn('curl', [u,'--output', 'server.7z']);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      cb(0)
    });
  }