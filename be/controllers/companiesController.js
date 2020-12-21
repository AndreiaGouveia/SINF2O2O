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
            let data = response.data;
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
            }})
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

exports.update_companies_info = async function update_companies_info(id, new_info) {

  console.log("Got here!");

  // Get new token with new info
  let token = getToken(new_info);
  if (token instanceof Error) console.log(token);

  // Post to db updating new_info info once new token is received
  new_info.forEach(input => {
      let params = [input, input.value, id];
      db.run("UPDATE company SET $1 = $2 where id = $3", params, function(err){
          if(err){
            res.status(400).json({success: false, error: "Invalid query"});
          }
          console.log("I have updated")
        });
  })
}
