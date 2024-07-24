const express = require('express');
const urlRouter = express.Router();
const urlController = require('../controller/urlController');

// create short url
urlRouter.post('/short', urlController.createShortUrl)

// find and redirect to original url
urlRouter.get('/:urlId', urlController.redirectToOriginalUrl)

 // to get all saved urls
 urlRouter.get('/all',urlController.getAllUrl)


module.exports = urlRouter;