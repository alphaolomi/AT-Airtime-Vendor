const credentials = {
    username: 'alphao'
}

const AfricasTalking = require('africastalking')(credentials)

const airtime = AfricasTalking.AIRTIME

const options = {
    recipients: [{
        phoneNumber: "+255747991498",
        currencyCode: "TZS",
        amount: "1000"
    }]
};

airtime.send(options)
    .then( response => {
        console.log(response);
    })
    .catch( error => {
        console.log(error);
    });