var mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const ManagementSchema = new Schema({
    id: ObjectId,
    date: {
        type: Date,
        default: Date.now(),
    },
    count: Number,
});

const ManagementModel = mongoose.model("Management", ManagementSchema);

function model() {
    return ManagementModel;
}

function createCount(no) {
    return model().create({ count: no });
}

function getAllCounts(params) {
    var query = {};
    if (params.searchText) {
        query = {
            date: {
                $regex: new RegExp(params.searchText, "i"),
            },
        };
    }
    if (params.no == 0) {
        return new Promise((response, reject) => {
            model()
                .find(query, function (err, data) {
                    if (data) {
                        response(data);
                    } else {
                        reject(err);
                    }
                })
                .skip(parseInt(params.skip))
                .limit(parseInt(params.limit));
        });
    } else if (params.no == 1) {
        return new Promise((response, reject) => {
            model().find(query, function (err, data) {
                if (data) {
                    response(data);
                } else {
                    reject(err);
                }
            });
        });
    }
}

function updateCountByDate(params, callback) {
    let mgtId = mongoose.Types.ObjectId(params.id);
    if (params.state === "1") {
        return model().findOneAndUpdate(
            { _id: mgtId },
            {
                $inc: { count: 1 },
            },
            { new: true },
            (err, res) => {
                callback(err, res);
            },
        );
    } else if (params.state === "0") {
        return model().findOneAndUpdate(
            { _id: mgtId },
            {
                $inc: { count: -1 },
            },
            { new: true },
            (err, res) => {
                callback(err, res);
            },
        );
    }
}

module.exports = {
    model,
    createCount,
    getAllCounts,
    updateCountByDate,
};
