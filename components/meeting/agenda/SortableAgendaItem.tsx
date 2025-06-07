"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AgendaItem, type AgendaItemType } from "./AgendaItem"

interface SortableAgendaItemProps {
  item: AgendaItemType
  onUpdate: (item: AgendaItemType) => void
  onDelete: (id: string) => void
}

export function SortableAgendaItem({ item, onUpdate, onDelete }: SortableAgendaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <AgendaItem
        item={item}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}
