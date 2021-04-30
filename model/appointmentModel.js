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

function getAllAppointments() {
    return new Promise((response, reject) => {
        model().find({}, function (err, data) {
            if (data) {
                response(data);
            } else {
                reject(err);
            }
        });
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
