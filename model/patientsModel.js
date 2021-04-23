var mongoose = require("mongoose");
var AutoIncrement = require("mongoose-auto-increment");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
AutoIncrement.initialize(mongoose.connection);

const patientSchema = new Schema({
    id: ObjectId,
    name: String,
    gender: String,
    dob: Date,
    emailId: String,
    mobileNo: Number,
});

patientSchema.plugin(AutoIncrement.plugin, {
    model: "patientSchema",
    field: "patientId",
    startAt: 1000,
    incrementBy: 1,
});

const patientModel = mongoose.model("patient", patientSchema);

function model() {
    return patientModel;
}

function createPatient(params) {
    return new Promise((response) => {
        response(model().create(params));
    });
}

function getAllPatients(callback) {
    model().find({}, (err, res1) => {
        callback(err, res1);
    });
}

function updatePatientById(params, callback) {
    let patientId = mongoose.Types.ObjectId(params.id);
    model().findOneAndUpdate(
        { _id: patientId },
        {
            $set: {
                name: params.name,
                gender: params.gender,
                dob: params.dob,
                emailId: params.emailId,
                mobileNo: params.mobileNo,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function updatepatientStatusById(params, callback) {
    let patientId = mongoose.Types.ObjectId(params.id);
    model().findOneAndUpdate(
        { _id: patientId },
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

function deletePatientsById(params, callback) {
    model().findOneAndDelete({ _id: params }, function (err, patient) {
        callback(err, patient);
    });
}

module.exports = {
    model,
    createPatient,
    getAllPatients,
    updatePatientById,
    deletePatientsById,
};
