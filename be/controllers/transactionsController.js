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
  req.params.id=1;

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