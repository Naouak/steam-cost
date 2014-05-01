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
            transaction.currency = transaction.price.replace(/[\d\. ]/g,"");
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
        var new_obj = {
            price: value.price,
            transactions: value.transactions+1,
            purchases: value.purchases+(obj.price > 0?1:0)
        };
        if(obj.currency){
            new_obj.price[obj.currency] = new_obj.price[obj.currency] || 0;
            new_obj.price[obj.currency] += obj.price;
        }
        return new_obj;
    },{
        price: {},
        transactions: 0,
        purchases: 0
    });

    console.log(total);


    var node = document.createElement("div");
    node.className = "block";
    document.querySelector(".rightcol").appendChild(node);

    var node_header = document.createElement("div");
    node_header.className = "block_header";
    node_header.innerHTML = "<div>Statistics</div>";
    node.appendChild(node_header);

    var node_content = document.createElement("div");
    node_content.className = "block_content block_content_inner";
    node.appendChild(node_content);

    var str = "";

    for(var i in total.price){
        if(total.price.hasOwnProperty(i)){
            str += "<div class='accountRow accountBalance'><div class='accountData price'>"+(Math.round(total.price[i]*100)/100)+i+"</div><div class='accountLabel'>Total purchase</div></div>";
        }
    }

    str += "<div class='accountRow accountBalance'><div class='accountData price'>"+total.purchases+"</div><div class='accountLabel'>Purchase #</div></div>";
    node_content.innerHTML = str;
})();
