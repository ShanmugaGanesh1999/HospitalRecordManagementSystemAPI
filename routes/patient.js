var express = require("express");
var router = express.Router();

var utils = require("../common/utils");
var patientsModel = require("../model/patientsModel");

/**
 * @swagger
 * /patients/createPatient/:
 *   post:
 *     summary: To create a patient record
 *     tags:
 *       - Patients
 *     description:  To create a patient record
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: patient
 *         description: To create patient
 *         in: body
 *         default: '{"name":"Harsheni","gender":"female","dob":"11-10-1999","emailId":"harsheni@gmail.com","mobileNo":"7871894772"}'
 *         schema:
 *           $ref: '#/definitions/createPatient'
 *     responses:
 *       200:
 *         description: Successfully created patient
 */
/**
 * @swagger
 * definitions:
 *   createPatient:
 *     properties:
 *       name:
 *         type: string
 *       gender:
 *         type: string
 *       dob:
 *         type: Date
 *       emailId:
 *         type: string
 *       mobileNo:
 *         type: number
 */

router.post(
    "/createPatient", // verifyToken.verifyToken,
    async function (req, res, next) {
        try {
            emailId = req.body.emailId;
            var patientEmail = await patientsModel
                .model()
                .find({ emailId: emailId });
            //console.log(req.body);
            let patientData = req.body;
            if (patientEmail == "") {
                patientsModel
                    .createPatient(patientData)
                    .then((data) => {
                        res.status(200).json({
                            message: "Successfully created patient",
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
                    message: "Email already found",
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
 * /patients/getAllPatients/:
 *   get:
 *     summary: Get all patients
 *     tags:
 *       - Patients
 *     description: Get all patients
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
 *         description: Successfully fetched all patients
 */
router.get("/getAllPatients", function (req, res) {
    patientsModel.getAllPatients((err, res1) => {
        try {
            if (res1.length > 0) {
                res.status(200).json({
                    message: "Fetched all patients",
                    data: res1,
                });
            } else {
                res.status(404).json({
                    message: "No patients",
                });
            }
        } catch (error) {
            res.status(404).json({
                error: error,
            });
        }
    });
});

/**
 * @swagger
 * /patients/getPatientsByPatientId:
 *   get:
 *     summary: Get details of a patient by patientId
 *     tags:
 *       - Patients
 *     description: Get details of a patient by patientId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: patientId
 *         description: patientId
 *         type: string
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description:  Get details of an patient
 */
router.get("/getPatientsByPatientId", async function (req, res) {
    try {
        var patientId = req.query.patientId;
        // console.log(patientId);
        var patient = await patientsModel
            .model()
            .find({ patientId: patientId });
        // console.log(patient);
        if (patient != "") {
            // console.log(patient);
            res.status(200).json({
                message: "Fetched details of patient successfully",
                data: patient,
            });
        } else {
            res.status(404).json({
                message: "No such patient",
            });
        }
    } catch (error) {
        res.status(403).json({
            message: error.message,
        });
    }
});

/**
 * @swagger
 * /patients/getPatientsById:
 *   get:
 *     summary: Get details of a patient by Id
 *     tags:
 *       - Patients
 *     description: Get details of a patient by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: patientId
 *         description: patientId
 *         type: string
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description:  Get details of an patient
 */
router.get("/getPatientsById", async function (req, res) {
    try {
        var patientId = req.query.patientId;
        // console.log(patientId);
        var patient = await patientsModel.model().find({ _id: patientId });
        // console.log(patient);
        if (patient != "") {
            // console.log(patient);
            res.status(200).json({
                message: "Fetched details of patient successfully",
                data: patient,
            });
        } else {
            res.status(404).json({
                message: "No such patient",
            });
        }
    } catch (error) {
        res.status(403).json({
            message: error.message,
        });
    }
});

/**
 * @swagger
 * /patients/updatePatientById/:
 *   put:
 *     summary: Update patients by id
 *     tags:
 *       - Patients
 *     description: Update patients details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: patients
 *         description: update patients details
 *         in: body
 *         default: '{"id":"60827c12555b2a3e78d10c88","name":"Harsheni","gender":"female","dob":"11-10-2000","emailId":"harshenic@gmail.com","mobileNo":"7971894772"}'
 *         schema:
 *           $ref: '#/definitions/updatePatient'
 *     responses:
 *       200:
 *         description: Update patients details Successfully
 */

/**
 * @swagger
 * definitions:
 *   updatePatient:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       gender:
 *         type: string
 *       dob:
 *         type: Date
 *       emailId:
 *         type: string
 *       mobileNo:
 *         type: number
 */

router.put("/updatePatientById", async function (req, res) {
    try {
        id = req.body.id;
        var patientId = await patientsModel.model().find({ _id: id });
        if (patientId != "") {
            let patient = req.body;
            patientsModel.updatePatientById(patient, (err, res1) => {
                if (err) {
                    res.status(403).json({
                        message: "Patient not found",
                    });
                } else {
                    res.status(200).json({
                        message: "Patient details updated successfully",
                        data: res1,
                    });
                }
            });
        } else {
            res.status(403).json({
                message: "Patient not found",
            });
        }
    } catch (error) {
        res.status(403).json({
            message: error.message,
        });
    }
});

/**
 * @swagger
 * /patients/deletePatientsById/:
 *   delete:
 *     summary: Delete details of a patient by Id
 *     tags:
 *       - Patients
 *     description: Delete details of a patient by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: patientsId
 *         type: string
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description:  Delete details of an patients by Id
 */
router.delete("/deletePatientsById", async function (req, res) {
    try {
        var patientId = req.query.id;
        patientsModel.deletePatientsById(patientId, function (err, res1) {
            if (res1 != null) {
                res.status(200).json({
                    message: "Deleted the patient successfully",
                    data: res1,
                });
            } else {
                res.status(404).json({
                    message: "No such patient",
                });
            }
        });
    } catch (error) {
        res.status(403).json({
            message: error.message,
        });
    }
});

/**
 * @swagger
 * /patients/getAllPatientsByName/:
 *   get:
 *     summary: Get patients by name
 *     tags:
 *       - Patients
 *     description: Get patients by name
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: skip
 *         description: skip
 *         type: number
 *         required: false
 *         in: query
 *       - name: limit
 *         description: limit
 *         type: number
 *         required: false
 *         in: query
 *       - name: searchText
 *         description: search text
 *         type: string
 *         required: false
 *         in: query
 *     responses:
 *       200:
 *         description: Successfully fetched patients by name
 */
router.get(
    "/getAllPatientsByName",
    //verifyToken.verifyToken,
    function (req, res) {
        var params = {
            skip: req.query.skip ? req.query.skip : "0",
            limit: req.query.limit ? req.query.limit : "0",
        };
        searchText = req.query.searchText ? req.query.searchText : "";
        params["searchText"] = searchText;
        // console.log(params);
        patientsModel.getAllPatientsByName(params, async (err, res1) => {
            try {
                var searchDataCount = res1.length;
                var length = await patientsModel.model().find({});
                if (params.searchText.length != 0)
                    totalLength = searchDataCount;
                else totalLength = length.length;
                // console.log(searchDataCount);
                if (res1.length > 0) {
                    res.status(200).json({
                        message: "Fetched all the details",
                        data: res1,
                        searchDataCount: searchDataCount,
                        totalLength: totalLength,
                    });
                } else {
                    // console.log("1");
                    res.status(404).json({
                        message: "Incorrect Patient name!",
                    });
                }
            } catch (error) {
                res.status(404).json({
                    error: error.message,
                });
            }
        });
    },
);

/**
 * @swagger
 * /patients/getPatientsCountByPatientId:
 *   get:
 *     summary: Get details of a patient by patientId
 *     tags:
 *       - Patients
 *     description: Get details of a patient by patientId
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: patientId
 *         description: patientId
 *         type: formData
 *         in: query
 *         required: true
 *       - name: searchText
 *         description: search text
 *         type: string
 *         required: true
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an patient
 */
router.get("/getPatientsCountByPatientId", async function (req, res) {
    try {
        var patientId = req.query.patientId;
        // console.log(patientId);
        var patCount = patientId.split(",");
        console.log(patCount.length);
        var count = 0;
        for (let i = 0; i < patCount.length; i++) {
            var patient = await patientsModel
                .model()
                .find({ _id: patCount[i] });
            console.log(patCount[1]);

            if (
                patient[i].name
                    .toLowerCase()
                    .includes(req.query.searchText.toLowerCase())
            )
                count += 1;
            // patient.length = 0;
        }
        // console.log(count);
        if (count > 0) {
            // console.log(patient);
            res.status(200).json({
                message: "Patient name exists",
                patCount: count,
            });
        } else {
            res.status(200).json({
                message: "Patient name doesnot exists",
                patCount: count,
            });
        }
    } catch (error) {
        res.status(403).json({
            message: error.message,
        });
    }
});

module.exports = router;
