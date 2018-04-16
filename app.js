const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require ('morgan');
var path = require('path');
const https = require('https');


setup();
app.listen(process.env.port || 3000, () => console.log('bound on port 3000'))

function setup(){
    app.set('view engine', 'pug')
    app.set('views', path.join(__dirname, '/views'));
    

    app.get('/:sub/:sort', (req, res) => {
        getReddit(req.params.sub,req.params.sort)
            .then((response)=>{ 
                res.render('hello', {
                    sub: req.params.sub,
                    sort: req.params.sort,
                    response: response
                })
            })
            .catch(err=> console.log(err))

    })
    

}

function buildOptionsObj(sub, sort) {
    return {
        hostname: `www.reddit.com`,
        path: `/r/${sub}/${sort}.json`,
        headers: {
            'User-Agent': 'grabber'
        }
    }
}
function getReddit(sub,sort) {
    return new Promise((resolve, rej) => {
        const opts = buildOptionsObj(sub, sort)
        https.get(opts, (dataStream) => {
            const { statusCode } = dataStream;
            const contentType = dataStream.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            }
            if (error){
                rej(error);
            }
            let redditData = ''
            dataStream.on('data', chunk => {
                redditData += chunk
                console.log(chunk);
            })
            dataStream.on('end', () => {
                console.log(redditData)
                resolve(redditData)
            })
        })
        .on("error", function (error) {
            console.log(error.message);
        });
    })

}