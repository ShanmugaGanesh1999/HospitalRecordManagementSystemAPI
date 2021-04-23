var express = require("express");
var router = express.Router();
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var medicationModel = require("../model/medicationModel");

/* GET medication listing. */
router.get("/", function (req, res) {
    res.send("respond with a resource");
});

/**
 * @swagger
 * /medication/createMedication:
 *   post:
 *     summary: Create an medication
 *     tags:
 *       - medication
 *     description: Create a medication
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: medicationData
 *         description: Enter the medication data
 *         type: string
 *         in: body
 *         default: '{"appointmentId":"6082738d32c6042de4930ab9","complication":"fever","prescription":"paracetamol 2 (morning and night, after food) x 2 days"}'
 *         schema:
 *           $ref: '#/definitions/createMedication'
 *     responses:
 *       200:
 *         description: Create an medication
 */
/**
 * @swagger
 * definitions:
 *   createMedication:
 *     properties:
 *       appointmentId:
 *         type: string
 *       complication:
 *         type: string
 *       prescription:
 *         type: string
 */
router.post(
    "/createMedication",
    // verifyToken.verifyToken,
    function (req, res) {
        try {
            var details = req.body;
            var data = medicationModel.createMedication(details);
            if (data) {
                res.status(200).json({
                    message: "Medication created successfully",
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
 * /medication/getAllMedications/:
 *   get:
 *     summary: Get details of all the medications
 *     tags:
 *       - medication
 *     description: Get details of all the medications
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
 *         description:  Get details of all the medications
 */

router.get(
    "/getAllMedications",
    // verifyToken.verifyToken,
    function (req, res) {
        medicationModel
            .getAllMedications()
            .then((medication) => {
                if (medication) {
                    res.status(200).json({
                        message:
                            "Successfully fetched details of all medication",
                        count: medication.length,
                        data: medication,
                    });
                } else {
                    res.status(404).json({
                        message: "No medication found",
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
 * /medication/getMedicationById:
 *   get:
 *     summary: Get details of a medication by Id
 *     tags:
 *       - medication
 *     description: Get details of a medication by Id
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
 *         description:  Get details of an medication by Id
 */

router.get(
    "/getMedicationById",
    // verifyToken.verifyToken,
    function (req, res) {
        var id = req.query.id;
        medicationModel
            .getMedicationById(id)
            .then((data) => {
                if (data) {
                    res.status(200).json({
                        message:
                            "Successfully fetched the details of medication id:" +
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

module.exports = router;
