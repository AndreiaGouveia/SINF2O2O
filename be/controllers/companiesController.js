const tenant_differ = "243034/";
const tenant_sinf = process.env.TENANT_SINF;
const token_differ = "243034-0001/"; 
const token_sinf = process.env.SINF; 
const url = "https://my.jasminsoftware.com/api/";
const fetch = require("node-fetch");
const { response } = require("../server");
var FormData = require("form-data");
const { urlencoded } = require("express");
const axios = require("axios");


exports.get_companies_products = async function getCompanieProducts(req, res, next){


    if(req.params.id != 0 && req.params.idv != 1){
        res.status(400).json({success: false, error: "There needs to be a valid id"});
        return;
    }

    if(req.params.id == 0) //DIFFER
    {
        //get token!!
        const form = new FormData();
        form.append("grant_type", "client_credentials");
        form.append("client_id", "DIFFER");
        form.append("client_secret", "0766a6e0-8bff-4c08-8ce0-615c2fed2668");
        form.append("scope", "application");

        const requestOptions = {
            method: 'POST',
            body : form
        };
        console.log(form.getHeaders());

        try {
            const response = await axios.post(
              "https://identity.primaverabss.com/core/connect/token",
              form,
              { headers: { ...form.getHeaders() } }
            );
            console.log("here");
            const { data } = response;
            console.log("here2");
            if (response.status !== 200) {
              return Promise.reject(data);
            }
            console.log(data)
            getSalesProducts(data.access_token,res)
          } catch (error) {
            res.status(400).json({success: false, error: error});
          }

    }else{ //SINF

    }
}

async function getSalesProducts(token,res){
    console.log(token);
    console.log(url);
    axios
          .get(url + tenant_differ + token_differ + "salescore/salesitems", {
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
              res.status(400).json({ success: false, error: "error getting Sales Items" });
          });

}