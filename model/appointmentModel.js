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

function getAllPendingPatients(params, callback) {
    // console.log(params);
    var doctorId = mongoose.Types.ObjectId(params.doctorId);
    // var match = {
    //     $and: [
    //         { status: "Pending" },
    //         {
    //             "doctor._id": doctorId,
    //         },
    //     ],
    // };
    // if (params.searchText != "") {
    //     var query = {};
    //     if (params.searchText) {
    //         query = {
    //             name: {
    //                 $regex: new RegExp(params.searchText, "i"),
    //             },
    //         };
    //         match = {
    //             $and: [
    //                 { status: "Pending" },
    //                 {
    //                     "doctor._id": doctorId,
    //                 },
    //                 { "patient.name": query.name },
    //             ],
    //         };
    //     }
    //     // console.log(query.name);
    //     var aggregate = [
    //         {
    //             $lookup: {
    //                 from: "doctor",
    //                 localField: "doctorId",
    //                 foreignField: "_id",
    //                 as: "doctor",
    //             },
    //         },
    //         {
    //             $unwind: {
    //                 path: "$doctor",
    //             },
    //         },

    //         {
    //             $lookup: {
    //                 from: "patient",
    //                 localField: "patientId",
    //                 foreignField: "_id",
    //                 as: "patient",
    //             },
    //         },
    //         {
    //             $unwind: {
    //                 path: "$patient",
    //             },
    //         },
    //         {
    //             $match: match,
    //         },
    //         {
    //             $project: {
    //                 patients: "$patient",
    //             },
    //         },
    //     ];
    let query = {},
        match = {
            $and: [
                { status: "Pending" },
                {
                    "doctor._id": doctorId,
                },
            ],
        },
        aggregate;
    if (params.searchText !== "") {
        query = {
            name: {
                $regex: new RegExp(params.searchText, "i"),
            },
        };
        match = {
            $and: [
                { status: "Pending" },
                {
                    "doctor._id": doctorId,
                },
                { "patient.name": query.name },
            ],
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
                patientId: "$pat.patientId",
            },
        },
    ];
    model()
        .aggregate(aggregate, (err, res1) => {
            console.log(res1);
            callback(err, res1);
        })
        .skip(parseInt(params.skip))
        .limit(parseInt(params.limit));
}

module.exports = {
    model,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    statusAppointmentById,
    getAllPendingPatients,
};
