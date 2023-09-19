import { useEffect, useState } from "react";
import { RxTrash } from 'react-icons/rx'; // RxPencil2
import {AiOutlineTags} from 'react-icons/ai';
import { Id, Task } from "./KanbanBoard";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AddLabelPopover } from "@components/modals/AddLabelPopover";
import { Badge } from "@/components/ui/badge"


interface Props {
    task: Task;
    deleteTask: (id: Id) => Promise<void>;
    updateTask: (id: Id, content: string, label?: string) => Promise<void>;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(true);

    const [labelText, setLabelText] = useState<string | undefined>(task.label);
    useEffect(() => {
        updateTask(task.id, task.content, labelText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labelText])

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-mainBackgroundColor rounded-xl p-2.5 h-[60px] min-h-[60px] items-center flex text-left cursor-grab relative"
            />
        );
    }

    if (editMode) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-white border border-gray-200 shadow-md rounded-xl p-2.5 h-[60px] min-h-[60px] items-center flex text-left hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
            >
                <textarea
                    className="h-[99%] w-full resize-none border-gray-500 rounded bg-transparent text-black focus:outline-none "
                    value={task.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            toggleEditMode();
                        }
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                />
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onDoubleClick={toggleEditMode}
            className="bg-white border border-gray-200 shadow-md p-2.5 rounded-xl max-h-[90px] min-h-[60px] items-center flex text-left cursor-grab relative task"
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
        >
            <div className="my-auto h-[99%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap select-none">
             {task?.label && <Badge>{task.label}</Badge>} {task.content}
            </div>

            {mouseIsOver && (
                <>
                    {/* <button
                        className="stroke-white absolute right-10 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
                    >
                        <RxPencil2 />
                    </button> */}
                    <AddLabelPopover labelText={labelText} setLabelText={setLabelText}>
                        <button className="stroke-white absolute right-10 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
                            <AiOutlineTags size={20} />
                        </button>
                    </AddLabelPopover>
                    <button
                        onClick={() => {
                            deleteTask(task.id);
                        }}
                        className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
                    >
                        <RxTrash />
                    </button>
                </>
            )}
        </div>
    );
}

export default TaskCard;