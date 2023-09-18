import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { RxTrash, RxPlus } from 'react-icons/rx';
import { Column, Id, Task } from "./KanbanBoard";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    deleteColumn: (id: Id) => Promise<void>;
    updateColumn: (id: Id, title: string) => Promise<void>;
    
    createTask: (columnId: Id) => Promise<void>;
    updateTask: (id: Id, content: string) => Promise<void>;
    deleteTask: (id: Id) => Promise<void>;
    tasks: Task[];
}

function ColumnContainer({
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
}: Props) {
    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-columnBackgroundColor opacity-40 border-2 border-pink-500 w-[250px] h-[500px] max-h-[500px] rounded-md flex flex-col"
            ></div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-columnBackgroundColor w-[250px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        >
            {/* Column title */}
            <div
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true);
                }}
                className="text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
            >
                <div className="flex gap-2">
                    {!editMode && <span className="bg-pink-300 rounded-full px-3 py-1">{column.title}</span>}
                    {editMode && (
                        <input
                            className="bg-pink-300 rounded-full px-3 py-1 max-w-[128px]"
                            value={column.title}
                            onChange={(e) => updateColumn(column.id, e.target.value)}
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </div>
                <button
                    onClick={() => {
                        deleteColumn(column.id);
                    }}
                    className=" stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2"
                >
                    <RxTrash />
                </button>
            </div>

            {/* Column task container */}
            <div className="flex flex-grow flex-col gap-4 py-2 px-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    ))}
                </SortableContext>
            </div>
            {/* Column footer */}
            <button
                className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
                onClick={() => {
                    createTask(column.id);
                }}
            >
                <RxPlus />
                Add task
            </button>
        </div>
    );
}

export default ColumnContainer;