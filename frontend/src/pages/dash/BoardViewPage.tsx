import KanbanBoard from "@components/kanban/KanbanBoard";
import { useParams } from "react-router-dom";

const BoardViewPage = () => {
  const {boardId} = useParams();

  return (
    <div><KanbanBoard boardId={boardId || ''}/></div>
  )
}

export default BoardViewPage