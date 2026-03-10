"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "./lib/utils";
import { Button } from "./components/button";

export interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => UniqueIdentifier;
  renderItem: (item: T, index: number) => React.ReactNode;
  onOrderChange?: (items: T[]) => void;
  className?: string;
}

export function SortableList<T>({
  items,
  getId,
  renderItem,
  onOrderChange,
  className,
}: SortableListProps<T>) {
  const [list, setList] = useState(items);

  // Sync internal state only when the items prop reference changes
  useEffect(() => {
    setList(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.findIndex((i) => getId(i) === active.id);
    const newIndex = list.findIndex((i) => getId(i) === over.id);

    const newList = arrayMove(list, oldIndex, newIndex);
    setList(newList);
    onOrderChange?.(newList); // Let parent store know new order
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={list.map(getId)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("space-y-3", className)}>
          {list.map((item, index) => renderItem(item, index))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

const SortableItemContext = createContext<ReturnType<typeof useSortable> | null>(null);

export interface SortableItemProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  /**
   * If true, the entire item acts as the drag handle.
   * If false, you should render a \`DragHandle\` component inside this item to act as the handle.
   * @default false
   */
  asHandle?: boolean;
}

export function SortableItem({
  id,
  className,
  children,
  asHandle = false,
}: SortableItemProps) {
  const sortable = useSortable({ id });
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={sortable}>
      <div 
        ref={setNodeRef} 
        style={style} 
        className={cn(className, isDragging && "z-50 relative")}
        {...(asHandle ? { ...attributes, ...listeners } : {})}
      >
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

export interface DragHandleProps extends React.ComponentPropsWithoutRef<typeof Button> {
  icon?: React.ReactNode;
}

export function DragHandle({ className, icon, ...props }: DragHandleProps) {
  const context = useContext(SortableItemContext);
  if (!context) {
    throw new Error("DragHandle must be used within a SortableItem");
  }

  const { attributes, listeners, setActivatorNodeRef } = context;

  return (
    <Button
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      variant="ghost"
      size="icon"
      className={cn("cursor-grab active:cursor-grabbing text-muted-foreground", className)}
      {...props}
    >
      {icon ?? <GripVertical className="h-4 w-4" />}
    </Button>
  );
}
