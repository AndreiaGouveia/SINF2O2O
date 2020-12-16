const { urlencoded, response } = require("express");
const tenant_differ = "243034/";
const tenant_sinf = "243035/";
const token_differ = "243034-0001/";
const token_sinf = "243035-0001/";
const url = "https://my.jasminsoftware.com/api/";
const axios = require("axios");
const db = require("../database/database");
var FormData = require("form-data");
const fetch = require("node-fetch");



async function getToken(result, res) {
  //get token!!
  const form = new FormData();
  form.append("grant_type", result.grant_type);
  form.append("client_id", result.client_id);
  form.append("client_secret", result.client_secret);
  form.append("scope", result.scope);

  const requestOptions = {
    method: 'POST',
    body: form
  };

  try {
    const response = await axios.post(
      "https://identity.primaverabss.com/core/connect/token",
      form,
      { headers: { ...form.getHeaders() } }
    );
    const { data } = response;
    if (response.status !== 200) {
      return Promise.reject(data);
    }
    let params = [data.access_token, result.id];
    db.run("UPDATE company SET token = $1 where id = $2", params, function (err) {
      if (err) {
        console.log(err);
        res.status(400).json({ success: false, error: "Invalid query" });
      }
      console.log("I have updated")
    });
    return data.access_token;
  } catch (error) {
    return error;
  }
}


exports.get_company_purchased_orders = async function getCompanyPurchasedOrders(req, res, next) {

  db.all("SELECT * from company where id=0", function (err, rows) {
    if (err) {
      res.status(400).json({ success: false, error: "Invalid query" });
    }
    else
      rows.forEach(function (row) {
        console.log(req.params.id);
        getPurchasedOrders(row, res);
      });
  });
}

async function getPurchasedOrders(result, res) {
  console.log("Getting purchased orders...");
  let tenant = tenant_differ;
  let company = token_differ;

  if (result.id == 1) {
    tenant = tenant_sinf;
    company = token_sinf;
  }

  let token = result.token;

  axios
    .get(url + tenant + company + "/purchases/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "x-www-form-urlencoded"
      }
    })
    .then(response => {

      console.log("Received purchased orders");
      getOrdersBD(res,response.data);
    })
    .catch(error => {
      //token might have expired or might not even exist so get new token and try again!
      console.log("An error occured - Will try token getPurchasedOrders");
      getToken(result).then(response => {
        result.token = response;
        getPurchasedOrders(result, res);
      });
    });
}

async function getOrdersBD(res, data){
  db.all("select order_id, message, date from messages order by order_id", function (err, rows) {
    if (err) {
      res.status(400).json({ success: false, error: "Invalid query" });
    }
    else{
      let responseData = [];
      let tempData = [];
      let temp = [];
      temp.push({message: rows[0].message , date: rows[0].date})

      // ver o caso do array so ter uma mensagem

      for(let i = 1; i< rows.length;i++){
        if(rows[i-1].order_id !== rows[i].order_id ){
          //push old id
          tempData.push({order: rows[i-1].order_id , logs : temp});
          //clean data
          temp = [];
          //put new data
          temp.push({message: rows[i].message , date: rows[i].date});
        }else{
          //push message to current id
          temp.push({message: rows[i].message , date: rows[i].date});
        }

        if(i == rows.length-1) {
          tempData.push({order: rows[i-1].order_id , logs : temp});
        }
      }

      //group 
      for(let i = 0; i<tempData.length ; i++){
        let index = data.findIndex(dat => dat.id === tempData[i].order);
        if(index!=-1){
            //new 
            if(data[index].documentTypeDescription === "Encomenda a fornecedor" && index != -1){
              let orders = [];
              data[index].documentLines.forEach(order => {
                  orders.push(order.quantity + 'x ' + order.description);
              });
              responseData.push({...{messages: tempData[i].logs}, ...{
                date1 : data[index].createdOn.substring(0,19).replace("T"," "),
                order: orders,
                supplier : data[index].sellerSupplierPartyName,
                value : data[index].payableAmount.amount + ' ' + data[index].payableAmount.symbol
              }});  
            }
        }
      }
      res.status(200).json({ result: responseData });
    }
  });
}


exports.get_companies_products = async function getCompanyProducts(req, res, next) {
  req.params.id = 1;

  if (req.params.id != 0 && req.params.id != 1) {
    res.status(400).json({ success: false, error: "There needs to be a valid id" });
    return;
  }

  let params = [req.params.id];
  db.all("SELECT * from company where id=$1", params, function (err, rows) {
    if (err) {
      res.status(400).json({ success: false, error: "Invalid query" });
    }
    else
      rows.forEach(function (row) {
        getSalesProducts(row, res);
      });
  });
}


