// src/SortableList.tsx
import React2, { createContext, useContext, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/button.tsx
import * as React from "react";
import { jsx } from "react/jsx-runtime";
var Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        className: cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blue-600 text-white shadow hover:bg-blue-600/90": variant === "default",
            "bg-red-500 text-white shadow-sm hover:bg-red-500/90": variant === "destructive",
            "border border-gray-200 bg-transparent shadow-sm hover:bg-gray-100 hover:text-gray-900": variant === "outline",
            "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-100/80": variant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "text-blue-600 underline-offset-4 hover:underline": variant === "link",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon"
          },
          className
        ),
        ...props
      }
    );
  }
);
Button.displayName = "Button";

// src/SortableList.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
function SortableList({
  items,
  getId,
  renderItem,
  onOrderChange,
  className
}) {
  const [list, setList] = useState(items);
  useEffect(() => {
    setList(items);
  }, [items]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex((i) => getId(i) === active.id);
    const newIndex = list.findIndex((i) => getId(i) === over.id);
    const newList = arrayMove(list, oldIndex, newIndex);
    setList(newList);
    onOrderChange?.(newList);
  };
  return /* @__PURE__ */ jsx2(
    DndContext,
    {
      sensors,
      collisionDetection: closestCenter,
      onDragEnd: handleDragEnd,
      children: /* @__PURE__ */ jsx2(
        SortableContext,
        {
          items: list.map(getId),
          strategy: verticalListSortingStrategy,
          children: /* @__PURE__ */ jsx2("div", { className: cn("space-y-3", className), children: list.map((item, index) => /* @__PURE__ */ jsx2(React2.Fragment, { children: renderItem(item, index) }, getId(item))) })
        }
      )
    }
  );
}
var SortableItemContext = createContext(null);
function SortableItem({
  id,
  className,
  children,
  asHandle = false
}) {
  const sortable = useSortable({ id });
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = sortable;
  const style = {
    // Only apply the pointer's translation coords to the active element if it's NOT dragging,
    // otherwise the transparent placeholder ALSO tracks the mouse while the DragOverlay moves,
    // creating a confusing 'double' swap visual issue.
    transform: isDragging ? void 0 : CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  };
  return /* @__PURE__ */ jsx2(SortableItemContext.Provider, { value: sortable, children: /* @__PURE__ */ jsx2(
    "div",
    {
      ref: setNodeRef,
      style,
      className: cn(className, isDragging && "z-50 relative bg-slate-50/50"),
      ...asHandle ? { ...attributes, ...listeners } : {},
      children
    }
  ) });
}
function DragHandle({ className, icon, ...props }) {
  const context = useContext(SortableItemContext);
  if (!context) {
    throw new Error("DragHandle must be used within a SortableItem");
  }
  const { attributes, listeners, setActivatorNodeRef } = context;
  return /* @__PURE__ */ jsx2(
    Button,
    {
      ref: setActivatorNodeRef,
      ...listeners,
      ...attributes,
      type: "button",
      variant: "ghost",
      size: "icon",
      className: cn("cursor-grab active:cursor-grabbing text-muted-foreground", className),
      ...props,
      children: icon ?? /* @__PURE__ */ jsx2(GripVertical, { className: "h-4 w-4" })
    }
  );
}
export {
  DragHandle,
  SortableItem,
  SortableList
};
