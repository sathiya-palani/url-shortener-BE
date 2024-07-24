
const urlModel = require("../models/url");
const  shortid = require("shortid");


// validation of url
function validateUrl(value) {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
          '(\\#[-a-z\\d_]*)?$','i');
  
        return !!urlPattern.test(value);
  }

// URL shortener endpoint
const urlController ={
    createShortUrl :    async (req, res) => {
                    console.log("HERE",req.body.url);
                     const { origUrl } = req.body;
                      const base = `http://localhost:5173`;
  
    const urlId = shortid.generate();
    if (validateUrl(origUrl)) {
      try {
        let url = await urlModel.findOne({ origUrl });
        if (url) {
          res.json(url);
        } else {
          const shortUrl = `${base}/${urlId}`;
  
          url = new urlModel({
            origUrl,
            shortUrl,
            urlId,
            date: new Date(),
          });
  
          await url.save();
          res.json(url);
        }
      } catch (err) {
        console.log(err);
        res.status(500).json('Server Error');
      }
    } else {
      res.status(400).json('Invalid Original Url');
    }
  },


// redirect endpoint
redirectToOriginalUrl :  async (req, res) => {
    try {
      const url = await urlModel.findOne({ urlId: req.params.urlId });
      console.log(url);
      if (url) {
        url.clicks++;
        url.save();
        return res.redirect(url.origUrl);
      } else res.status(404).json("Not found");
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
} ,


// get all saved URLs
getAllUrl :async (req, res) => {
    urlModel.find((error, data) => {
      if (error) {
        return next(error);
      } else {
        res.json(data);
      }
    });
}
}
module.exports = urlController;