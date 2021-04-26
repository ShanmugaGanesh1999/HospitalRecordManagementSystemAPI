var express = require("express");
var router = express.Router();
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var managementModel = require("../model/managementModel");
var dateFormat = require("dateformat");
var now = new Date();

/* GET Management listing. */
router.get("/", function (req, res) {
    res.send("respond with a resource");
});

/**
 * @swagger
 * /management/createCount:
 *   post:
 *     summary: Create an management
 *     tags:
 *       - Management
 *     description: Create a management
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *     responses:
 *       200:
 *         description: Create an management
 */
router.post(
    "/createCount",
    // verifyToken.verifyToken,
    function (req, res) {
        try {
            let count = 0;
            var data = managementModel.createCount(count);
            if (data) {
                res.status(200).json({
                    message: "Count created successfully",
                });
            } else {
                res.status(403).json({
                    message: "Not created",
                });
            }
        } catch (error) {
            res.status(404).json({
                message: error,
            });
        }
    },
);

/**
 * @swagger
 * /management/getAllCounts/:
 *   get:
 *     summary: Get details of all the Counts
 *     tags:
 *       - Management
 *     description: Get details of all the Counts
 *     produces:
 *       - application/json
 *     parameters:
 *        - name: x-access-token
 *          description: send valid token
 *          type: string
 *          required: false
 *          in: header
 *     responses:
 *       200:
 *         description:  Get details of all the Counts
 */

router.get(
    "/getAllCounts",
    // verifyToken.verifyToken,
    function (req, res) {
        managementModel
            .getAllCounts()
            .then((management) => {
                if (management) {
                    res.status(200).json({
                        message: "Successfully fetched details of all Counts",
                        count: management.length,
                        data: management,
                    });
                } else {
                    res.status(404).json({
                        message: "No Management found",
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    message: err,
                });
            });
    },
);

/**
 * @swagger
 * /management/getCountByDate:
 *   get:
 *     summary: Get details of a Management by Date
 *     tags:
 *       - Management
 *     description: Get details of a Management by Date
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: date
 *         description: date
 *         type: Date
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an Management by Id
 */

router.get(
    "/getCountByDate",
    // verifyToken.verifyToken,
    function (req, res) {
        var date = req.query.date;
        managementModel
            .getCountByDate(date)
            .then((data) => {
                if (data) {
                    res.status(200).json({
                        message:
                            "Successfully fetched the Counts in given date:" +
                            date,
                        data: data,
                    });
                } else {
                    res.status(404).json({
                        message: "Details not found",
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    message: err,
                });
            });
    },
);

/**
 * @swagger
 * /management/updateCountByDate/:
 *   put:
 *     summary: Update Count details
 *     tags:
 *       - Management
 *     description: Update Count details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: String
 *         required: false
 *         in: header
 *       - name: state
 *         description: plus-1/minus-0
 *         type: String
 *         in: query
 *     responses:
 *       200:
 *         description: Successfully completed
 */
router.put(
    "/updateCountByDate",
    // verifyToken.verifyToken,
    function (req, res) {
        managementModel
            .getAllCounts()
            .then((data) => {
                if (data) {
                    data.forEach((element) => {
                        if (
                            dateFormat(element.date, "fullDate") ===
                            dateFormat(now, "fullDate")
                        ) {
                            var params = {
                                id: element._id,
                                state: req.query.state,
                            };
                            managementModel.updateCountByDate(
                                params,
                                function (err, data) {
                                    if (data) {
                                        res.status(200).json({
                                            message: "Updated Count",
                                            data: data,
                                        });
                                    } else {
                                        res.status(404).json({
                                            message: err,
                                        });
                                    }
                                },
                            );
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "No Management found",
                    });
                }
            })
            .catch((err) => {
                res.status(404).json({
                    message: err,
                });
            });
    },
);

module.exports = router;
