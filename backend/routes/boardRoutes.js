import express from 'express';
import boardController from '../controllers/boardController.js';

import { isAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();

// CRUD operations on boards are only available to authenticated users.
router.use(isAuthenticated);

// Board
router.post("/", boardController.createBoard);
    router.patch("/:boardId", boardController.editBoard);
    router.delete("/:boardId", boardController.deleteBoard);
    router.get("/:boardId", boardController.getBoard);

// Collaborators
router.get("/:boardId/collaborators/invite", boardController.verifyCollaborator);
router.post("/:boardId/collaborators/", boardController.inviteCollaborator);
    router.patch("/:boardId/collaborators/:collaboratorId", boardController.editCollaborator);
    router.delete("/:boardId/collaborators/:collaboratorId", boardController.removeCollaborator);

// Lists
router.post('/:boardId/lists', boardController.addList);
    router.patch('/:boardId/lists/:listId', boardController.editList);
    router.delete('/:boardId/lists/:listId', boardController.deleteList);

// Cards
router.post('/:boardId/cards', boardController.addCard);
    router.patch('/:boardId/cards/:cardId', boardController.editCard);
    router.put('/:boardId/cards/:cardId', boardController.moveCard);
    router.delete('/:boardId/cards/:cardId', boardController.deleteCard);

export default router;