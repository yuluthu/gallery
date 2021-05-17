var express = require('express');
var router = express.Router();

router.all('*', (req, res, next) => {
    coreFunctions = {
        uniqId: function (length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         },
         _numberWithCommas: (x) => {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        },
        ParseFloat: function(value) {
            value = parseFloat(value);
            return isNaN(value) ? 0 : value;
        },
        ParseInt: function(value) {
            value = parseInt(value);
            return isNaN(value) ? 0 : value;
        },
        getFilename: function (fileName) {
            var split = fileName.split(/\.(?=[^\.]+$)/);
            var storedName = coreFunctions.uniqId(20) + '.' + split[1]
            return storedName;
        },
        isImage: function (type) {
            if (type.substr(0, 5) == 'image') {
                switch (type.substr(6)) {
                    case 'jpg':
                    case 'gif':
                    case 'png':
                    case 'jpeg':
                        return true
                }
            }
            return false;
        },
    }
    now = Date.now();

    if (req.originalUrl.indexOf('.css') == -1 && req.originalUrl.indexOf('.js') == -1 && req.originalUrl.indexOf('.ico') == -1) {
        let connectionsLog = connection.collection('connections_log');
        connectionsLog.insertOne({
            ip: req.header('X-Real-IP'),
            params: req.params,
            path: req.originalUrl,
            time: new Date
        });
    }


    next();
});

router.get('*', (req, res, next) => {
    pageScripts = [];
    pageCSS = [];
    next();

    // login functions here?
});

module.exports = router;
