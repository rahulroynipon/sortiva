import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

interface SortableListProps<T> {
    items: T[];
    getId: (item: T) => UniqueIdentifier;
    renderItem: (item: T, index: number) => React__default.ReactNode;
    onOrderChange?: (items: T[]) => void;
    className?: string;
}
declare function SortableList<T>({ items, getId, renderItem, onOrderChange, className, }: SortableListProps<T>): react_jsx_runtime.JSX.Element;
interface SortableItemProps {
    id: string;
    className?: string;
    children: React__default.ReactNode;
    /**
     * If true, the entire item acts as the drag handle.
     * If false, you should render a \`DragHandle\` component inside this item to act as the handle.
     * @default false
     */
    asHandle?: boolean;
}
declare function SortableItem({ id, className, children, asHandle, }: SortableItemProps): react_jsx_runtime.JSX.Element;
interface DragHandleProps extends React__default.ComponentPropsWithoutRef<typeof Button> {
    icon?: React__default.ReactNode;
}
declare function DragHandle({ className, icon, ...props }: DragHandleProps): react_jsx_runtime.JSX.Element;

export { DragHandle, type DragHandleProps, SortableItem, type SortableItemProps, SortableList, type SortableListProps };
