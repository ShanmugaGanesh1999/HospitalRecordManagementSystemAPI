var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const ManagementSchema = new Schema({
    id: ObjectId,
    date: {
        type: Date,
        default: Date.now(),
    },
    count: {
        type: Number,
        default: 0,
    },
});

const ManagementModel = mongoose.model("Management", ManagementSchema);

function model() {
    return ManagementModel;
}

function createCount() {
    return model().create();
}

function getAllCounts() {
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

function getCountByDate(date) {
    let curDate = mongoose.Types.Date(date);
    return new Promise((response, reject) => {
        model().find({ date: curDate }, function (err, data) {
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
    createCount,
    getAllCounts,
    getCountByDate,
};
