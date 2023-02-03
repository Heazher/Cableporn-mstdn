# CablePorn Mastodon bot.
This is the core of [@CablePorn@botsin.space](https://botsin.space/@CablePorn), This software is made to link [r/CablePorn](https://reddit.com/r/cablePorn) and [Mastodon](https://botsin.space/@CablePorn)  
Everytime the bot start, it will send a new post to mstdn if one is found.  
Every days at 2PM GTM (11PM JST) it will check for the latest post in the database and post it on mstdn.

## Config file:
To run this bot you will need:
+ Access to mstdn API.
+ A mongoDB Database

Copy the `config.json.exemple` and name the file `config.json` 
```bash
 cp config.json.exemple config.json
 ```
You should have something like this:
```
{
    "dbLink": "mongodb+srv://[USERNAME]:[PASSWORD]@[DATABASE DNS/IP]/CablePorn",
    "client_key": "",
    "access_token": "",
    "client_secret": ""
}
```
Fill all the information.  
~~Note: account must be the bot account name without the @. for me it would look like this: `"account": "_RiseDev"`~~

## More information: 
This bot is running on NodeJS 16, we havent tested it on older version, because this is a side project, and our main project [Yukiko](https://Yukiko.app) is running on NodeJS 16.  
This bot is owned by [Stellar Corporation](https://slettar-corp.net)
