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
router.post("/:boardId/collaborators", boardController.addCollaborator);
    router.put("/:boardId/collaborators/:collaboratorId", boardController.editCollaborator);
    router.delete("/:boardId/collaborators/:collaboratorId", boardController.removeCollaborator);
    router.post("/:boardId/collaborators/invite", boardController.inviteCollaborator);
    router.get("/:boardId/collaborators/invite", boardController.verifyCollaborator);

// Lists
router.post('/:boardId/lists', boardController.addList);
    router.patch('/:boardId/lists/:listId', boardController.editList);
    router.delete('/:boardId/lists/:listId', boardController.deleteList);

// Cards
router.post('/:boardId/cards', boardController.addCard);
    router.patch('/:boardId/cards/:cardId', boardController.editCard);
    router.delete('/:boardId/cards/:cardId', boardController.deleteCard);

export default router;