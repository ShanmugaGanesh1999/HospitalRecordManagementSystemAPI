var express = require("express");
var router = express.Router();
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var appointmentModel = require("../model/appointmentModel");
const dateformat = require("dateformat");

function now() {
    return Date.now();
}

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
                    let elementList = [];
                    appointment.forEach((element) => {
                        element["patientAge"] =
                            dateformat(now(), "yyyy") -
                            element.patientDob.getFullYear();
                        element["doctorExperience"] =
                            dateformat(now(), "yyyy") -
                            element.doctorDOP.getFullYear();
                        elementList.push(element);
                    });
                    res.status(200).json({
                        message: "Appointments found",
                        count: elementList.length,
                        data: elementList,
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
 * /appointment/getAllAppointmentsToday/:
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
 *        - name: status
 *          description: status
 *          type: string
 *          required: false
 *          in: query
 *        - name: search
 *          description: search patient with name
 *          type: string
 *          required: false
 *          in: query
 *        - name: skip
 *          description: skip
 *          type: number
 *          required: true
 *          in: query
 *        - name: limit
 *          description: limit
 *          type: number
 *          required: false
 *          in: query
 *     responses:
 *       200:
 *         description:  Get details of all the appointments
 */

router.get(
    "/getAllAppointmentsToday",
    // verifyToken.verifyToken,
    function (req, res) {
        var params = {
            status: req.query.status,
            search: req.query.search ? req.query.search : "",
            skip: req.query.skip,
            limit: req.query.limit ? req.query.limit : 5,
        };
        appointmentModel
            .getAllAppointments(params)
            .then((appointment) => {
                if (appointment) {
                    let elementList = [];
                    appointment.forEach((element) => {
                        if (
                            dateformat(element.date, "shortDate") ===
                            dateformat(now(), "shortDate")
                        ) {
                            element["patientAge"] =
                                dateformat(now(), "yyyy") -
                                element.patientDob.getFullYear();
                            element["doctorExperience"] =
                                dateformat(now(), "yyyy") -
                                element.doctorDOP.getFullYear();
                            elementList.push(element);
                        }
                    });
                    if (elementList.length > 0) {
                        res.status(200).json({
                            message: "Appointments found",
                            count: elementList.length,
                            data: elementList,
                        });
                    } else {
                        res.status(200).json({
                            message: "No appointments found current date",
                        });
                    }
                } else {
                    res.status(404).json({
                        message: "Can't fetch Appointments",
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
