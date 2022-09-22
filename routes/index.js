'use strict';
const express = require('express');
const { phone } = require('phone');

const router = express.Router();

const {
    sendAirtime,
    doesFileExist,
    createBusinessOwnerFile,
    createAirtimeLogs,
    getAdminInfo,
} = require('../utils/index');

router.get('/', (req, res) => res.render('pages/index'));

router.post('/sign_up', async (req, res) => {
    //receive Admin username and password -> then save it
    const admin_username = req.body.admin_username;
    const admin_password = req.body.admin_password;

    const output = await createBusinessOwnerFile({
        admin_username,
        admin_password,
    });

    if (output.status === 'successful') {
        req.session.user = {
            admin_username,
        };
        // good
        res.json({
            admin_username,
            admin_password,
            output,
        });
    } else {
        //bad
        res.status(500).json(output);
    }
});

router.post('/sign_in', async (req, res) => {
    //receive Admin username and password
    const admin_username = req.body.admin_username;
    const admin_password = req.body.admin_password;

    if (!admin_password || !admin_username) {
    }
    let data = await getAdminInfo();

    console.log({
        admin_username,
        admin_password,
        data,
    });
});

router.post('/add_at_credentials', async (req, res) => {
    //receive API Keys and username
    const apiKey = req.body.apiKey;
    const username = req.body.username;

    const output = await createBusinessOwnerFile({
        apiKey,
        username,
    });

    if (output.status === 'successful') {
        //good
        res.json({
            admin_username,
            admin_password,
            output,
        });
    } else {
        //bad
        res.status(500).json(output);
    }
});

router.post('/send_airtime', async (req, res) => {
    //receive phone numbers and amount
    let errors = [];
    let phoneNumbers = [];

    let _phoneNumbers = req.body.phoneNumbers;
    let amount = req.body.amount;

    let recipients = _phoneNumbers?.split(',');

    recipients.map((rp) => {
        let phoneInfo = phone(_phoneNumber, { country: 'TZ' }); // OR KE
        if (!phoneInfo.isValid) {
            errors.push(`Invalid phone: ${rp}`);
        } else {
            phoneNumbers.push(rp);
        }
    });

    if (errors.length) {
        res.json({
            errors,
        });
    }

    const airtimeResult = await sendAirtime({ phoneNumbers, amount });
    if (airtimeResult.status === 'successful') {
        // write to file
        let output = await createAirtimeLogs({
            singleTransaction: airtimeResult.data,
        });
    } else {
        res.status(500).json({
            ...airtimeResult,
        });
    }
});

module.exports = router;
