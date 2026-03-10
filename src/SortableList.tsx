"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragStartEvent,
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
  // const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Sync internal state only when the items prop reference changes
  useEffect(() => {
    setList(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // const handleDragStart = (event: DragStartEvent) => {
  //   setActiveId(event.active.id);
  // };

  const handleDragEnd = (event: DragEndEvent) => {
    // setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.findIndex((i) => getId(i) === active.id);
    const newIndex = list.findIndex((i) => getId(i) === over.id);

    const newList = arrayMove(list, oldIndex, newIndex);
    setList(newList);
    onOrderChange?.(newList); // Let parent store know new order
  };

  // const handleDragCancel = () => {
  //   setActiveId(null);
  // };

  // const activeItem = activeId ? list.find((i) => getId(i) === activeId) : null;
  // const activeIndex = activeId ? list.findIndex((i) => getId(i) === activeId) : -1;

  // const dropAnimation = {
  //   sideEffects: defaultDropAnimationSideEffects({
  //     styles: {
  //       active: {
  //         opacity: "0.4",
  //       },
  //     },
  //   }),
  // };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    // onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={list.map(getId)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("space-y-3", className)}>
          {list.map((item, index) => (
            <React.Fragment key={getId(item)}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </div>
      </SortableContext>
      {/* <DragOverlay dropAnimation={dropAnimation}>
        {activeItem ? (
          <div className="scale-105 shadow-2xl cursor-grabbing rounded-xl ring-1 ring-black/5">
            <React.Fragment key={getId(activeItem)}>
              {renderItem(activeItem, activeIndex)}
            </React.Fragment>
          </div>
        ) : null}
      </DragOverlay> */}
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
    // Only apply the pointer's translation coords to the active element if it's NOT dragging,
    // otherwise the transparent placeholder ALSO tracks the mouse while the DragOverlay moves,
    // creating a confusing 'double' swap visual issue.
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <SortableItemContext.Provider value={sortable}>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(className, isDragging && "z-50 relative bg-slate-50/50")}
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
