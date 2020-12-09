const tenant_differ = "243034/";
const tenant_sinf = "243035/";
const token_differ = "243034-0001/"; 
const token_sinf = "243035-0001/"; 
const url = "https://my.jasminsoftware.com/api/";
var FormData = require("form-data");
const { urlencoded, response } = require("express");
const axios = require("axios");
const db = require("../database/database");


exports.get_companies_products = async function getCompanyProducts(req, res, next){


    if(req.params.id != 0 && req.params.id != 1){
        res.status(400).json({success: false, error: "There needs to be a valid id"});
        return;
    }
    
    let params = [req.params.id];
    db.all("SELECT * from company where id=$1",params, function(err,rows){
      if(err){
        res.status(400).json({success: false, error: "Invalid query"});
      }
      else
        rows.forEach(function (row) {
          console.log(row);
          getSalesProducts(row , res);
        }); 
      }); 
}

exports.get_companies_purchased_products = async function getCompanyPurchasedProducts(req, res, next){


  if(req.params.id != 0 && req.params.id != 1){
      res.status(400).json({success: false, error: "There needs to be a valid id"});
      return;
  }
  
  let params = [req.params.id];
  db.all("SELECT * from company where id=$1",params, function(err,rows){
    if(err){
      res.status(400).json({success: false, error: "Invalid query"});
    }
    else
      rows.forEach(function (row) {
        console.log(row);
        getPurchasedProducts(row , res);
      }); 
    }); 
}

exports.get_companies_info = async function getCompanyInfo(req, res, next){

  db.all("SELECT * from company", function(err,rows){
    if(err){
      res.status(400).json({success: false, error: "Invalid query"});
    }
    else
      res.status(200).json({ success: true, result: rows });
  }); 
}

exports.get_warehouses = async function getCompanyWarehouses(req, res, next){
  if(req.params.id != 0 && req.params.id != 1){
    res.status(400).json({success: false, error: "There needs to be a valid id"});
    return;
  }

  let params = [req.params.id];
  db.all("SELECT * from company where id=$1",params, function(err,rows){
    if(err){
      res.status(400).json({success: false, error: "Invalid query"});
    }
    else
      rows.forEach(function (row) {
        console.log(req.params.id);
        getWarehouses(row, res);
      }); 
  });
}

exports.get_suppliers = async function getCompanySuppliers(req, res, next) {
  if(req.params.id != 0 && req.params.id != 1){
    res.status(400).json({success: false, error: "There needs to be a valid id"});
    return;
  }

  let params = [req.params.id];
  db.all("SELECT * from company where id=$1",params, function(err,rows){
    if(err){
      res.status(400).json({success: false, error: "Invalid query"});
    }
    else
      rows.forEach(function (row) {
        console.log(req.params.id);
        getSuppliers(row, res);
      }); 
  });
}
   


async function getToken(result,res){
      //get token!!
      const form = new FormData();
      form.append("grant_type", result.grant_type);
      form.append("client_id", result.client_id);
      form.append("client_secret", result.client_secret);
      form.append("scope", result.scope);

      const requestOptions = {
          method: 'POST',
          body : form
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
          let params = [data.access_token , result.id];
          db.run("UPDATE company SET token = $1 where id = $2", params, function(err){
            if(err){
              res.status(400).json({success: false, error: "Invalid query"});
            }
            console.log("I have updated")
          });
          return data.access_token;
        } catch (error) {
          return error;
        }
}

async function getSalesProducts(result,res){
  let tenant = tenant_differ;
  let company = token_differ;

  if(result.id == 1){
    tenant = tenant_sinf;
    company = token_sinf;
  }

  let token = result.token;
    axios
          .get(url + tenant + company + "salescore/salesitems", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "x-www-form-urlencoded"
            }})
          .then(response => {
            let data = filterInformation(response.data);
            res.status(200).json({ success: true, result: data });
          })
          .catch(error => {
              //console.log(error);
              //token might have expired or might not even exist so get new token and try again!
              console.log("will try token");
              getToken(result).then(response => {
                result.token =response;
                getSalesProducts(result , res);
              });

          });

}

function filterInformation(data) {
  let result = [];

  data.forEach(ub => {
    if(ub.priceListLines.length != 0) {
      result.push({
        'key' : ub.itemKey,
        'description' : ub.description,
        'brand' : ub.brand,
        'price' : ub.priceListLines[0].priceAmount.amount
      });
    }
  });
  
  return result;
}

async function getPurchasedProducts(result,res){
  let tenant = tenant_differ;
  let company = token_differ;

  if(result.id == 1){
    tenant = tenant_sinf;
    company = token_sinf;
  }

  let token = result.token;
  axios
    .get(url + tenant + company + "purchasescore/purchasesItems/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "x-www-form-urlencoded"
      }
    })
    .then(response => {
      let data = response.data;
      res.status(200).json({ success: true, result: data });
    })
    .catch(error => {
      //console.log(error);
      //token might have expired or might not even exist so get new token and try again!
      console.log("will try token");
      getToken(result).then(response => {
        result.token =response;
        getPurchasedProducts(result , res);
      });
    });
}

async function getWarehouses(result, res) {
  console.log(result);
  let tenant = tenant_differ;
  let company = token_differ;

  if(result.id == 1){
    tenant = tenant_sinf;
    company = token_sinf;
  }
//https://my.jasminsoftware.com/api/243034/243034-0001/materialscore/warehouses/
  let token = result.token;
  axios
    .get(url + tenant + company + "materialscore/warehouses/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "x-www-form-urlencoded"
      }
    })
    .then(response => {
      let data = filterWarehouse(response.data);
      res.status(200).json({ success: true, result: data });
    })
    .catch(error => {
      //token might have expired or might not even exist so get new token and try again!
      console.log("will try token");
      getToken(result).then(response => {
        result.token = response;
        getWarehouses(result , res);
      });
    });
}

function filterWarehouse(data) {
  let result = [];

  data.forEach(ub => {
    if(ub.streetName != null) {
      result.push({
        'key' : ub.warehouseKey,
        'street' : ub.streetName,
        'city' : ub.cityName,
        'country' : ub.countryDescription
      });
    }
  });

  return result;
}

function getSuppliers(result, res) {
  let tenant = tenant_differ;
  let company = token_differ;

  if(result.id == 1){
    tenant = tenant_sinf;
    company = token_sinf;
  }
//https://my.jasminsoftware.com/api/243034/243034-0001/materialscore/warehouses/
  let token = result.token;
  axios
    .get(url + tenant + company + "purchasesCore/SupplierParties/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "x-www-form-urlencoded"
      }
    })
    .then(response => {
      let data = filterSuppliers(response.data);
      res.status(200).json({ success: true, result: data });
    })
    .catch(error => {
      //token might have expired or might not even exist so get new token and try again!
      console.log("will try token");
      getToken(result).then(response => {
        result.token = response;
        getSuppliers(result , res);
      });
    });
}

function filterSuppliers(data) {
  let result = [];

  let telephone;
  let electronicMail;
  let companyTaxID;

  data.forEach(ub => {
    (ub.companyTaxID == null || ub.companyTaxID == "") ? companyTaxID = "n/a" : companyTaxID = ub.companyTaxID;
    ub.telephone == null ? telephone="n/a" : telephone = ub.telephone;
    ub.electronicMail == null ? electronicMail="n/a" : electronicMail = ub.electronicMail;


    result.push({
      'name' : ub.name,
      'companyTaxID' : companyTaxID,
      'paymentMethod' : ub.paymentMethod,
      'telephone' : telephone,
      'email' : electronicMail
    });
  });

  return result;
}