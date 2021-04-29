var express = require("express");
const { isValidObjectId } = require("mongoose");
var router = express.Router();

var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var blacklistModel = require("../model/blacklistModel");
var doctorModel = require("../model/doctorModel");

/**
 * @swagger
 * /doctor/getAlldoctors/:
 *   get:
 *     summary: Get all doctor details
 *     tags:
 *       - Doctor
 *     description: Get all doctor details
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
 *         description: Successfully fetched all doctor details
 */
router.get(
    "/getAllDoctors",
    // verifyToken.verifyToken,
    function (req, res) {
        doctorModel.getAllDoctors((err, res1) => {
            try {
                if (res1.length > 0) {
                    res.status(200).json({
                        message: "Fetched all doctor details",
                        data: res1,
                        count: res1.length,
                    });
                } else {
                    res.status(404).json({
                        message: "No doctor details available",
                    });
                }
            } catch (error) {
                res.status(404).json({
                    error: error,
                });
            }
        });
    },
);

/**
 * @swagger
 * /doctor/getDoctorById/:
 *   get:
 *     summary: Get details of a doctor by Id
 *     tags:
 *       - Doctor
 *     description: Get details of a doctor by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: id
 *         description: Doctor id
 *         type: string
 *         in: query
 *         default: '6082738d32c6042de4930ab9'
 *         required: true
 *     responses:
 *       200:
 *         description:  Get details of a doctor by id
 */
router.get(
    "/getDoctorById",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            var doctorId = req.query.id;
            console.log(isValidObjectId(doctorId));
            var doctorData = await doctorModel.model().find({ _id: doctorId });
            if (doctorData != "" && isValidObjectId(doctorId)) {
                res.status(200).json({
                    message: "Fetched details of doctor successfully",
                    data: doctorData,
                });
            } else {
                res.status(404).json({
                    message: "No such doctor details available",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: "Not a valid id",
            });
        }
    },
);

/**
 * @swagger
 * /doctor/getDoctorsByStatus/:
 *   get:
 *     summary: Get details of a doctor by Status
 *     tags:
 *       - Doctor
 *     description: Get details of a doctor by Status
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: status
 *         description: Doctor status
 *         type: string
 *         in: query
 *         default: 'Active'
 *         required: true
 *     responses:
 *       200:
 *         description:  Get details of a doctor by status
 */
router.get(
    "/getDoctorsByStatus",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            var doctorStatus = req.query.status;
            var doctorData = await doctorModel
                .model()
                .find({ status: doctorStatus });
            if (doctorData != "") {
                res.status(200).json({
                    message: "Fetched details of doctors successfully",
                    data: doctorData,
                });
            } else {
                res.status(404).json({
                    message: "No doctors available",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: "No doctors available",
            });
        }
    },
);
/**
 * @swagger
 * /doctor/updateDoctorStatusById/:
 *   put:
 *     summary: Update doctor status by id
 *     tags:
 *       - Doctor
 *     description: Update doctor status by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: doctor
 *         description: Update doctor status by id
 *         in: body
 *         default: '{"id":"6082738d32c6042de4930ab9","status":"Active"}'
 *         schema:
 *           $ref: '#/definitions/updateDoctorStatus'
 *     responses:
 *       200:
 *         description: Updated doctor status by id Successfully
 */
/**
 * @swagger
 * definitions:
 *   updateDoctorStatus:
 *     properties:
 *       id:
 *         type: string
 *       status:
 *         type: string
 */
router.put(
    "/updateDoctorStatusById",
    // verifyToken.verifyToken,
    async function (req, res) {
        var doctorData = req.body;
        if (isValidObjectId(req.body.id)) {
            var doctorId = await doctorModel.model().find({ _id: req.body.id });
            if (doctorId != "") {
                doctorModel.updateDoctorStatusById(
                    doctorData,
                    function (err, data) {
                        if (data) {
                            res.status(200).json({
                                message:
                                    "Updated status of doctor id:" + data.id,
                                data: data,
                            });
                        } else {
                            res.status(404).json({
                                message: err,
                            });
                        }
                    },
                );
            } else {
                res.status(403).json({
                    message: "Doctor details not available",
                });
            }
        } else {
            res.status(403).json({
                message: "Not a valid id",
            });
        }
    },
);

/**
 * @swagger
 * /doctor/getDoctorIdByEmailId/:
 *   get:
 *     summary: Get doctor email id by id
 *     tags:
 *       - Doctor
 *     description: Get doctor email id by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: emailId
 *         description: Get doctor email id by id
 *         type: string
 *         in: query
 *         default: "harsheni@mailfence.com"
 *         required: true
 *     responses:
 *       200:
 *         description: Get doctor email id by id
 */
router.get(
    "/getDoctorIdByEmailId",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            var doctorEmailId = req.query.emailId;
            // console.log(doctorEmailId);
            var doctorData = await doctorModel
                .model()
                .find({ emailId: doctorEmailId });
            // console.log(doctorData);
            if (doctorData != "") {
                res.status(200).json({
                    message: "Fetched doctor id successfully",
                    doctorId: doctorData[0]._id,
                });
            } else {
                res.status(404).json({
                    message: "No such doctor details available",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

module.exports = router;
