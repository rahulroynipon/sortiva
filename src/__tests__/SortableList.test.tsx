import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SortableList, SortableItem, DragHandle } from '../SortableList';
import React from 'react';

// Mock dnd-kit since it relies on layout measurements that aren't available in jsdom
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useSensor: () => ({}),
    useSensors: () => ({}),
    PointerSensor: class {},
  };
});

vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable');
  return {
    ...actual,
    SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useSortable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: () => {},
      setActivatorNodeRef: () => {},
      transform: null,
      transition: null,
      isDragging: false,
    }),
  };
});

describe('SortableList', () => {
  const items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  it('renders list items correctly', () => {
    render(
      <SortableList
        items={items}
        getId={(item) => item.id}
        renderItem={(item) => (
          <SortableItem id={item.id}>
            <DragHandle />
            <span>{item.name}</span>
          </SortableItem>
        )}
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
