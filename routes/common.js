var express = require("express");
var router = express.Router();
var verifyToken = require("../common/verifyToken");
var doctorModel = require("../model/doctorModel");
var randomstring = require("randomstring");
var nodemailer = require("nodemailer");

/* GET Management listing. */
router.get("/", function (req, res) {
    res.send("respond with a resource");
});

let otpArr = [];

function randomAlnum(len) {
    return randomstring.generate({
        length: len,
        charset: "alphanumeric",
    });
}

/**
 * @swagger
 * /common/createDoctorAndPwdMail/:
 *   post:
 *     summary: To create doctor details
 *     tags:
 *       - Common
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
 *         default: '{"doctorName":"Harsha","emailId":"harshenic@gmail.com","password":"harsha11","mobileNo":"7871894772","specialization":"Anesthesiology","DOP":"01.01.2001"}'
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
 *       password:
 *         type: string
 *       mobileNo:
 *         type: number
 *       specialization:
 *         type: string
 *       DOP:
 *         type: date
 */
router.post(
    "/createDoctorAndPwdMail",
    // verifyToken.verifyToken,
    async function (req, res) {
        try {
            var doctorEmail = await doctorModel
                .model()
                .find({ emailId: req.body.emailId });
            if (doctorEmail.length === 0) {
                let dummyPassword = randomAlnum(12),
                    doctorData = req.body;
                doctorData.status = "Away";
                doctorData.password = dummyPassword;
                let transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "shanmuga.automail@gmail.com",
                        pass: "cnCx-Zr2XbF3!m!",
                    },
                });
                var fillData = `
            <div
            style="
                color: #1d1717;
                text-align: justify;
                font-size: larger;
                font-weight: 750;
                line-height: 1.5;
                font-family: Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
                margin-top: 7%;
                padding: 2%;
            "
        >
            <header
                style="
                    padding: 1%;
                    position: fixed;
                    left: 0;
                    top: 0;
                    width: 100%;
                    background-color: rgb(255, 217, 0);
                    color: rgb(255, 0, 0);
                    text-align: center;
                    font-family: Verdana, Geneva, Tahoma, sans-serif;
                    font-size: larger;
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
                        0 9px 26px 0 rgba(0, 0, 0, 0.19);
                "
            >
                Welcome to our hospital mail letter
            </header>
            <h1>Congrates Doctor for joining our Hospital,</h1>
            <br />
            <h2>
                <i
                    >Dearest doctor, you are always out there fighting a battle
                    for someone’s life. We salute you and our hospital will
                    always be with you.</i
                >
            </h2>
            <br />
            <div>
                <span style="color: rgb(250, 68, 2)"
                    ><strong>
                        Check your details, if it's not correct to our knowledge
                        please report to management</strong
                    ></span
                ><br />
                <span style="font: 1em sans-serif"
                    ><strong>Name</strong>:
                    <i style="color: rgb(70, 155, 155)">${
                        doctorData.doctorName
                    }</i>
                    &nbsp; ...(Permanent)</span
                ><br />
                <span style="font: 1em sans-serif"
                    ><strong>Mobile Number</strong>:
                    <i style="color: rgb(88, 133, 216)"
                        >${doctorData.mobileNo}</i
                    >
                    &nbsp; ...(Permanent)</span
                ><br />
                <span style="font: 1em sans-serif"
                    ><strong>Specialization</strong>:
                    <i style="color: rgb(160, 172, 60)"
                        >${doctorData.specialization}</i
                    >
                    &nbsp; ...(Permanent)</span
                ><br />
                <span style="font: 1em sans-serif"
                    ><strong>Date of practice</strong>:
                    <i style="color: forestgreen">${
                        doctorData.DOP.split("T")[0]
                    }</i>
                    &nbsp; ...(Permanent)</span
                >
            </div>
            <br />
            <p>
                <i>for login please visit out site: &nbsp;</i
                ><strong
                    ><a
                        style="
                            font-size: x-large;
                            text-decoration: none;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana,
                                sans-serif;
                        "
                        href="http://hospital.free/login"
                        >Hospital</a
                    ></strong
                >
            </p>
            <br />
            <span
                ><strong
                    >Your Username:
                    <i style="color: rgb(136, 38, 228)"
                        >${doctorData.emailId}</i></strong>
                    &nbsp; ...(Permanent)
                <br />
                <strong
                    >Your Password:
                    <i style="color: rgb(248, 14, 139)">${dummyPassword}</i></strong>
                    &nbsp; ...(temp)<br />
                <p style="font-size: 1rem">
                    Please change your password after initial login
                </p>
            </span>
            <br /><br />

            <p
                style="
                    color: rgb(255, 1, 1);
                    background-color: rgb(247, 247, 8);
                    width: 100%;
                "
            >
                This is a <i>Auto Generated Mail</i> ,please
                <strong>Do not reply</strong> !
            </p>
            <hr />
            <br /><br />
            <br /><br />
            <br /><br />
            <br /><br />
            <footer
                style="
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    background-color: gray;
                    color: rgb(7, 7, 7);
                    text-align: left;
                    font-size: large;
                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2),
                        0 9px 26px 0 rgba(0, 0, 0, 0.19);
                "
            >
                &nbsp;
                <a
                    style="text-decoration: none; margin-left: 40px"
                    href="http://hospital.free/about"
                    >Hospital</a
                >&nbsp; &copy; 2021-2022
                <i style="display: flex; float: right; margin-right: 40px"
                    >Contact us through &nbsp;
                    <a href="mailto:shanmuga.automail@gmailcom"
                        >shanmuga.automail@gmailcom</a
                    ></i
                >
            </footer>
        </div>
            `;
                let mailOptions = {
                    from: "shanmuga.automail@gmail.com",
                    to: `${doctorData.emailId}`,
                    subject:
                        "Hospital Management: Doctor Account and his/her temp password",
                    html: fillData,
                };
                doctorModel
                    .createDoctor(doctorData)
                    .then((data) => {
                        transporter.sendMail(mailOptions, (err1, res1) => {
                            if (err1) {
                                res.status(404).json({
                                    message: `Mail failed`,
                                });
                            } else if (res1) {
                                res.status(200).json({
                                    message: `Successfully doctor created`,
                                    data: data,
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        res.status(404).json({
                            message: error,
                        });
                    });
            } else {
                res.status(404).json({
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
 * /common/sendPrescriptionByPatientId/:
 *   post:
 *     summary: Send presciption mail
 *     tags:
 *       - Common
 *     description: Send presciption mail
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: false
 *         in: header
 *       - name: patientId
 *         description: Send presciption mail
 *         in: query
 *         default: {'id':'608aef632b603f472c70d935',name:'Harsheni','patientId':'1001','emailId':'harshenic@gmail.com'}
 *         schema:
 *           $ref: '#/definitions/sendPrescriptionByPatientId'
 *     responses:
 *       200:
 *         description: Successfully send presciption mail
 */
/**
 * @swagger
 * definitions:
 *   sendPrescriptionByPatientId:
 *     properties:
 *       patientId:
 *         type: string
 *       name:
 *         type: string
 *       emailId:
 *         type: string
 */
router.post(
    "/sendPrescriptionByPatientId",
    // verifyToken.verifyToken,
    function (req, res) {
        var patientData = req.body;
        // console.log(candidatesData);
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "harshenic@gmail.com",
                pass: "harsheni11K#",
            },
        });
        var fillData =
            "Dear " +
            patientData.name +
            "," +
            "<br><br>Congratulations! You have been invited to attend an interview round of AugustaHiTech Campus Recruitment Program 2020-21.<br><br> Below are the details for your interview with us:<br><br>Date : " +
            candidatesData.date +
            "<br><br>Time :" +
            candidatesData.time +
            "<br><br>Duration: 1 hour<br><br>Interview google meet link: https://meet.google.com/" +
            candidatesData.meetLink +
            '<br><br><br>In case of any query, please free to reach us at <a href="mailto:harshenic@gmail.com">harshenic@gmail.com</a>' +
            "<br><br><br>Best Regards,<br><br>AugustaHiTech Pvt Ltd" +
            `<br><br><p  style="font-weight: 400;font-size: 16px;line-height: 1.25;font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:red;background-color:yellow;width:38%">This is an auto-generated mail, please do not reply!</p>`;
        var mailOptions = {
            from: "harshenic@gmail.com",
            to: candidatesData.emailId,
            subject:
                "Recruitment System: Your interview with AugustaHiTech has been schedulded",
            html: fillData,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error.message);
            } else {
                // console.log("Email sent: " + info.response);
                res.json({
                    message: "Email sent successfully",
                });
            }
        });
    },
);
module.exports = router;
