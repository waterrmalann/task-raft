import mongoose from "mongoose";

const listSchema = mongoose.Schema(
    {
        columnId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        parentBoard: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        position: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

const List = mongoose.model('List', listSchema);

export default List;