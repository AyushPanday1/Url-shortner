const urlmodel = require('../model/urlmodel');
const axios = require('axios');
const shortid = require('shortid');
const {SET_ASYNC,GET_ASYNC} = require('../redis/redis.js')

/*VALIDATION FOR EMPTY URL IN BODY_______________________________________________ */

const isValidurltype = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;

    return true;
}

/*FIRST API_____________________________________________________________________ */

const createurl = async function (req, res) {
    try {

        /*VALIDATION FOR EMPTY DATA___________________________________________ */
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Please pass info in body." })

        let data = req.body;

        let { longurl } = data;

        if (!longurl) return res.status(400).send({ status: false, message: "Please pass long url in data." })

        if (!isValidurltype(longurl)) return res.status(400).send({ status: false, message: "Please pass  valid long url in data." })

        /*CHECKING IN CACHE__________________________________________________ */
        
        let cachedData = await GET_ASYNC(`${urlCode}`);
        if(cachedData){
            return res.status(200).send({status:true,message:"Cached data",data:JSON.parse(cachedData)})
        }

        /*CHECKING IF IT IS ALREADY IN DB____________________________________ */
        let findindb = await urlmodel.findOne({ longurl }).select({ _id: 0, longurl: 1, shorturl: 1, urlcode: 1 })

        /*SETTING IN CACHE___________________________________________________ */
        if (findindb){
            await SET_ASYNC(`${longUrl}`, 60 * 5, JSON.stringify(findindb))
            return res.status(200).send({ status: true, message: "Data from db", data: findindb })}

        /*TAKING THE BASE URL FROM HEADERS IN HOST___________________________ */
        let baseurl = req.headers.host;

        let result = await axios.get(longurl)
            .then(() => [])
            .catch(() => "")

        if (!result) return res.status(400).send({ staus: false, message: "Passed Url does not exists." })

        const urlCode = shortid.generate().toLowerCase();
        const shortUrl = `http://${baseurl}/${urlCode}`

        data.shortUrl = shortUrl;
        data.urlCode = urlCode;

        /*CREATING NEW DATA________________________________________________ */

        await urlmodel.create(data);

        let urlinfo = {};

        urlinfo.urlCode = urlCode;
        urlinfo.longurl = longurl;
        urlinfo.shortUrl = shortUrl;

        await SET_ASYNC(`${longUrl}`, 60 * 5, JSON.stringify(urlinfo))
        return res.status(201).send({ status: true, message: "Successfully created", data: urlinfo });

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const redirectToUrl = async function (req, res) {

    try {
        const urlCode = req.params.urlCode;

        if (!urlCode) return res.status(400).send({ status: false, message: "Please pass urlcode in params." })

        /*VALIDATION FOR SHORTID CODE __________________________________ */
        if (!shortid.isValid(urlCode)) return res.status(400).send({ status: false, message: "Urlcode is invalid." })

        /*CHECKING IN CACHE_____________________________________________ */
        let cachedData = await GET_ASYNC(`${urlCode}`)
        if (cachedData) {
          let parshingCachedData = JSON.parse(cachedData)
          return res.status(302).redirect(parshingCachedData)
        }

        const findindb = await urlmodel.findOne({urlCode});

        if(!findindb) return res.status(404).send({status:false,messasge:"Url not found."})

        /*REDIRECTING TO ORIGINAL URL___________________________________ */
        await SET_ASYNC(`${urlCode}`, 60 * 5, JSON.stringify(findindb.longUrl))
        return res.status(302).redirect(findindb.longurl)
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}

module.exports.createurl = createurl;
module.exports.redirectToUrl = redirectToUrl;