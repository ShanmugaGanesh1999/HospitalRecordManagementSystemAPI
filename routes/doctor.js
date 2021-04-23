var express = require("express");
const { isValidObjectId } = require("mongoose");
var router = express.Router();

var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var blacklistModel = require("../model/blacklistModel");
var doctorModel = require("../model/doctorModel");

/**
 * @swagger
 * /doctor/createDoctor/:
 *   post:
 *     summary: To create doctor details
 *     tags:
 *       - doctor
 *     description: To create doctor details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: doctor
 *         description: To create doctor details
 *         in: body
 *         default: '{"doctorName":"Harsheni","emailId":"harshenic@gmail.com","mobileNo":"7871894772","specialization":"Anesthesiology","DOP":"01.01.2001"}'
 *         schema:
 *           $ref: '#/definitions/createDoctor'
 *     responses:
 *       200:
 *         description: Successfully created doctor details
 */
/**
 * @swagger
 * definitions:
 *   createDoctor:
 *     properties:
 *       doctorName:
 *         type: string
 *       emailId:
 *         type: string
 *       mobileNo:
 *         type: number
 *       specialization:
 *         type: string
 *       DOP:
 *         type: date
 */
router.post(
    "/createDoctor",
    // verifyToken.verifyToken,
    async function (req, res, next) {
        try {
            var doctorEmail = await doctorModel
                .model()
                .find({ emailId: req.body.emailId });
            let doctorData = req.body;
            // console.log(req.body);
            doctorData.status = "Away";
            if (doctorEmail == "") {
                doctorModel
                    .createDoctor(doctorData)
                    .then((data) => {
                        res.status(200).json({
                            message: "Successfully created Doctor",
                            data: data,
                        });
                    })
                    .catch((error) => {
                        res.status(403).json({
                            message: error,
                        });
                    });
            } else {
                res.status(403).json({
                    message: "This Doctor details already created",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /doctor/getAlldoctors/:
 *   get:
 *     summary: Get all doctor details
 *     tags:
 *       - doctor
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
 *       - doctor
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
                    message: "Not such doctor details available",
                });
            }
        } catch (error) {
            res.status(403).json({
                message: "Not an valid doctor id",
            });
        }
    },
);

/**
 * @swagger
 * /doctor/updateDoctorStatusById/:
 *   put:
 *     summary: Update doctor status
 *     tags:
 *       - doctor
 *     description: Update doctor status
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: id
 *         description: Doctor id to be updated
 *         in: query
 *         default: '6082738d32c6042de4930ab9'
 *       - name: status
 *         description: Doctor status
 *         in: query
 *         default: 'Active'
 *         schema:
 *           $ref: '#/definitions/updateDoctorStatusById'
 *     responses:
 *       200:
 *         description: Successfully update doctor status
 */
/**
 * @swagger
 * definitions:
 *   updateDoctorStatusById:
 *     properties:
 *       id:
 *         type: string
 *       status:
 *         type: string
 */
router.put(
    "/updateDoctorStatusById",
    // verifyToken.verifyToken,
    function (req, res) {
        var id = req.query.id,
            state = req.query.status;
        doctorModel.updateDoctorStatusById(id, state, function (err, data) {
            if (data) {
                res.status(200).json({
                    message: "Updated status of doctor id:" + id,
                    data: data,
                });
            } else {
                res.status(404).json({
                    message: err,
                });
            }
        });
    },
);

module.exports = router;
