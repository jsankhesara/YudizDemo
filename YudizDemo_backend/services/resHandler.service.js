'use strict';
module.exports = {
    handleError: function (res, err) {
        console.log(err)

        if (typeof err === 'object') {
            res.status(err.statusCode ? err.statusCode : 500).json({ data: null, is_error: true, message: err.message });

        } else {
            res.status(200).json({ data: null, is_error: true, message: err });
        }
    },

    handleManyRequest: function (res, err) {
        console.log(err)

        if (typeof err === 'object') {
            res.status(err.statusCode ? err.statusCode : 504).json({ data: null, is_error: true, message: err.message });

        } else {
            res.status(200).json({ data: null, is_error: true, message: err });
        }
    },

    handleResult: (res, data, message = "") => {
        res.status(200).json({ data, is_error: false, message: message });
    }
};
