var mongoose = require("mongoose");
const { resolveContent } = require("nodemailer/lib/shared");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const AppointmentSchema = new Schema({
    id: ObjectId,
    patientId: { type: Schema.Types.ObjectId, ref: "patient" },
    doctorId: { type: Schema.Types.ObjectId, ref: "doctor" },
    status: {
        type: String,
        default: "Pending",
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);

function model() {
    return AppointmentModel;
}

function createAppointment(params) {
    return model().create(params);
}

function getAllAppointments(params) {
    let query = {},
        match = {},
        aggregate;

    if (params.status != "") {
        match = {
            status: params.status,
        };
    }
    if (params.search !== "") {
        query = {
            name: {
                $regex: new RegExp(params.search, "i"),
            },
        };
        match = {
            $and: [{ status: params.status }, { "pat.name": query.name }],
        };
    }
    aggregate = [
        {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doc",
            },
        },
        {
            $unwind: {
                path: "$doc",
            },
        },
        {
            $lookup: {
                from: "patients",
                localField: "patientId",
                foreignField: "_id",
                as: "pat",
            },
        },
        {
            $unwind: {
                path: "$pat",
            },
        },
        {
            $match: match,
        },
        { $sort: { date: -1 } },
        {
            $project: {
                _id: 0,
                date: "$date",
                patientId: "$pat.patientId",
                patientName: "$pat.name",
                patientEmailId: "$pat.emailId",
                patientGender: "$pat.gender",
                patientDob: "$pat.dob",
                doctorName: "$doc.doctorName",
                doctorEmailId: "$doc.emailId",
                doctorSpecialization: "$doc.specialization",
                doctorDOP: "$doc.DOP",
            },
        },
    ];
    if (params.no == 0) {
        return new Promise((resolve, reject) => {
            model()
                .aggregate(aggregate, (err, data) => {
                    if (data) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                })
                .skip(parseInt(params.skip))
                .limit(parseInt(params.limit));
        });
    } else if (params.no == 1) {
        return new Promise((resolve, reject) => {
            model().aggregate(aggregate, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}

function getAppointmentById(id) {
    let AppointmentId = mongoose.Types.ObjectId(id);
    return new Promise((response, reject) => {
        model().find({ _id: AppointmentId }, function (err, data) {
            if (data) {
                response(data);
            } else {
                reject(err);
            }
        });
    });
}
function statusAppointmentById(params, callback) {
    let appointmentId = mongoose.Types.ObjectId(params.id);
    return model().findByIdAndUpdate(
        { _id: appointmentId },
        {
            $set: {
                status: params.status,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function getAppointmentDetailsByPatientId(appointmentData, callback) {
    //console.log(appointmentData._id);
    var aggregate = [
        {
            $lookup: {
                from: "medications",
                localField: "_id",
                foreignField: "appointmentId",
                as: "medication",
            },
        },
        {
            $unwind: {
                path: "$medication",
            },
        },
        {
            $match: {
                "medication.appointmentId": appointmentData._id,
            },
        },
        {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doctor",
            },
        },
        {
            $unwind: {
                path: "$doctor",
            },
        },
        {
            $match: {
                "doctor._id": appointmentData.doctorId,
            },
        },
        {
            $project: {
                _id: 0,
                date: appointmentData.date,
                status: appointmentData.status,
                complication: "$medication.complication",
                prescription: "$medication.prescription",
                doctorName: "$doctor.doctorName",
                specialization: "$doctor.specialization",
            },
        },
    ];
    model().aggregate(aggregate, (err, res2) => {
        callback(err, res2);
    });
}

function getAllPendingPatients(params, callback) {
    // console.log(params);
    var aggregate = [
        {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doc",
            },
        },
        {
            $unwind: {
                path: "$doc",
            },
        },

        {
            $lookup: {
                from: "patients",
                localField: "patientId",
                foreignField: "_id",
                as: "pat",
            },
        },
        {
            $unwind: {
                path: "$pat",
            },
        },
        {
            $match: {
                status: "Pending",
            },
        },
        {
            $project: {
                status: "$status",
                name: "$pat.name",
                emailId: "$pat.emailId",
                mobileNo: "$pat.mobileNo",
                gender: "$pat.gender",
                dob: "$pat.dob",
                patientId: "$pat.patientId",
                doctorId: "$doc._id",
            },
        },
    ];
    model().aggregate(aggregate, (err, res2) => {
        // console.log(res2);
        callback(err, res2);
    });
}

function getAllFinishedPatients(params, callback) {
    // console.log(params);
    var aggregate = [
        {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doc",
            },
        },
        {
            $unwind: {
                path: "$doc",
            },
        },

        {
            $lookup: {
                from: "patients",
                localField: "patientId",
                foreignField: "_id",
                as: "pat",
            },
        },
        {
            $unwind: {
                path: "$pat",
            },
        },
        {
            $match: {
                status: "Finished",
            },
        },
        {
            $project: {
                status: "$status",
                name: "$pat.name",
                emailId: "$pat.emailId",
                mobileNo: "$pat.mobileNo",
                gender: "$pat.gender",
                dob: "$pat.dob",
                patientId: "$pat.patientId",
                doctorId: "$doc._id",
            },
        },
    ];
    model().aggregate(aggregate, (err, res2) => {
        // console.log(res2);
        callback(err, res2);
    });
}

function getAppointmentIdByPatientId(patientId, callback) {
    // console.log(params);
    let patId = mongoose.Types.ObjectId(patientId);
    var aggregate = [
        {
            $lookup: {
                from: "patients",
                localField: "patientId",
                foreignField: "_id",
                as: "pat",
            },
        },
        {
            $unwind: {
                path: "$pat",
            },
        },
        {
            $match: { "pat._id": patId },
        },
        {
            $project: { _id: 1 },
        },
    ];
    model().aggregate(aggregate, (err, res2) => {
        // console.log(res2);
        callback(err, res2);
    });
}

function getAppointmentsBySpecialization(params) {
    let aggregate,
        lookup = {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doc",
            },
        },
        unwind = {
            $unwind: {
                path: "$doc",
            },
        };
    if (params.data == "single") {
        aggregate = [
            lookup,
            unwind,
            {
                $group: {
                    _id: "$doc.specialization",
                    name: { $first: "$doc.specialization" },
                    value: { $sum: 1 },
                },
            },
        ];
    } else if (params.data == "multi") {
        aggregate = [
            lookup,
            unwind,
            {
                $group: {
                    _id: {
                        specialization: "$doc.specialization",
                        date: "$date",
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.specialization",
                    name: { $first: "$_id.specialization" },
                    series: {
                        $push: {
                            name: { $month: "$_id.date" },
                            value: "$count",
                        },
                    },
                },
            },
        ];
    }
    return new Promise((resolve, reject) => {
        model().aggregate(aggregate, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

module.exports = {
    model,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    getAppointmentsBySpecialization,
    statusAppointmentById,
    getAppointmentDetailsByPatientId,
    getAllPendingPatients,
    getAppointmentIdByPatientId,
    getAllFinishedPatients,
};
