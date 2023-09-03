import asyncHandler from "express-async-handler";
import Board from "../models/boardModel.js";
import List from "../models/listModel.js";
import Card from "../models/cardModel.js";
import User from "../models/userModel.js";
import { generateVerificationCode } from "../utils/utils.js";
import { getInviteLink, sendBoardInvite } from "../utils/mailer.js";


// @desc    Creates a board with the given information.
// route    POST /api/boards/
// @access  Private
const createBoard = asyncHandler(async (req, res) => {
    const {title, description, visibility} = req.body;
    // title, description, visibility, createdBy, collaborators(user, active, role)
    const board = await Board.create({title, description, visibility, createdBy: req.user._id });
    res.status(201).json({success: true, message: "Successfully created board.", boardId: board._id});
});

// @desc    Updates information about a board.
// route    PATCH /api/boards/:boardId
// @access  Private
const editBoard = asyncHandler(async (req, res) => {
    const {title, description, visibility} = req.body;
    const {boardId} = req.params;
    // title, description, visibility, createdBy, collaborators(user, active, role)
    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }

    board.title = title || board.title;
    board.description = description || board.description;
    board.visibility = visibility || board.visibility;

    await board.save();

    res.status(200).json({success: true, message: "Successfully edited board."});
});

// @desc    Deletes a board.
// route    DELETE /api/boards/:boardId
// @access  Private
const deleteBoard = asyncHandler(async (req, res) => {
    const {boardId} = req.params;
    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }
    await board.deleteOne();

    res.status(200).json({success: true, message: "Successfully edited board."});
});

// @desc    Retrieves information on a board.
// route    GET /api/boards/:boardId
// @access  Private
const getBoard = asyncHandler(async (req, res) => {
    const {boardId} = req.params;
    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }

    const cards = await board.fetchCards();
    const lists = await board.fetchLists();

    const boardData = {
        board: board.toObject(),
        columns: lists,
        tasks: cards
    }
    console.log(boardData);

    res.status(200).json({success: true, data: boardData});
});

// @desc    Generate an invitation link for collaboration.
// route    POST /api/boards/:boardId/collaborators
// @access  Private
const inviteCollaborator = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { userId, role } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    const link = getInviteLink(board._id);
    board.collaborators.push({
        user: userId,
        active: false,
        role 
    });
    
    await board.save();
    sendBoardInvite(user.email, board.title, link);
    
    res.status(200).json({ success: true,  message: "User has been invited to collaborate." });
});

// @desc    Accept an invitation link for collaboration.
// route    GET /api/boards/:boardId/collaborators
// @access  Private
const verifyCollaborator = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }
    
    if (!board?.collaborators) {
        res.status(404);
        throw new Error("This board is not accepting collaborators.");
    }

    const collaboratorIndex = board.collaborators.findIndex(c => c.user === req.user._id);
    if (!board.collaborators[collaboratorIndex]) {
        res.status(404);
        throw new Error("User is not invited for collaboration.");
    }

    board.collaborators[collaboratorIndex].active = true;
    await board.save();
    
    res.status(200).json({ success: true,  message: "Collaboration invite accepted." });
});

// @desc    Remove a collaborator from the board.
// route    DELETE /api/boards/:boardId/collaborators/:collaboratorId
// @access  Private
const removeCollaborator = asyncHandler(async (req, res) => {
    const { boardId, collaboratorId } = req.params;
    const board = await Board.findById(boardId);
    
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }
    
    const collaboratorIndex = board.collaborators.findIndex(c => c._id === collaboratorId);
    
    if (collaboratorIndex === -1) {
        res.status(404);
        throw new Error("Collaborator not found.");
    }
    
    board.collaborators.splice(collaboratorIndex, 1);
    
    await board.save();
    
    res.status(200).json({ success: true, message: "Collaborator removed successfully." });
});

// @desc    Edit a collaborator's status.
// route    PATCH /api/boards/:boardId/collaborators/:collaboratorId
// @access  Private
const editCollaborator = asyncHandler(async (req, res) => {
    const { boardId, collaboratorId } = req.params;
    const { role } = req.body;
    const board = await Board.findById(boardId);
    
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }
    
    const collaborator = board.collaborators.find(c => c._id === collaboratorId);
    
    if (!collaborator) {
        res.status(404);
        throw new Error("Collaborator not found.");
    }

    collaborator.role = role;
    
    await board.save();
    
    res.status(200).json({ success: true, data: collaborator, message: "Collaborator role updated successfully." });
});

// @desc    Adds a new list.
// route    POST /api/boards/:boardId/lists
// @access  Private
const addList = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { columnId, title } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }

    const list = await List.create({
        columnId, title, listOrder: 0,
        parentBoard: boardId,
        createdBy: req.user._id
    });
    
    res.status(201).json({ success: true, data: list, message: "List was created." });
});

// @desc    Edits an existing list.
// route    PATCH /api/boards/:boardId/lists/:listId
// @access  Private
const editList = asyncHandler(async (req, res) => {
    const { boardId, listId } = req.params;
    const { title } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }

    const list = await List.findOneAndUpdate(
        { columnId: listId, parentBoard: boardId },
        { title },
        { new: true } // Return the updated list
    );

    if (!list) {
        res.status(404);
        throw new Error("List not found.");
    }

    res.status(200).json({ success: true, message: "List was updated." });
});

// @desc    Deletes a list.
// route    DELETE /api/boards/:boardId/lists/:listId
// @access  Private
const deleteList = asyncHandler(async (req, res) => {
    const { boardId, listId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }
    // Retrieve and delete the list.
    const list = await List.findOneAndDelete({ columnId: listId, parentBoard: boardId });

    if (!list) {
        res.status(404);
        throw new Error("List not found.");
    }

    // Delete all the associated cards within the list.
    const result = await Card.deleteMany({ columnId: listId, parentBoard: boardId });

    res.status(200).json({ success: true, message: `Deleted list and ${result.deletedCount} cards.` });
});

// @desc    Adds a new card.
// route    POST /api/boards/:boardId/cards
// @access  Private
const addCard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { columnId, taskId, title } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }

    const card = await Card.create({
        title, taskId, columnId,
        parentBoard: boardId,
        createdBy: req.user._id
    });
    
    res.status(201).json({ success: true, data: card, message: "Card was created." });
});

// @desc    Edits an existing card.
// route    PUT /api/boards/:boardId/cards/:cardId
// @access  Private
const editCard = asyncHandler(async (req, res) => {
    const { boardId, cardId } = req.params;
    const { title, description } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }

    const card = await Card.findOneAndUpdate(
        { taskId: cardId, parentBoard: boardId },
        { title, description },
        { new: true }
    );

    if (!card) {
        res.status(404);
        throw new Error("Card not found.");
    }

    res.status(200).json({ success: true, data: card, message: "Card was updated." });
});

// @desc    Deletes a card.
// route    DELETE /api/boards/:boardId/cards/:cardId
// @access  Private
const deleteCard = asyncHandler(async (req, res) => {
    const { boardId, cardId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
        res.status(404);
        throw new Error("Board not found.");
    }

    const card = await Card.findOneAndDelete({ taskId: cardId, parentBoard: boardId });

    if (!card) {
        res.status(404);
        throw new Error("Card not found.");
    }

    res.status(200).json({ success: true, message: "Card was deleted." });
});

export default {
    createBoard,
    editBoard,
    deleteBoard,
    getBoard,

    removeCollaborator,
    editCollaborator,
    inviteCollaborator,
    verifyCollaborator,

    addList,
    editList,
    deleteList,

    addCard,
    editCard,
    deleteCard
}