/**
 * 
 * I will be nice and write the comments in English. 
 * No need to thank be. but if you want to just send: 
 * 「Kyoちゃん、英語でコメントを書いてくれて本当にありがとうございます！」
 * to @_RiseDev on Twitter
 * or @Heazher@mstdn.jp on mastdn (＾◡＾)
 * 
 * ***********************************************
 * 
 * Feel free to open an issue or a PR if you find something to change or have an issue with the code :)
 * I'll do my best to reply as soon as I can, Just know that work is taking most of my time. 
 * So I can't guaranty when i will reply. Sorry!
 * 
 * ***********************************************
 * 
 * This code is still based of Heazher/CablePorn.
 * I know it's not very fancy, but I did it in an hour at the office.
 * 
 */

const Mstdn = require("mastodon-api");
const fs = require("fs");
const mongoose = require("mongoose");
const axios = require("axios");
const AWS = require("aws-sdk");
const schedule = require("node-schedule");
const Media = require("./models/Media");
const {
  client_key,
  access_token,
  client_secret,
  aws_key,
  aws_secret,
  DBUri,
} = require("../config.json");
const request = require("request")
const Path = require("path");


// initialize AWS (๑•̀ㅂ•́)و✧
/**
 * Dev Will use my AWS Bucket.
 * Production Probabaly the same, but should use Nishikino Networks's CDN.
 */

AWS. config.update({
  accessKeyId: aws_key,
  secretAccessKey: aws_secret,
    region: "ap-northeast-1",
    s3ForcePathStyle: true
})

const s3 = new AWS.S3();

// Initialize Database (•̀ᴗ•́)و ̑̑
mongoose.connect(DBUri);
mongoose.connection.on("open", (host) =>
  console.log("[DATABASE]: 接続されました！")
);
mongoose.connection.on("error", (err) =>
  console.log(`[DATABASE]: エラーが発生しました。${err}`)
);

// Initialize Mstdn client. (•̀ᴗ•́)و ̑̑ 
const M = new Mstdn({
  client_key,
  access_token,
  client_secret,
  timeout_ms: 60 * 1000,
  api_url: "https://mstdn.jp/api/",
});

// Sleep technology 9000 (Super advenced stuff u know.) (⇀‸↼‶)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Get new post on boot. ( ･ิ,_ゝ･ิ)ヾ
fetchReddit()
.then(() => {
  getMedia();
})

// Get new posts (•̀ᴗ•́)و ̑̑ 
async function fetchReddit() {
  axios.get(`https://reddit.com/r/cableporn.json?sort=top&limit=800`)
  .then(async (res) => {
    const posts = res.data.data.children;
    posts.forEach(async (reddit) => {
      let data = reddit.data;
      if(reddit.data.url_overridden_by_dest == null) return console.log(`🙅‍♀️ ${data.id} has No media.`);
      if(!reddit.data.url_overridden_by_dest.endsWith(".jpg") && !reddit.data.url_overridden_by_dest.endsWith(".png")) return;
      const media = await Media.findOne({ PostId: data.id });
      if(media) return console.log(`🙅‍♀️ ${data.id} is already saved in the database.`)
      const uploadMedia = async (file) => {
        const params = {
          Bucket: "kyoko-cdn",
          Key: `CablePorn/media/${data.id}.jpg`,
          Body: fs.readFileSync(file),
          ACL: "public-read",
          ContentType: "image/jpeg"
        };
        return await s3.upload(params).promise();
      }
      const download = async (url, path, callback) => {
        await request.head(url, async (err, res,body) => {
          await request(url)
          .pipe(fs.createWriteStream(path))
          .on("close", callback);
        })
      }
      const url = data.url_overridden_by_dest;
      const path = Path.join(__dirname, `./media/${data.id}.jpg`)
      await download(url, path, () => {
        console.log(`${data.id} has been downloaded... Uploading to S3`)
        uploadMedia(path)
        .then((dataS3) => {
          console.log(`${data.id} has been uploaded to S3. ${dataS3.Key}`)
          const newMedia = new Media({
            PostId: data.id,
            pictname: dataS3.Key,
            title: data.title,
            Author: data.author,
            url: `https://reddit.com${data.permalink}`,
            isPosted: false
          });
          newMedia.save()
          .then(() => {
            console.log(`${data.id} has been saved in the database.`)
            fs.unlink(path, (err) => {
              if(err) return console.error(err);
              console.log(`${data.id} has been deleted from local disk.`)
            });
          })
        })
      })
    })
  })
}

// Get a post from the database that wasent posted before. (๑•̀ㅂ•́)و✧ 
async function getMedia() {
  const media = await Media.findOne({ isPosted: false });
  if(!media) return postError();
  const download = async (url, path, callback) => {
    await request.head(url, async (err, res,body) => {
      await request(url)
      .pipe(fs.createWriteStream(path))
      .on("close", callback);
    })
  }
  const url = media.pictname;
  const path = Path.join(__dirname, `./media/${media.PostId}.jpg`);
  await download(url, path, () => {
    sendMedia(path, media)
    .then(() => {
      media.isPosted = true;
      media.save()
      .then(() => {
        console.log("OK")
      })
    });
  })
}

// Send media to MSTDN (*'▽')ノ♪
async function sendMedia(path, media) {
  M.post("v2/media", {
    file: fs.createReadStream(path),
  }).then(async (res) => {
    var id = res.data.id;
    console.log(`Media ID: ${id} Waiting 5 seconds...`);

    await delay(5000);

    M.post(
      "v1/statuses",
      {
        status: `${media.title}\nby u/${media.Author}\n${media.url}\nvia r/CablePorn`,
        visibility: "public",
        media_ids: [id],
      },
      (err, data) => {
        if (err) return console.error(err);
        console.log(data);
      }
    );
  });
}

// Send errors to developers (╯°□°）╯︵ ┻━┻
async function postError(error) {
  let err = error;
  if(!err) err = "⚠ No Media found.\n Please fix @heazher@mstdn.jp @Asthriona@mstdn.jp"
  M.post("v1/statues", {
    status: err,
    visibility: "direct",
  }, (err, data) => {
    if(err) return console.log(err);
    console.log(data);
  })
}

// Scheduling! (｡•̀ᴗ-)✧

// Get posts at midnight.
schedule.scheduleJob("0 0 * * *", async () => {
  fetchReddit();
});

// Post new post at 02:00PM GTM (11:00 PM JST.)
schedule.scheduleJob("0 23 * * *", () => {
  getMedia();
});

// Post OLD post Every 6hrs (Later. I gotta get back to work!!!)
// schedule.scheduleJob("0 */6 * * *", () => {
//   getOldMedia();
// });