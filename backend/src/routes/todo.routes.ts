import { Router } from "express";
import * as todoController from "@/controllers/todo.controller";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post('/', todoController.createTodo);
router.get('/', todoController.getTodos);
router.patch('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;