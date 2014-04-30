// ==UserScript==
// @name SteamCost
// @namespace github.com/Naouak
// @description Shows some data about your steam receipt history
// @include https://store.steampowered.com/account/
// ==/UserScript==
(function(){
    //Fetch all the transaction nodes.
    var transactions = document.querySelectorAll("#store_transactions .transactions .transactionRow, #store_transactions .hidden_transactions .transactionRow ");
    var transaction_objects = [];

    //Parse each of them to get a transaction list object,
    [].forEach.call(transactions, function(n){
        var transaction = {
            date: n.querySelector(".transactionRowDate").innerText,
            items: n.querySelector(".transactionRowItems .transactionRowTitle").innerText,
            price: n.querySelector(".transactionRowPrice").innerText
        };

        //Formatting the price to get something that works well.
        transaction.price = transaction.price.replace(",",".").replace("--","00");
        if(transaction.price.match(/\d/)){
            transaction.price = transaction.price.replace(/[^\d\.]/g,"");
            transaction.price = parseFloat(transaction.price,10);
        } else {
            transaction.price = 0;
        }
        //Adding everything to the list
        transaction_objects.push(transaction);
    });

    //Calculating the sum of all purchases
    var total = transaction_objects.reduce(function(value, obj){
        return {
            price: value.price + obj.price,
            transactions: value.transactions+1,
            purchases: value.purchases+(obj.price > 0?1:0)
        };
    },{
        price: 0,
        transactions: 0,
        purchases: 0
    });

    alert("You bought for "+(Math.round(total.price*100)/100)+"$(or whatever your currency on steam is) with "+total.purchases+" purchases on your steam.");
})();
