/*
 * File: index.js
 * Project: make-carbonara-requests
 * Copyright: This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
const { SSL_OP_EPHEMERAL_RSA } = require('constants')
const fs = require('fs')
const request = require('request')

const download = function(uri, args=null, filename, callback=function() {}) {
    const options = {
        uri: uri,
        method: 'POST',
        json: true,
        body: args
    }   
    // request(options, (err, res, body) => {
    //     print()
    // })
    // console.log(options)
    request(options).pipe(fs.createWriteStream(filename));
}

async function make_carbon_request(code, language, filename) {
    console.log('Starting downloading code \"' + code + '\" to file \"' + filename + "\"")
    download('http://127.0.0.1:3000/api/cook', {
        "code": code,
        "language": language
    }, filename + ".png");
    console.log('Finished download. Waiting')
    await sleep(2500)
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

async function send_code_bits(code, language, first_file_name) {
    console.log(code);
    console.log(code.length);
    const folder = './output/';
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
    let last_filename = 0;
    const full_filename = folder + first_file_name;
    for (var i=1; i<=code.length; i++) {
        await make_carbon_request(code.slice(0, i), language, full_filename + "_" + last_filename);
        last_filename++;
    }
    for (var i=1; i<=code.length; i++) {
        await make_carbon_request(code.slice(0, i * -1), language, full_filename + "_" + last_filename);
        last_filename++;
    }
}

send_code_bits("echo hi", "application/x-sh", "ech")