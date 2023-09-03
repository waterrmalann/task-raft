import mongoose from "mongoose";

const cardSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        taskId: {
            type: String,
            required: true
        },
        columnId: {
            type: String,
            required: true
        },
        parentBoard: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true
        },
        // checklist: [{
        //     title: {
        //         type: String,
        //         required: true
        //     },
        //     completed: {
        //         type: Boolean,
        //         default: false,
        //         required: true
        //     },
        //     completedBy: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         required: true,
        //         ref: "User"
        //     },
        //     completedOn: {
        //         type: Date
        //     }
        // }],
        // assignees: [{
        //     type: Schema.Types.ObjectId
        // }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

const Card = mongoose.model('Card', cardSchema);

export default Card;