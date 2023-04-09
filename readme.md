
# CablePorn Mastodon bot.

This is the core of [@CablePorn@botsin.space](https://botsin.space/@CablePorn), This software is made to link [r/CablePorn](https://reddit.com/r/cablePorn) and [Mastodon](https://botsin.space/@CablePorn)
Everytime the bot start, it will send a new post to mstdn if one is found.
Every days at 2PM GTM (11PM JST) it will check for the latest post in the database and post it on mstdn.

## Config file:
To run this bot you will need:
+ Access to mstdn API.
+ A mongoDB Database
+ AWS S3 compatible provider.
Copy the `config.json.exemple` and name the file `config.json`

```bash
cp config.json.exemple  config.json
```

You should have something like this:
```json
{
"DBUri": "mongodb+srv://[USERNAME]:[PASSWORD]@[DATABASE DNS/IP]/CablePorn"
"mastodon": {
"client_key": "MASTODON_CLIENT_ID",
"access_token": "MASTODON_ACCESS_TOKEN",
"client_secret": "MASTODON_CLIENT_SECRET"
},
"aws": {
"key": "AWS_ACCESS_KEY_ID",
"secret": "AWS_SECRET_ACCESS_KEY",
"region": "REGION",
"bucket": "NAME_OF_THE_BUCKET"
},
"reddit": {
"sub": "CablePorn",
"limit": "800"
},
"save_after": false
}
```
Fill all the information.

## Configs Explanation:
`DBUri` is the URI to your mongoDB database.

`mastodon` is the information to connect to your mstdn instance.
`mastodon.client_key` is the client id of your mstdn app.
`mastodon.access_token` is the access token of your mstdn app.
`mastodon.client_secret` is the client secret of your mstdn app.
All the information can be found in your mstdn app settings.

`aws` is the information to connect to your AWS S3 bucket.
`aws.key` is the access key id, that can be found in your AWS IAM console.
`aws.secret` is the secret access key, that can be found in your AWS IAM console.
`aws.region` is the region of your bucket.
`aws.bucket` is the name of your bucket (EG: cdn.kyokodev.xyz).

`reddit` is the information to connect to reddit.
`reddit.sub` is the name of the subreddit you want to connect to **(without r/)**.
`reddit.limit` is the limit of post you want to get from reddit. (We use 800 but you can use less if your bandwidth is limited)

`save_after` is a boolean, if set to true, the bot will save the post after it has been posted on mstdn.
Note: We use adding the possibility not to set `isPosted` to true, because we also run a Twitter bot, and want the bots to post the same post on different platforms.

## Running the bot:
```bash
# debian based
# Install NodeJS using Node's official documentation. (https://github.com/nodesource/distributions#debinstall)
curl -fsSL  https://deb.nodesource.com/setup_16.x  | sudo -E  bash  - &&\
sudo apt  update && sudo apt  install  nodejs

# Install Git:
sudo apt  install  git
cd  CablePorn-mstdn

# Install the dependencies
npm install

# Run the bot for development
sudo npm  -g  i  nodemon
npm run  dev

# Run the bot for production
# You can use pm2 or any other process manager
npm run  start
```
*Note: For other OS please refer to NodeJS's [official documentation](https://nodejs.org/ja).*

## Todo list:
- [x] Setup the bot to post once everyday at specified times.
- [x] Set the bot to post at each boot.
- [ ] Multi account
- [ ] Report errors and crash on Discord and Emails. (report on our personal account for now)
- [ ] ...

## More information:
This bot is running on NodeJS 16, we havent tested it on older/newer versions, because this is a side project, and our main project [Yukiko](https://Yukiko.app) is running on NodeJS 16.

This bot is owned by [Stellar Corporation](https://stellar-corp.net)