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
function cancelAppiontmentById(id, callback) {
    let AppointmentId = mongoose.Types.ObjectId(id);
    return model().findByIdAndUpdate(
        { _id: AppointmentId },
        {
            $set: {
                status: "Cancelled",
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

module.exports = {
    model,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    cancelAppiontmentById,
};
