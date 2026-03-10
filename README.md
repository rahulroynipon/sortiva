# sortiva

A highly customizable, accessible, and robust sortable list component for React, built on top of \`@dnd-kit\`.

## Demo Project
Try the sortable list live! Inside this repository, navigate to the `demo` folder and run `npm run dev` to see the component in action with various interactive examples.

## Features
- 🚀 **Easy to use**: Minimal setup required.
- 🎨 **Highly customizable**: Custom styling for everything, including drag handles and drag triggers!
- 👆 **Flexible Drag Triggers**: Choose whether the entire item should be draggable, or just a specific drag handle icon.
- ♻️ **Controlled & Uncontrolled**: Automatically manages internal state while providing a callback for changes.

## Installation

\`\`\`bash
npm install sortiva @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities lucide-react clsx tailwind-merge
\`\`\`

*(Note: peer dependencies must be installed as well).*

## Usage

### 1. Basic Usage (Handle Drag Trigger)

By default, \`SortableItem\` requires a \`DragHandle\` to trigger the drag event. This allows users to interact with text inside the item without accidentally dragging it.

\`\`\`tsx
import { SortableList, SortableItem, DragHandle } from 'sortiva';

function App() {
  const items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ];

  return (
    <SortableList
      items={items}
      getId={(item) => item.id}
      onOrderChange={(newItems) => console.log(newItems)}
      renderItem={(item) => (
        <SortableItem id={item.id} className="flex items-center gap-2 p-4 border rounded-md mb-2">
          {/* Default DragHandle renders a GripVertical icon */}
          <DragHandle />
          <span>{item.name}</span>
        </SortableItem>
      )}
    />
  );
}
\`\`\`

### 2. Make the Entire Item Draggable

If you want the entire item to act as the drag handle (e.g. for card-based UI where you can grab any part of the card), use the \`asHandle\` prop on \`SortableItem\`.

\`\`\`tsx
<SortableItem id={item.id} asHandle className="p-4 border rounded-md cursor-grab active:cursor-grabbing">
  <span>{item.name} Drag anywhere to move me!</span>
</SortableItem>
\`\`\`

### 3. Customizing the Drag Handle Icon or Button

You can pass a custom \`icon\` to the \`DragHandle\`, or customize the button entirely by passing standard HTML button props or a custom \`className\`.

\`\`\`tsx
import { Settings } from 'lucide-react'; // Your custom icon

<SortableItem id={item.id} className="flex items-center gap-2 p-4 border rounded-md">
  {/* Pass a custom icon */}
  <DragHandle icon={<Settings className="w-5 h-5 text-blue-500" />} className="hover:bg-blue-100 rounded-full" />
  
  <span>{item.name}</span>
</SortableItem>
\`\`\`

## API Reference

### \`SortableList\`
Props:
- \`items: T[]\`: Array of items to sort.
- \`getId: (item: T) => UniqueIdentifier\`: Function to extract a unique ID from an item.
- \`renderItem: (item: T, index: number) => React.ReactNode\`: Render prop for each list item.
- \`onOrderChange?: (items: T[]) => void\`: Callback fired when the order changes.
- \`className?: string\`: Optional CSS class for the wrapper list.

### \`SortableItem\`
Props:
- \`id: string\`: Unique identifier (must match the ID from \`getId\`).
- \`asHandle?: boolean\`: If \`true\`, the entire wrapper element becomes draggable. Default is \`false\`.
- \`className?: string\`: Optional CSS class.
- \`children: React.ReactNode\`

### \`DragHandle\`
Must be rendered as a child of \`SortableItem\` if \`asHandle\` is \`false\`.
Props:
- \`icon?: React.ReactNode\`: Custom icon element to render inside the drag handle button.
- \`className?: string\`: Optional CSS class to customize the button wrapping the icon.
- Accepts all standard HTML \`<button>\` attributes.