async function getSalesProducts(result, res) {
  let tenant = tenant_differ;
  let company = token_differ;

  if (result.id == 1) {
    tenant = tenant_sinf;
    company = token_sinf;
  }

  let token = result.token;
  axios
    .get(url + tenant + company + "salescore/salesitems", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "x-www-form-urlencoded"
      }
    })
    .then(response => {
      let data = response.data;
      res.status(200).json({ result: data });
    })
    .catch(error => {
      console.log(error);
      //token might have expired or might not even exist so get new token and try again!
      console.log("An error occured - Will try token getSalesProducts");
      getToken(result).then(response => {
        result.token = response;
        getSalesProducts(result, res);
      });

    });

}

////////////////////////////////////////// New Structure ////////////////////////////////////////////

exports.getorders = async function teste() {
  //get database info
  let params = ['purchased'];

  db.all("SELECT id, state, sellerId from companyOrder where type=$1", params, function (err, rows) {
    if (err) {
      console.log("Error: " + err);
    }
    else {
      let idsList = [];
      rows.forEach(element => {
        idsList.push(element.id);
      })
      handleDatabaseResponse(rows, idsList);
    }
  });
}

async function handleDatabaseResponse(response, idsList) {
  //o get orders e o check status of orders can be done simulaniously!

  //getOrders();
  getOrders(response, idsList);

  //checking status of our orders
  checkStatus(response);

}


///////////////////// Invoices ///////////////////////////////////////////
async function checkStatus(response) {

  let salesOrders = [];

  console.log("----------------------------------------I am inside check status");
  response.forEach(element => {
    if (element.state == 2) {
      salesOrders.push(element)
    }

    //console.log(element);
  });

  console.log("ORDERS WITH STATUS 2");
  console.log(salesOrders);

  getInvoices(salesOrders);
}


async function getInvoices(salesOrders) {

  db.all("SELECT * from company where id=1", function (err, rows) {
    if (err) {
      console.log("Invalid query");
      return;//doesnt do anything
    }
    else {
      getAllInvoices(rows[0], salesOrders);
    }
  });
}


async function getAllInvoices(companyInfo, salesOrders) {
  let token = companyInfo.token;

  axios
    .get(url + tenant_sinf + token_sinf + "billing/invoices", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "x-www-form-urlencoded"
      }
    })
    .then(response => {
      console.log("Fetched invoices...");
      let data = response.data;
      compareIdwithInvoice(data, salesOrders);
    })
    .catch(error => {
      //token might have expired or might not even exist so get new token and try again!
      console.log(error);
      /*console.log("An Error has occured: Will try token");
      getToken(companyInfo).then(response => {
        companyInfo.token = response;
        getAllInvoices(companyInfo, salesOrders);
      });*/
    });
}



async function compareIdwithInvoice(data, salesOrders) {
  console.log("Checking available invoices...");


  //addOrderToSeller(jasminOrders[0])

  data.forEach(element => {
    console.log("invoice element thing " + element.documentLines[0].sourceDocId );
      console.log(element.documentLines[0].sourceDocId );
      let index =salesOrders.findIndex(sale => sale.sellerId === element.documentLines[0].sourceDocId);
      console.log(index);
      if (index!=-1) {
        updateState3Db(salesOrders[index].id);
        createInvoice(element, salesOrders[index].id);
      }
    });
}




async function createInvoice(invoice ,id) {
  console.log("I am creating invoice now");
  db.all("SELECT * from company where id=0", function (err, rows) {
    if (err) {
      console.log("Invalid query");
      return;//doesnt do anything
    }
    else {
      //console.log(rows)
      getToken(rows[0])
        .then(result => {

          let token = result;
          //console.log(token);

          let orders = [];
          invoice.documentLines.forEach(element => {
            orders.push({
              purchasesItem: element.salesItem,
              quantity: element.quantity,
              unitPrice: { amount: element.unitPrice.amount }
            })
          })

          let doc = {
            documentType: "VFA",
            serie: "FIX",
            documentDate: new Date().toISOString(),
            sellerSupplierParty: "0001",
            discount: 0,
            currency: "EUR",
            paymentMethod: "NUM",
            company: "D",
            documentLines: orders
          }

          fetch("https://my.jasminsoftware.com/api/243034/243034-0001/invoiceReceipt/invoices", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            referrerPolicy: "no-referrer",
            body: JSON.stringify(doc) // body data type must match "Content-Type" header
          }).then(function (res) {
            console.log("done processing");
            /* return res.json(); */
            console.log("Created invoice successfully!");
            console.log(res);
            console.log("Response data....")
            console.log(res.json);
            updateState4Db(id);
          }).catch(error => {
            console.log(error);
          });

        })
    }
  });

}


