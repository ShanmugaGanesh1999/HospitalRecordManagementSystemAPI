var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const doctorSchema = new Schema({
    id: ObjectId,
    doctorName: String,
    emailId: String,
    mobileNo: Number,
    specialization: String,
    DOP: Date,
    status: String,
});

const createModel = mongoose.model("doctor", doctorSchema);

function model() {
    return createModel;
}

function createDoctor(params) {
    return new Promise((response) => {
        response(model().create(params));
    });
}

function getAllDoctors(callback) {
    model().find({}, (err, res1) => {
        callback(err, res1);
    });
}

function updateDoctorStatusById(id, state, callback) {
    let doctorId = mongoose.Types.ObjectId(id);
    return model().findByIdAndUpdate(
        { _id: doctorId },
        {
            $set: {
                status: state,
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
    createDoctor,
    getAllDoctors,
    updateDoctorStatusById,
};
