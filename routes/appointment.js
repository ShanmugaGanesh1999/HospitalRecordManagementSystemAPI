var express = require("express");
var router = express.Router();
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var appointmentModel = require("../model/appointmentModel");

/* GET Appointment listing. */
router.get("/", function (req, res) {
    res.send("respond with a resource");
});

/**
 * @swagger
 * /appointment/createAppointment:
 *   post:
 *     summary: Create an appointment
 *     tags:
 *       - Appointment
 *     description: Create a appointment
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: appointmentData
 *         description: Enter the Appointment data
 *         type: string
 *         in: body
 *         default: '{"patientId":"6082738d32c6042de4930ab9","doctorId":"6082738d32c6042de4930ab9"}'
 *         schema:
 *           $ref: '#/definitions/createAppointment'
 *     responses:
 *       200:
 *         description: Create an appointment
 */
/**
 * @swagger
 * definitions:
 *   createAppointment:
 *     properties:
 *       patientId:
 *         type: string
 *       doctorId:
 *         type: string
 */
router.post(
    "/createAppointment",
    // verifyToken.verifyToken,
    function (req, res) {
        try {
            var details = req.body;
            var data = appointmentModel.createAppointment(details);
            if (data) {
                res.status(200).json({
                    message: "Appointment created successfully",
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
 * /appointment/getAllAppointments/:
 *   get:
 *     summary: Get details of all the appointments
 *     tags:
 *       - Appointment
 *     description: Get details of all the appointments
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
 *         description:  Get details of all the appointments
 */

router.get(
    "/getAllAppointments",
    // verifyToken.verifyToken,
    function (req, res) {
        appointmentModel
            .getAllAppointments()
            .then((appointment) => {
                if (appointment) {
                    res.status(200).json({
                        message:
                            "Fetched details of all appointments successfully",
                        count: appointment.length,
                        data: appointment,
                    });
                } else {
                    res.status(404).json({
                        message: "No Appointment found",
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
 * /appointment/getAppointmentById:
 *   get:
 *     summary: Get details of a Appointment by Id
 *     tags:
 *       - Appointment
 *     description: Get details of a Appointment by Id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: id
 *         description: id
 *         type: string
 *         in: query
 *     responses:
 *       200:
 *         description:  Get details of an Appointment by Id
 */

router.get(
    "/getAppointmentById",
    // verifyToken.verifyToken,
    function (req, res) {
        var id = req.query.id;
        appointmentModel
            .getAppointmentById(id)
            .then((data) => {
                if (data) {
                    res.status(200).json({
                        message:
                            " Successfully fetched details of Appointment id:" +
                            id,
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
 * /appointment/statusAppointmentById/:
 *   put:
 *     summary: Update Appointment details
 *     tags:
 *       - Appointment
 *     description: Update Appointment details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: body
 *         description: Id to be updated
 *         in: query
 *         default: '{"id":"602510453df858098c0ac1a9","status":"Finished"}'
 *         schema:
 *           $ref: '#/definitions/update'
 *     responses:
 *       200:
 *         description: Successfully completed
 */
/**
 * @swagger
 * definitions:
 *   update:
 *     properties:
 *       id:
 *         type: string
 *       status:
 *         type: string
 */
router.put(
    "/statusAppointmentById",
    // verifyToken.verifyToken,
    function (req, res) {
        var params = req.body;
        appointmentModel.statusAppointmentById(params, function (err, data) {
            if (data) {
                res.status(200).json({
                    message: "Updated status of Appointment id:" + params.id,
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

/**
 * @swagger
 * /appointment/getPatientIdByDoctorId/:
 *   get:
 *     summary: Get patient id by doctor id
 *     tags:
 *       - Appointment
 *     description: Get patient id by doctor id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: doctorId
 *         description: Get patient id by doctor id
 *         type: string
 *         in: query
 *         default: "6082b7b4f57e811f50e00ff4"
 *         required: true
 *     responses:
 *       200:
 *         description: Get patient id by doctor id
 */
router.get(
    "/getPatientIdByDoctorId",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            var doctorId = req.query.doctorId;
            // console.log(doctorId);
            var doctorData = await appointmentModel
                .model()
                .find({ doctorId: doctorId });
            // console.log(doctorData.length);
            var patientIdArr = [];
            for (let i = 0; i < doctorData.length; i++) {
                patientIdArr.push(doctorData[i].patientId);
            }
            if (doctorData.length > 0) {
                res.status(200).json({
                    message: "Fetched patient id successfully",
                    patientId: patientIdArr,
                    patientCount: patientIdArr.length,
                });
            } else {
                res.status(200).json({
                    message: "No patient assigned",
                    patientCount: 0,
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
 * /appointment/getAppointmentDetailsByPatientId/:
 *   get:
 *     summary: Get appointment details by patient id
 *     tags:
 *       - Appointment
 *     description: Get appointment details by patient id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: patientObjectId
 *         description: Get appointment details by patient id
 *         type: string
 *         in: query
 *         default: "6082b7b4f57e811f50e00ff4"
 *         required: true
 *     responses:
 *       200:
 *         description: Get appointment details by patient id
 */
router.get(
    "/getAppointmentDetailsByPatientId",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            var patientId = req.query.patientObjectId;
            var appointmentData = await appointmentModel
                .model()
                .find({ patientId: patientId });
            appointmentData = appointmentData[0];
            if (appointmentData != "") {
                appointmentModel.getAppointmentDetailsByPatientId(
                    appointmentData,
                    function (err, data) {
                        if (data) {
                            res.status(200).json({
                                message:
                                    "Fetched all appointment details of the patient",
                                data: data,
                            });
                            //console.log(data);
                        } else {
                            res.status(404).json({
                                message: err,
                            });
                        }
                    },
                );
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
    },
);

module.exports = router;
