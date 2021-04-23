var express = require("express");
var router = express.Router();
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var appointmentModel = require("../model/appointmentModel");

/* GET appointment listing. */
router.get("/", function (req, res) {
    res.send("respond with a resource");
});

/**
 * @swagger
 * /appointment/createAppointment:
 *   post:
 *     summary: Create an appointment
 *     tags:
 *       - appointment
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
 *         description: Enter the appointment data
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
 *       - appointment
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
                        message: "No appointment found",
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
 *     summary: Get details of a appointment by Id
 *     tags:
 *       - appointment
 *     description: Get details of a appointment by Id
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
 *         description:  Get details of an appointment by Id
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
                            " Successfully fetched details of appointment id:" +
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
 *     summary: Update appointment details
 *     tags:
 *       - appointment
 *     description: Update appointment details
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: id
 *         description: Id to be updated
 *         in: query
 *         default: '602510453df858098c0ac1a9'
 *       - name: status
 *         description: Status
 *         in: query
 *         default: 'Finished'
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
 *       _id:
 *         type: string
 *       status:
 *         type: string
 */

router.put(
    "/statusAppointmentById",
    // verifyToken.verifyToken,
    function (req, res) {
        var id = req.query.id,
            state = req.query.status;
        appointmentModel.statusAppointmentById(id, state, function (err, data) {
            if (data) {
                res.status(200).json({
                    message: "Updated status of appointment id:" + id,
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
