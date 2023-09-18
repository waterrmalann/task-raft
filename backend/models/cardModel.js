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
        position: {
            type: Number
        },
        label: {
            type: String,
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

// Define a pre-save middleware to calculate and set the 'position' field
cardSchema.pre('save', async function (next) {
    if (!this.isModified('position') && this.parentBoard && this.columnId) {
        // Check if 'position' is not modified and 'parentBoard' and 'columnId' are set

        // Count the number of cards with the same 'parentBoard' and 'columnId'
        const count = await this.constructor.countDocuments({
            parentBoard: this.parentBoard,
            columnId: this.columnId,
        });

        // Set the 'position' to be the count + 1
        this.position = count;
    }

    next();
});

cardSchema.statics.removeCard = async function (boardId, cardId) {
    const card = await this.findOne({ parentBoard: boardId, taskId: cardId });
    if (!card) {
        return null;
    }

    const removedCard = { ...card.toObject() };

    if (card.parentBoard && card.columnId) {
        // Find all cards with the same 'parentBoard' and 'columnId'
        const cardsToUpdate = await this.find({
            parentBoard: card.parentBoard,
            columnId: card.columnId,
            _id: { $ne: card._id }, // Exclude the removed card
        }).sort('position');

        // Create an array of update operations to set the new positions
        const updateOperations = cardsToUpdate.map((c, index) => ({
            updateOne: {
                filter: { _id: c._id },
                update: { position: index },
            },
        }));

        // Bulk update all cards in a single operation
        await this.bulkWrite(updateOperations);
    }

    // Remove the card
    await card.deleteOne();

    return removedCard;
};

cardSchema.statics.moveCard = async function (boardId, cardId, { columnId, position }) {
    const card = await this.findOne({ parentBoard: boardId, taskId: cardId });
    if (!card) {
        return null;
    }

    console.log({
        boardId,
        cardId,
        columnId,
        position
    });

    const originalColumnId = card.columnId;
    const targetColumnId = columnId;

    // If we are rearranging cards within the same column,
    // We need to recalculate all positions.
    if (originalColumnId === targetColumnId) {
        // Should not be same column, same position.
        if (card.position !== position) {

            const targetCard = await this.findOne({
                parentBoard: card.parentBoard,
                columnId: originalColumnId,
                position: position
            });

            // Swap the positions around.
            targetCard.position = card.position;
            card.position = position;

            await targetCard.save();
        }
    } else {
        // If the card's column is changing, recalculate positions in the target column as well.

        // Find cards of the source column
        const originalColumnCards = await this.find({
            parentBoard: card.parentBoard,
            columnId: originalColumnId,
            _id: { $ne: card._id }, // Exclude the moved card
        }).sort('position');

        // Update the 'position' of each card in the original column.
        const bulkUpdateOriginalColumn = originalColumnCards.map((c, index) => ({
            updateOne: {
                filter: { _id: c._id },
                update: { position: index },
            },
        }));

        await this.bulkWrite(bulkUpdateOriginalColumn);

        // Find all cards in the target column
        const targetColumnCards = await this.find({
            parentBoard: card.parentBoard,
            columnId: targetColumnId,
            position: { $gte: position } // After the source index
        }).sort('position');

        // Update the 'position' of each card in the target column
        const bulkUpdateTargetColumn = targetColumnCards.map((c) => ({
            updateOne: {
                filter: { _id: c._id },
                update: { $inc: { position: 1 } },
            },
        }));

        await this.bulkWrite(bulkUpdateTargetColumn);
    }

    // Update the position and column of the moved card
    card.position = position;
    card.columnId = targetColumnId;

    // Save the moved card
    await card.save();

    return card; // Return the moved card.
};

const Card = mongoose.model('Card', cardSchema);

export default Card;