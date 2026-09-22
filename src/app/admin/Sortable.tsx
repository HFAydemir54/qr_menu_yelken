"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, type HTMLAttributes, type ReactNode } from "react";

/** Tutamaç butonuna yayılan dnd-kit özellikleri (aria + pointer/klavye dinleyicileri). */
type HandleProps = HTMLAttributes<HTMLButtonElement>;

/** Satırdaki tutamaç; sürükleme yalnızca buradan başlar, böylece butonlar ve kaydırma etkilenmez. */
export function DragHandle({ handle, label }: { handle: HandleProps; label: string }) {
  return (
    <button
      type="button"
      {...handle}
      aria-label={`${label} — sürükleyerek taşı`}
      className="grid h-8 w-6 shrink-0 cursor-grab touch-none place-items-center rounded-md text-brand-muted hover:bg-black/5 active:cursor-grabbing"
    >
      <svg viewBox="0 0 10 16" className="h-4 w-2.5" fill="currentColor" aria-hidden>
        {[2, 8, 14].map((y) => (
          <g key={y}>
            <circle cx="2" cy={y} r="1.5" />
            <circle cx="8" cy={y} r="1.5" />
          </g>
        ))}
      </svg>
    </button>
  );
}

function SortableRow({
  id,
  as: Tag,
  className,
  children,
}: {
  id: string;
  as: "li" | "div" | "section";
  className?: string;
  children: (handle: HandleProps) => ReactNode;
}) {
  const { setNodeRef, transform, transition, isDragging, attributes, listeners } = useSortable({ id });

  return (
    <Tag
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`${className ?? ""} ${isDragging ? "relative z-10 rounded-xl shadow-lg ring-2 ring-brand-gold" : ""}`}
    >
      {children({ ...attributes, ...listeners } as HandleProps)}
    </Tag>
  );
}

/**
 * Dikey sürükle-bırak listesi. Bırakınca sıra hemen ekranda güncellenir,
 * `onReorder` sunucuya kaydeder; hata olursa sayfa yenilenince eski sıraya döner.
 */
export function SortableList<T extends { id: string }>({
  items,
  as = "div",
  itemClassName,
  onReorder,
  children,
}: {
  items: T[];
  as?: "li" | "div" | "section";
  itemClassName?: string;
  onReorder: (ids: string[]) => void;
  children: (item: T, handle: HandleProps, index: number) => ReactNode;
}) {
  // Sunucudan yeni veri gelince (items değişince) yerel sırayı sıfırla.
  const [order, setOrder] = useState({ source: items, list: items });
  const list = order.source === items ? order.list : items;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = list.findIndex((item) => item.id === active.id);
    const to = list.findIndex((item) => item.id === over.id);
    const next = arrayMove(list, from, to);
    setOrder({ source: items, list: next });
    onReorder(next.map((item) => item.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={list.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        {list.map((item, index) => (
          <SortableRow key={item.id} id={item.id} as={as} className={itemClassName}>
            {(handle) => children(item, handle, index)}
          </SortableRow>
        ))}
      </SortableContext>
    </DndContext>
  );
}
