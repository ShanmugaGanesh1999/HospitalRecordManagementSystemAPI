var express = require("express");
var router = express.Router();
var utils = require("../common/utils");
var verifyToken = require("../common/verifyToken");
var doctorModel = require("../model/doctorModel");
var blacklistModel = require("../model/blacklistModel");
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
 * /common/commonLogin:
 *   post:
 *     summary: common Login
 *     tags:
 *       - Common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: enter the login data
 *         type: string
 *         in: body
 *         default: '{"emailId":"admin@hospital.com","password":"Admin"}'
 *         schema:
 *           $ref: '#/definitions/exampleLogin'
 *     responses:
 *       200:
 *         description: login to perform operations
 */
/**
 * @swagger
 * definitions:
 *   exampleLogin:
 *     properties:
 *       emailId:
 *         type: string
 *       password:
 *         type: string
 */

router.post("/commonLogin", async function (req, res) {
    let email = req.body.emailId;
    let password = req.body.password;
    let data, local;
    data = await doctorModel
        .model()
        .findOne({ emailId: email, password: password });
    if (data && email === "admin@hospital.com") {
        local = "Management";
    } else if (data && email === "reception@hospital.com") {
        local = "Reception";
    } else if (data) {
        local = "Doctor";
    }
    if (data) {
        var token = utils.generateJwtToken({
            email: email,
            password: req.body.password,
        });
        res.status(200).send({
            message: `Login as, ${email}`,
            path: local,
            token: token,
        });
    } else {
        res.status(404).send({
            message: `Unable to find login credentials`,
        });
    }
});

/**
 * @swagger
 * /common/emailOtp:
 *   post:
 *     summary: common email otp
 *     tags:
 *       - Common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: emailId
 *         description: enter the login data
 *         type: string
 *         in: query
 *         default: 'ramkumar@gmail.com'
 *     responses:
 *       200:
 *         description: login to perform operations
 */
router.post("/emailOtp", async function (req, res) {
    try {
        let emailId = req.query.emailId;
        if (emailId != undefined) {
            let data = await doctorModel.model().findOne({ emailId: emailId });
            if (data !== null) {
                var otp6 = randomAlnum(6);
                otpArr.push(otp6);
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
            <h1>Hello Doctor,</h1>
            <br />
            <h2>
                <i
                    >This is our official mail for *Reseting your account password*.</i
                >
            </h2>
            <br />
            <div>
                <span style="color: rgb(250, 68, 2)"
                    >Please <strong>Do not share
                        </strong
                    > this with anyone <strong>including us</strong> and know one from our management will ask for this.</span
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
                        >${emailId}</i></strong>
                    &nbsp; ...(Permanent)
                <br />
                <strong
                    >Your OTP for Password Reset:
                    <i style="color: rgb(248, 14, 139)">${otp6}</i></strong>
                    &nbsp; ...(temp)<br />
                <p style="font-size: 1rem">
                    Dear, please be relaxed everything is under control :)
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
                    to: `${emailId}`,
                    subject:
                        "Hospital Management: Email Account OTP verification",
                    html: fillData,
                };
                transporter.sendMail(mailOptions, (err2, res2) => {
                    if (err2) {
                        res.status(404).json({
                            message: `OTP failed maybe that's not a valid mailId:${emailId}`,
                        });
                    } else {
                        res.status(200).json({
                            message: `OTP mailed to ${emailId}`,
                            data: res2,
                        });
                    }
                });
            } else {
                res.status(403).json({
                    message: `Your are not elegible to perform this operation`,
                });
            }
        } else {
            res.status(404).json({
                message: `enter email`,
            });
        }
    } catch (error) {
        res.status(404).json({
            message: `OTP failed`,
        });
    }
});

/**
 * @swagger
 * /common/verifyOtp:
 *   post:
 *     summary: common email otp
 *     tags:
 *       - Common
 *     description: login by email and password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: otp
 *         description: enter the login data
 *         type: string
 *         in: query
 *     responses:
 *       200:
 *         description: login to perform operations
 */
router.post("/verifyOtp", async function (req, res) {
    try {
        let otp = req.query.otp;
        let popOTP = otpArr.pop();
        if (otp != undefined && popOTP != undefined) {
            if (otp == popOTP) {
                res.status(200).json({
                    message: `OTP matched :)`,
                    verification: 1,
                });
            } else {
                res.status(404).json({
                    message: `OTP Not matched :(`,
                    verification: 0,
                });
            }
        } else {
            res.status(404).json({
                message: `not an email`,
            });
        }
    } catch (error) {
        res.status(404).json({
            message: `OTP failed`,
        });
    }
});

/**
 * @swagger
 * /common/logout:
 *   post:
 *     summary: common logout
 *     tags:
 *       - Common
 *     description: common logout
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: send valid token
 *         type: string
 *         required: true
 *         in: header
 *     responses:
 *       200:
 *         description: interviewer logout
 */

router.post(
    "/logout",
    verifyToken.verifyToken,
    async function (req, res, next) {
        var accessToken = req.headers["x-access-token"];
        blacklistModel.saveAccessToken(accessToken, function (err, result) {
            if (result) {
                res.status(200).send({
                    message: "Logged out successfully",
                    data: result,
                });
            } else {
                res.status(404).send({
                    message: "Unable to logout",
                    data: err,
                });
            }
        });
    },
);

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

module.exports = router;
