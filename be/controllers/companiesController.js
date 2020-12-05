const tenant_differ = "243034/";
const tenant_sinf = process.env.TENANT_SINF;
const token_differ = "243034-0001/"; 
const token_sinf = process.env.SINF; 
const url = "https://my.jasminsoftware.com/api/";
var FormData = require("form-data");
const { urlencoded, response } = require("express");
const axios = require("axios");
const db = require("../database/database");


exports.get_companies_products = async function getCompanieProducts(req, res, next){


    if(req.params.id != 0 && req.params.idv != 1){
        res.status(400).json({success: false, error: "There needs to be a valid id"});
        return;
    }

    if(req.params.id == 0) //DIFFER
    {
        console.log(db)
        let result = {};
        db.all("SELECT * from company where id=0", function(err,rows){
            if(err)
            console.log(err);
            else
            rows.forEach(function (row) {
              console.log("i am gehre")
                result = row;
                getSalesProducts(result , res);
          }); 
        }); 

        
    }else{ //SINF

    }
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
            let params = [data.access_token , 0];
            db.run("UPDATE company SET token = $1 where id = $2", params, function(err){
              if(err){
                console.log(err);
              }
              console.log("I have updated")
            });
            return data.access_token;
          } catch (error) {
            return error;
          }
          console.log("livin ma life")

}

async function getSalesProducts(result,res){
  let token = result.token;
    axios
          .get(url  + tenant_differ +  token_differ + "salescore/salesitems", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "x-www-form-urlencoded"
            }})
          .then(response => {
            let data = response.data;
            res.status(200).json({ success: true, result: data });
          })
          .catch(error => {
              console.log(error);
              //token might have expired or might not even exist
              getToken(result).then(response => {
                result.token =response;
                getSalesProducts(result , res);
              });
              //res.status(400).json({ success: false, error: "error getting Sales Items" });
          });

}

exports.test = async function test(req, res, next){
  console.log("iam the test bae");
  console.log(db)
  db.all("SELECT * from company", function(err,rows){
      if(err)
      console.log(err);
      else
      rows.forEach(function (row) {
          console.log("im a row") 
          console.log(row);
    }); 
  }); 
} 