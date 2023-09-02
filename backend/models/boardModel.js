import mongoose from "mongoose";
import List from "./listModel";
import Card from "./cardModel";

const boardSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        visibility: {
            type: String,
            default: "PRIVATE",
            enum: ["PUBLIC", "PRIVATE"],
            required: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        collaborators: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            active: {
                type: Boolean,
                default: false,
                required: true
            },
            role: {
                type: String,
                default: "EDITOR",
                enum: ["EDITOR", "GUEST"],
                required: true
            }
        }],
        
    },
    {
        timestamps: true,
    }
);

boardSchema.methods.fetchLists = async function() {
    try {
        const lists = await List.find({parentBoard: this._id});
        return lists;
    } catch (error) {
        console.error(error);
        return [];
    }
}

boardSchema.methods.fetchCards = async function() {
    try {
        const cards = await Card.find({parentBoard: this._id});
        return cards;
    } catch (error) {
        console.error(error);
        return [];
    }
}


const Board = mongoose.model('Board', boardSchema);

export default Board;