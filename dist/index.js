"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DragHandle: () => DragHandle,
  SortableItem: () => SortableItem,
  SortableList: () => SortableList
});
module.exports = __toCommonJS(index_exports);

// src/SortableList.tsx
var import_react = __toESM(require("react"));
var import_core = require("@dnd-kit/core");
var import_sortable = require("@dnd-kit/sortable");
var import_utilities = require("@dnd-kit/utilities");
var import_lucide_react = require("lucide-react");

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/button.tsx
var React = __toESM(require("react"));
var import_jsx_runtime = require("react/jsx-runtime");
var Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_jsx_runtime2 = require("react/jsx-runtime");
function SortableList({
  items,
  getId,
  renderItem,
  onOrderChange,
  className
}) {
  const [list, setList] = (0, import_react.useState)(items);
  (0, import_react.useEffect)(() => {
    setList(items);
  }, [items]);
  const sensors = (0, import_core.useSensors)(
    (0, import_core.useSensor)(import_core.PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = list.findIndex((i) => getId(i) === active.id);
    const newIndex = list.findIndex((i) => getId(i) === over.id);
    const newList = (0, import_sortable.arrayMove)(list, oldIndex, newIndex);
    setList(newList);
    onOrderChange?.(newList);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_core.DndContext,
    {
      sensors,
      collisionDetection: import_core.closestCenter,
      onDragEnd: handleDragEnd,
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_sortable.SortableContext,
        {
          items: list.map(getId),
          strategy: import_sortable.verticalListSortingStrategy,
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: cn("space-y-3", className), children: list.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react.default.Fragment, { children: renderItem(item, index) }, getId(item))) })
        }
      )
    }
  );
}
var SortableItemContext = (0, import_react.createContext)(null);
function SortableItem({
  id,
  className,
  children,
  asHandle = false
}) {
  const sortable = (0, import_sortable.useSortable)({ id });
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = sortable;
  const style = {
    // Only apply the pointer's translation coords to the active element if it's NOT dragging,
    // otherwise the transparent placeholder ALSO tracks the mouse while the DragOverlay moves,
    // creating a confusing 'double' swap visual issue.
    transform: isDragging ? void 0 : import_utilities.CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SortableItemContext.Provider, { value: sortable, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
  const context = (0, import_react.useContext)(SortableItemContext);
  if (!context) {
    throw new Error("DragHandle must be used within a SortableItem");
  }
  const { attributes, listeners, setActivatorNodeRef } = context;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
      children: icon ?? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_lucide_react.GripVertical, { className: "h-4 w-4" })
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DragHandle,
  SortableItem,
  SortableList
});
