import request from'request';
import pool from '../db.js';
let priceList = [];

function priceBitcoin() {
    const options = {
        'method': 'GET',
        'url' : 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=b5a194cf16f1a5108cf53e87b7c039d1ac78891ecda55930a01575b22b2557c3'
    };
    request(options, function(error, response){
        if (error) console.log(error)
        let data = response.body;
        data = JSON.parse(data);
        let bitprice = data.USD;
        pool.query("INSERT INTO price (bitprice) VALUES ($1)",[bitprice])          
    });
};

priceBitcoin();
setInterval(priceBitcoin, 60000);

export default priceList;