async function updateState3Db(orderId){
  console.log("...... update state 3........");
  console.log(orderId);

  let data = [orderId];
  let sql = `UPDATE companyOrder
              SET state = 3
              WHERE id = ?`;

  db.run(sql, data, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated`);
    log(orderId, "CREATING_INVOICE");

  });
}


async function updateState4Db(orderId){
  console.log("...... update state 4........");

  let data = [orderId];
  let sql = `UPDATE companyOrder
              SET state = 4
              WHERE id = ?`;

  db.run(sql, data, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Row(s) updated`);
    log(orderId, "ORDER_COMPLETED");

  });
}


//////////////////////////////////////////////////////////////////////////////////

async function getOrders(orders, idsList) {

  db.all("SELECT * from company where id=0", function (err, rows) {
    if (err) {
      console.log("Error: Invalid query");
      return;//doesnt do anything
    }
    else {
      getOrdersPurchased(rows[0], orders, idsList);
    }
  });
}

async function getOrdersPurchased(companyInfo, orders, idsList) {

  let token = companyInfo.token;

  axios
    .get(url + tenant_differ + token_differ + "purchases/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "x-www-form-urlencoded"
      }
    })
    .then(response => {
      let data = response.data;
      compareOrders(data, orders, idsList);
    })
    .catch(error => {
      //token might have expired or might not even exist so get new token and try again!
      console.log("An error occured - Will try token getOrdersPurchased");
      getToken(companyInfo).then(response => {
        companyInfo.token = response;
        getOrdersPurchased(companyInfo, orders, idsList);
      });
    });
}

async function compareOrders(jasminOrders, orders, idsLists) {
  console.log("Comparing orders.... ");


  //addOrderToSeller(jasminOrders[0])

  jasminOrders.forEach(element => {
    if (idsLists.includes(element.id)) {
    }
    else {
      //VER SE A ORDER  
      if(element.serie === "FIX" && element.sellerSupplierParty === "0001"){
        console.log("I AM A CORRECT ORDER");
        console.log("Inserting new element...");
        insertNewOrderToDB(element.id);
        addOrderToSeller(element);
      }
    }
  });

  console.log("Finnished comparing orders!")
}

async function insertNewOrderToDB(orderID) {
  //add order on sql
  // insert one row into the langs table
  db.run(`INSERT INTO companyOrder(id,state,type) VALUES(?,?,?)`, [orderID, 1, 'purchased'], function (err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log("Finnished inserting order in database, creating log... ");
    log(orderID,"INITIATED_PURCHASE_ORDER");
  });
}

async function addOrderToSeller(order) {

  //post to sinf
  //todo

  //get SINF token 

  db.all("SELECT * from company where id=1", function (err, rows) {
    if (err) {
      console.log("Error: Invalid query");
      return;//doesnt do anything
    }
    else {
      getToken(rows[0])
      .then(result => {

        let token = result;

        let orders = [];
        order.documentLines.forEach( element => {
          orders.push({
            salesItem: element.purchasesItem,
            quantity: element.quantity,
            unitPrice: { amount: element.unitPrice.amount } 
          })
        });

        let doc ={
          documentType: "ECL",
          serie: "FIX",
          documentDate:new Date().toISOString(),
          buyerCustomerParty: "0001",
          discount: 0,
          currency: "EUR",
          paymentMethod: "NUM",
          company: "SINF",
          deliveryOnInvoice: false,
          documentLines: orders
        }

        fetch("https://my.jasminsoftware.com/api/243035/243035-0001/sales/orders", {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            },
            referrerPolicy: "no-referrer",
            body: JSON.stringify(doc) // body data type must match "Content-Type" header
          }).then(function(res) {
            return res.json();
          }).then(function(json) {
            console.log("Adding sale order to database...")
            //add to database!!! and UPDATE STATE TO 2
            addSaleToDatabase(json , order.id)
          }).catch(function() {
              console.log("error");
          });
      });
    }
  });
}


async function addSaleToDatabase(saleOrderID, orderID) {

  console.log("...... sale order id ........");
  console.log(saleOrderID)
  console.log("...... jasmin order id ........");
  console.log(orderID)

  let data = [saleOrderID, orderID];
  let sql = `UPDATE companyOrder
              SET sellerId = ? , state = 2
              WHERE id = ?`;

  db.run(sql, data, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log("Added sales order to database");
    log(orderID,"CREATED_SALES_ORDER");

  });

}

async function log(orderID, message) {

  console.log("-----order id ........");
  console.log(orderID)
  console.log("-----message  ........");
  console.log(message)

  let data = [orderID, message, new Date().toISOString()];
  let sql = `INSERT INTO messages(order_id,message,date) VALUES(?,?,?)`;

  db.run(sql, data, function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log("Inserted new log!");

  });
}