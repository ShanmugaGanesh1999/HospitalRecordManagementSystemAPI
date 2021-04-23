var express = require("express");
const { isValidObjectId } = require("mongoose");
var router = express.Router();

var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var blacklistModel = require("../model/blacklistModel");
var doctorModel = require("../model/doctorModel");

/**
 * @swagger
 * /doctor/createDoctors/:
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
    "/createDoctors",
    // verifyToken.verifyToken,
    async function (req, res, next) {
        try {
            var doctorEmail = await doctorModel
                .model()
                .find({ emailId: req.body.emailId });
            let doctorData = req.body;
            // console.log(req.body);
            doctorData.status = "Active";
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
 * /doctor/getDoctorsById/:
 *   get:
 *     summary: Get details of a doctors by Id
 *     tags:
 *       - doctor
 *     description: Get details of a doctors by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: id
 *         description: doctorId
 *         type: string
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description:  Get details of a doctor by id
 */
router.get(
    "/getDoctorsById",
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
 * /doctor/updateDoctorsStatusById/:
 *   put:
 *     summary: Update doctors details by id
 *     tags:
 *       - candidates
 *     description: Update doctors details by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: doctorStatus
 *         description: update doctor details by id
 *         in: body
 *         default: '{"id":"6082738d32c6042de4930ab9","status":"Away"}'
 *     responses:
 *       200:
 *         description: Update doctor details Successfully
 */

router.put(
    "/updateDoctorsStatusById",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            id = req.body.id;
            var doctorId = await doctorModel.model().find({ _id: id });
            if (doctorId != "") {
                let doctorData = req.body;
                doctorModel.updateDoctorsStatusById(candidate, (err, res1) => {
                    if (err) {
                        res.status(403).json({
                            message: "Doctor not found",
                        });
                    } else {
                        res.status(200).json({
                            message: "Candidate details updated successfully",
                            data: res1,
                        });
                    }
                });
            } else {
                res.status(403).json({
                    message: "Candidate not found",
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
