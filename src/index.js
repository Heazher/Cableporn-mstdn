const Mstdn = require("mastodon-api");
const fs = require("fs");
const { client_key, access_token, client_secret } = require("../config.json");

const M = new Mstdn({
    client_key,
    access_token,
    client_secret,
    timeout_ms: 60 * 1000,
    api_url: "https://mstdn.jp/api/v1/"
});

// Lists of random words
const words = [
    'buffet',
    'recession',
    'multiply',
    'unfair',
    'tip',
    'gloom',
    'delay',
    'despise',
    'knife',
    'snail',
    'canvas',
    'hunter',
    'technology',
    'illusion',
    'diet',
    'tender',
    'child',
    'annual',
    'crisis',
    'dynamic',
    'name',
    'compact',
    'jet',
    'ivory',
    'reign',
    'sphere',
    'defeat',
    'football',
    'appreciate',
    'wrong',
    'hen',
    'pocket',
    'equal',
    'mass',
    'imperial',
    'spontaneous',
    'departure',
    'drawing',
    'substitute',
    'snuggle',
    'pest',
    'castle',
    'we',
    'locate',
    'proclaim',
    'insight',
    'style',
    'star',
    'pudding',
    'realize',
]

function randomWords(n) {
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push(words[Math.floor(Math.random() * words.length)]);
    }
    return result;
}

M.post("statuses", {
    status: `@heazher \n${randomWords(2).join(" ")}`,
    visibility: "direct"
}, (err, data) => {
    if (err) return console.error(err);
    console.log(`Status: ${data.id}, ${data.createdAt}`);
});