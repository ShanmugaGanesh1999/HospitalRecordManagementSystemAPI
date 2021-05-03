var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const MedicationSchema = new Schema({
    id: ObjectId,
    appointmentId: { type: Schema.Types.ObjectId, ref: "appointment" },
    complication: String,
    prescription: String,
});

const MedicationModel = mongoose.model("Medication", MedicationSchema);

function model() {
    return MedicationModel;
}

function createMedication(params) {
    return new Promise((response, reject) => {
        response(model().create(params));
    });
}

function getAllMedications() {
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

function getMedicationById(id) {
    let MedicationId = mongoose.Types.ObjectId(id);
    return new Promise((response, reject) => {
        model().find({ _id: MedicationId }, function (err, data) {
            if (data) {
                response(data);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = {
    model,
    createMedication,
    getAllMedications,
    getMedicationById,
};
