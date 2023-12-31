import express from 'express';
import boardController from '../controllers/boardController.js';

import { isAuthenticated } from '../middlewares/authMiddleware.js';
const router = express.Router();

// CRUD operations on boards are only available to authenticated users.
router.use(isAuthenticated);

router.post("/", boardController.createBoard);
router.post('/:boardId/lists', boardController.addList);
router.post('/:boardId/cards', boardController.addCard);
router.post("/:boardId/collaborators/", boardController.inviteCollaborator);

router.patch("/:boardId/collaborators/:collaboratorId", boardController.editCollaborator);
router.patch('/:boardId/lists/:listId', boardController.editList);
router.patch('/:boardId/cards/:cardId', boardController.editCard);
router.patch("/:boardId", boardController.editBoard);

router.delete("/:boardId/collaborators/:collaboratorId", boardController.removeCollaborator);
router.delete('/:boardId/lists/:listId', boardController.deleteList);
router.delete('/:boardId/cards/:cardId', boardController.deleteCard);
router.delete("/:boardId", boardController.deleteBoard);

router.get("/:boardId/collaborators/invite", boardController.verifyCollaborator);
router.get("/:boardId", boardController.getBoard);

router.put('/:boardId/cards/:cardId', boardController.moveCard);

export default router;