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
            .getAllAppointments({
                no: 1,
                status: "",
                search: "",
            })
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
        // console.log(params);
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
            // console.log(doctorData);
            var patientIdArr = [];
            for (let i = 0; i < doctorData.length; i++) {
                if (doctorData[i].status == "Pending")
                    patientIdArr.push(doctorData[i].patientId);
            }
            // console.log(patientIdArr)
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
 * /appointment/getPatientIdByDoctorId1/:
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
    "/getPatientIdByDoctorId1",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            var doctorId = req.query.doctorId;
            // console.log(doctorId);
            var doctorData = await appointmentModel
                .model()
                .find({ doctorId: doctorId });
            // console.log(doctorData);
            var patientIdArr = [];
            for (let i = 0; i < doctorData.length; i++) {
                if (doctorData[i].status == "Finished")
                    patientIdArr.push(doctorData[i].patientId);
            }
            // console.log(patientIdArr)
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
 *          required: true
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
            no: 0,
            status: req.query.status,
            search: req.query.search ? req.query.search : "",
            skip: req.query.skip,
            limit: req.query.limit ? req.query.limit : 5,
        };
        appointmentModel
            .getAllAppointments({
                no: 1,
                status: req.query.status ? req.query.status : "",
                search: req.query.search ? req.query.search : "",
            })
            .then((totData) => {
                appointmentModel
                    .getAllAppointments(params)
                    .then((appointment) => {
                        if (appointment) {
                            let elementList = [],
                                totList = [];
                            totData.forEach((element) => {
                                if (
                                    dateformat(element.date, "shortDate") ===
                                    dateformat(now(), "shortDate")
                                ) {
                                    totList.push(element);
                                }
                            });
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

                            if (elementList.length > 0 && totList.length > 0) {
                                res.status(200).json({
                                    message: "Appointments found",
                                    count: totList.length,
                                    data: elementList,
                                });
                            } else {
                                res.status(200).json({
                                    message:
                                        "No appointments found current date",
                                    count: 0,
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
            })
            .catch((err) => {});
    },
);

/**
 * @swagger
 * /appointment/getAllPendingPatients/:
 *   get:
 *     summary: Get patients by name
 *     tags:
 *       - Appointment
 *     description: Get patients by name
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: doctorId
 *         description: Doctor id
 *         type: string
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
    "/getAllPendingPatients",
    //verifyToken.verifyToken,
    function (req, res) {
        // console.log(req.query.doctorId);
        var params = {
            // skip: req.query.skip ? req.query.skip : "0",
            // limit: req.query.limit ? req.query.limit : "0",
            doctorId: req.query.doctorId,
        };
        searchText = req.query.searchText ? req.query.searchText : "";
        params["searchText"] = searchText;
        // console.log(params);
        appointmentModel.getAllPendingPatients(params, async (err, res1) => {
            try {
                // console.log(res1.length);
                // res.status(200).json({
                //     message: "Fetched all the details",
                //     data: res1,
                // });
                var docArr = [];
                for (let i = 0; i < res1.length; i++) {
                    if (
                        res1[i].doctorId == req.query.doctorId &&
                        res1[i].name
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                    ) {
                        docArr.push(res1[i]);
                    }
                }
                // docArr1 = [];
                // if (params.limit > docArr.length) {
                //     limit = docArr.length;
                // } else {
                //     limit = params.limit;
                // }
                // for (let i = 0; i < limit; i++) {
                //     docArr1.push(docArr[i]);
                // }
                var searchDataCount = docArr.length;
                // console.log(docArr.length);
                var length = await appointmentModel.model().find({});
                totalLength = length.length;
                // console.log(searchDataCount);
                if (docArr.length > 0) {
                    res.status(200).json({
                        message: "Fetched all pending patient details",
                        data: docArr,
                        searchDataCount: searchDataCount,
                        totalLength: totalLength,
                    });
                } else {
                    // console.log("1");
                    res.status(200).json({
                        message: "No patient details found",
                        searchDataCount: 0,
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
 * /appointment/getAllFinishedPatients1/:
 *   get:
 *     summary: Get patients by name
 *     tags:
 *       - Appointment
 *     description: Get patients by name
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: doctorId
 *         description: Doctor id
 *         type: string
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
    "/getAllFinishedPatients",
    //verifyToken.verifyToken,
    function (req, res) {
        // console.log(req.query.doctorId);
        var params = {
            // skip: req.query.skip ? req.query.skip : "0",
            // limit: req.query.limit ? req.query.limit : "0",
            doctorId: req.query.doctorId,
        };
        searchText = req.query.searchText ? req.query.searchText : "";
        params["searchText"] = searchText;
        // console.log(params);
        appointmentModel.getAllFinishedPatients(params, async (err, res1) => {
            try {
                // console.log(res1.length);
                // res.status(200).json({
                //     message: "Fetched all the details",
                //     data: res1,
                // });
                var docArr = [];
                for (let i = 0; i < res1.length; i++) {
                    if (
                        res1[i].doctorId == req.query.doctorId &&
                        res1[i].name
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                    ) {
                        docArr.push(res1[i]);
                    }
                }
                // docArr1 = [];
                // if (params.limit > docArr.length) {
                //     limit = docArr.length;
                // } else {
                //     limit = params.limit;
                // }
                // for (let i = 0; i < limit; i++) {
                //     docArr1.push(docArr[i]);
                // }
                var searchDataCount = docArr.length;
                // console.log(docArr.length);
                var length = await appointmentModel.model().find({});
                totalLength = length.length;
                // console.log(searchDataCount);
                if (docArr.length > 0) {
                    res.status(200).json({
                        message: "Fetched all pending patient details",
                        data: docArr,
                        searchDataCount: searchDataCount,
                        totalLength: totalLength,
                    });
                } else {
                    // console.log("1");
                    res.status(200).json({
                        message: "No patient details found",
                        searchDataCount: 0,
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
 * /appointment/getAppointmentIdByPatientId/:
 *   get:
 *     summary: Get appointment id
 *     tags:
 *       - Appointment
 *     description: Get appointment id
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: patientId
 *         description: Get appointment id
 *         in: query
 *         default: '608aef632b603f472c70d935'
 *         schema:
 *           $ref: '#/definitions/getAppointmentIdByPatientId'
 *     responses:
 *       200:
 *         description: Successfully fetched appointment id
 */
/**
 * @swagger
 * definitions:
 *   getAppointmentIdByPatientId:
 *     properties:
 *       id:
 *         type: string
 *       status:
 *         type: string
 */
router.get(
    "/getAppointmentIdByPatientId",
    // verifyToken.verifyToken,
    function (req, res) {
        try {
            var patientId = req.query.patientId;
            appointmentModel.getAppointmentIdByPatientId(
                patientId,
                function (err, data) {
                    if (data) {
                        res.status(200).json({
                            message: "Fetched appointment id successfully",
                            appointmentId: data,
                        });
                    } else {
                        res.status(404).json({
                            message: err,
                        });
                    }
                },
            );
        } catch (error) {
            res.status(404).json({
                message: error.message,
            });
        }
    },
);

/**
 * @swagger
 * /appointment/getAppointmentsBySpecialization/:
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
 *        - name: data
 *          description: data type
 *          type: string
 *          required: true
 *          in: query
 *     responses:
 *       200:
 *         description:  Get details of all the appointments
 */

router.get(
    "/getAppointmentsBySpecialization",
    // verifyToken.verifyToken,
    function (req, res) {
        appointmentModel
            .getAppointmentsBySpecialization({ data: req.query.data })
            .then((data) => {
                res.status(200).json({
                    message: "Successfully fetched",
                    data: data,
                });
            })
            .catch((err) => {
                res.status(404).json({
                    error: err.message,
                });
            });
    },
);

module.exports = router;
