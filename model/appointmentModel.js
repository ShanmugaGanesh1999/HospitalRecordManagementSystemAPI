var mongoose = require("mongoose");

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
        match = {
            status: params.status,
        },
        aggregate;
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
    return new Promise((response, reject) => {
        model()
            .aggregate(aggregate, (err, data) => {
                if (data) {
                    response(data);
                } else {
                    reject(err);
                }
            })
            .skip(parseInt(params.skip))
            .limit(parseInt(params.limit));
    });
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
    let AppointmentId = mongoose.Types.ObjectId(params.id);
    return model().findByIdAndUpdate(
        { _id: AppointmentId },
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

module.exports = {
    model,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    statusAppointmentById,
    getAppointmentDetailsByPatientId,
};
