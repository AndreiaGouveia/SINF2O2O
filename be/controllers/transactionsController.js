const { urlencoded, response } = require("express");
const tenant_differ = "243034/";
const tenant_sinf = "243035/";
const token_differ = "243034-0001/";
const token_sinf = "243035-0001/";
const url = "https://my.jasminsoftware.com/api/";
const axios = require("axios");
const db = require("../database/database");
var FormData = require("form-data");



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
  req.params.id = 0;

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
        console.log(req.params.id);
        getPurchasedOrders(row, res);
      });
  });
}

async function getPurchasedOrders(result, res) {
  console.log(result);
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
      let data = response.data;
      res.status(200).json({ result: data });
    })
    .catch(error => {
      //token might have expired or might not even exist so get new token and try again!
      console.log("will try token");
      getToken(result).then(response => {
        result.token = response;
        getPurchasedOrders(result, res);
      });
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
        console.log(row);
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
      //console.log(error);
      //token might have expired or might not even exist so get new token and try again!
      console.log("will try token");
      getToken(result).then(response => {
        result.token = response;
        getSalesProducts(result, res);
      });

    });

} 

exports.create_company_order = async function createCompanyProducts(req, res, next) {
  req.params.id = 0;

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
        console.log(row);
        createOrder(row, res);
      });
  });
}

async function createOrder(result, res) {
  //get token!!


  let tenant = tenant_differ;
  let company = token_differ;
  let token = result.token;

  var docLines = {
    purchasesItem: 'CEREALS_CHOCO',
    quantity: 30,
    unitPrice: 2
  };


  const bodyParameters = {
    documentType: 'ECF',
    company: 'D',
    sellerSupplierParty: 0001,
    sellerSupplierParty: 0001,
    sellerSupplierPartyName: 'SINF',
    documentDate: "2020-12-12T00:00:00",
    deliveryTerm: 'Transp',
    paymentMethod: "TRA",
    paymentTerm: 01,
    loadingCountry: 'PT',
    accountingParty: 0001,
    documentLines: docLines
  };

  /*  var result; */



  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "x-www-form-urlencoded"
    }
  };

  //console.log(aux);
  try {
    const response = await axios.post(
      "https://my.jasminsoftware.com/api/243034/243034-0001/purchases/orders",
      bodyParameters,
      config
    ).then(response => {
      let data = response.data;
      res.status(200).json({ result: data });
    }).catch(error => {
      //console.log(error);
      //token might have expired or might not even exist so get new token and try again!
      console.log("will try token");
      getToken(result).then(response => {
        result.token = response;
        console.log(result.token);
        createOrder(result, res);
      });
    });/* 
      const { data } = response;
      console.log("ALOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
      if (response.status !== 200) {
        return Promise.reject(data);
      }
      return true; */
      return data;
    } catch (error) {
      return error;
    }

  }

  ////////////////////////////////////////// New Structure ////////////////////////////////////////////

  exports.getorders = async function teste(){
    //get database info
    let params = ['purchased'];

      db.all("SELECT id, state from companyOrder where type=$1", params, function (err, rows) {
        if (err) {
          console.log("i am error :'(" + err);
        }
        else{
          console.log("I AM ALIVE")
          let idsList = [];
          rows.forEach(element => {
            idsList.push(element.id);
          })
          handleDatabaseResponse(rows,idsList);
        }
      });
  }

  async function handleDatabaseResponse(response,idsList){
    //o get orders e o check status of orders can be done simulaniously!
    console.log("im got reply")
    console.log(response);

    //getOrders();
    getOrders(response,idsList);

    //checking status of our orders
    checkStatus(response);

    //compareOrdes

    //-> if new 
      // insert new orders(database) and create new sale order in jasmin (sinf) -- ter em conta que já pode estar tratado
    
    // check status of each order!
    //have a handler to see which status and ask jasmin the respective solution and alter the status  
  }

  async function checkStatus(response){
    console.log("I am inside check status");
    response.forEach(element => {
      console.log(element);
    });
  }

  async function getOrders(orders,idsList) {
  
    db.all("SELECT * from company where id=0", function (err, rows) {
      if (err) {
        console.log("Invalid query" );
        return;//doesnt do anything
      }
      else {
        getOrdersPurchased(rows[0] , orders,idsList);
      }
    });
  }

  async function getOrdersPurchased(companyInfo , orders, idsList) {
  
    let token = companyInfo.token;
  
    axios
      .get(url + tenant_differ + token_differ + "/purchases/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "x-www-form-urlencoded"
        }
      })
      .then(response => {
        let data = response.data;
        compareOrders(data,orders,idsList);
      })
      .catch(error => {
        //token might have expired or might not even exist so get new token and try again!
        console.log("will try token");
        getToken(companyInfo).then(response => {
          companyInfo.token = response;
          getOrdersPurchased(companyInfo, orders,idsList);
        });
      });
  }

  async function compareOrders(jasminOrders,orders,idsLists){
    console.log("im on compareOrders");
    console.log("ids list");
    console.log(idsLists);

    jasminOrders.forEach(element => {
      if(idsLists.includes(element.id)){
        console.log("I already exist");  
      }
      else{ 
        //temos de adicionar salesorders na sinf() e adicionar essa salesorder na bd.
        console.log("I dont exist");  
        insertNewOrderToDB(element.id);
        addNewOrderToSeller(element);
      }
    });
  }

  async function insertNewOrderToDB(orderID){
    //add order on sql
    // insert one row into the langs table
    db.run(`INSERT INTO companyOrder(id,state,type) VALUES(?,?,?)`, [orderID,1,'purchased'], function(err) {
      if (err) {
        return console.log(err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted`);
    });
  }

  async function addNewOrderToSeller(order){
    //post to sinf
    //todo
  }