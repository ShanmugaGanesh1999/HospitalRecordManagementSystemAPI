const { query } = require("express");
var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const doctorSchema = new Schema({
    id: ObjectId,
    doctorName: String,
    emailId: String,
    password: String,
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

function getAllDoctors(params, callback) {
    let query = { __v: 0 };
    if (params.search !== "") {
        query = {
            $and: [
                {
                    doctorName: {
                        $regex: new RegExp(params.search, "i"),
                    },
                },
                { __v: 0 },
            ],
        };
    }
    model()
        .find(query, (err, res) => {
            callback(err, res);
        })
        .skip(parseInt(params.skip))
        .limit(parseInt(params.limit));
}

function updateDoctorStatusById(params, callback) {
    let doctorId = mongoose.Types.ObjectId(params.id);
    return model().findByIdAndUpdate(
        { _id: doctorId },
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

function updateDoctorStatusById(doctorData, callback) {
    let doctorId = mongoose.Types.ObjectId(doctorData.id);
    return model().findOneAndUpdate(
        { _id: doctorId },
        {
            $set: {
                status: doctorData.status,
            },
        },
        { new: true },
        (err, res) => {
            callback(err, res);
        },
    );
}

function resetPwd(email, pwd, callback) {
    model().findOneAndUpdate(
        { emailId: email },
        {
            $set: {
                password: pwd,
            },
        },
        { new: true },
        function (err, res) {
            callback(err, res);
        },
    );
}

module.exports = {
    model,
    createDoctor,
    resetPwd,
    getAllDoctors,
    updateDoctorStatusById,
};
