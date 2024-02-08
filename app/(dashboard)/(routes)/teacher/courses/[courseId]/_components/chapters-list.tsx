"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd"
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: Chapter[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
};
const ChaptersList = ({
    items,
    onReorder,
    onEdit
}: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // although this component is client comp but it first render in server side 
    // for drag and drop component if client and server side component don't matches it gave hydration error
    // to prevent hydration error we only render component is it is mounted 

    // rehydrate items
    useEffect(() => {
        setChapters(items);
    }, [items])

    // if component rendering is diffrent on client and server side return null
    // some times it throws hydration to handle this return null if not mounted
    if (!isMounted) {
        return null;
    }

    // hello-pangea docs 
    const onDragEnd = (result: DropResult) => {
        // if dropped outside box 
        if (!result.destination) return;

        // result json data of draggable item with source and destination of item

        // console.log(result);
        
        // reordering the items
        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        // chapters which replaced their position
        const updatedChapters = items.slice(startIndex, endIndex + 1);
        // console.log(updatedChapters);

        // final position
        setChapters(items);

        // function to change postion in db 
        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));
        onReorder(bulkUpdateData);
    }
    return (
        // drag and drop box 
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {/* items to be dragged */}
                        {chapters.map((chapter, index) => (
                            <Draggable key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    // custom styling divs
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                            chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div className={cn(
                                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                            chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                        )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip
                                                className="h-5 w-5" />
                                        </div>
                                        <div className="flex w-full">
                                            {chapter.title}
                                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                {chapter.isFree && (
                                                    <Badge>
                                                        Free
                                                    </Badge>
                                                )}
                                                <Badge
                                                    className={cn("bg-slate-500",
                                                        chapter.isPublished && "bg-sky-700"
                                                    )}
                                                >
                                                    {chapter.isPublished ? "Published" : "Draft"}
                                                </Badge>
                                                <Pencil
                                                    onClick={() => onEdit(chapter.id)}
                                                    className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}

            </Droppable>

        </DragDropContext>
    )
}

export default ChaptersList