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
            connection.query('SELECT `id` FROM `files` WHERE `storedName` = ?', [storedName], (error, results) => {
                if (results.length) {
                    storedName = getFileName(fileName);
                }
            });
            return storedName;
        },
        isImage: function (type) {
            if (type.substr(0, 5) == 'image') {
                console.log(type)
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
    next();
});

router.get('*', (req, res, next) => {
    pageScripts = [];
    pageCSS = [];
    next();

    // login functions here?
});

module.exports = router;
