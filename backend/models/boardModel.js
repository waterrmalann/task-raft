import mongoose from "mongoose";
import List from "./listModel.js";
import Card from "./cardModel.js";

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
        let lists = await List.find({parentBoard: this._id}).select({
            columnId: 1,
            title: 1
        })
        .lean();
        lists = lists.map((list) => {
            return {
              id: list.columnId,
              title: list.title,
            };
        });
        return lists;
    } catch (error) {
        console.error(error);
        return [];
    }
}

boardSchema.methods.fetchCards = async function() {
    try {
        let cards = await Card.find({parentBoard: this._id}).select({
            taskId: 1,
            columnId: 1,
            title: 1,
          })
          .sort('position')
          .lean();
        cards = cards.map((card) => {
            return {
                id: card.taskId,
                columnId: card.columnId,
                content: card.title
            };
        });
        return cards;
    } catch (error) {
        console.error(error);
        return [];
    }
}


const Board = mongoose.model('Board', boardSchema);

export default Board;