"use client"

import React from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Layers, Layout, Type, Image, Box } from 'lucide-react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const components = [
  { id: 'layout', name: 'Layout', icon: Layout },
  { id: 'typography', name: 'Typography', icon: Type },
  { id: 'images', name: 'Images', icon: Image },
  { id: 'containers', name: 'Containers', icon: Box },
];

export function Sidebar() {
  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Components</h2>
        <Droppable droppableId="sidebar" isDropDisabled={true}>
          {(provided) => (
            <ScrollArea className="h-[calc(100vh-8rem)]" {...provided.droppableProps} ref={provided.innerRef}>
              {components.map((component, index) => (
                <Draggable key={component.id} draggableId={component.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Button variant="ghost" className="w-full justify-start mb-2">
                        <component.icon className="mr-2 h-4 w-4" />
                        {component.name}
                      </Button>
                      {index < components.length - 1 && <Separator className="my-2" />}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ScrollArea>
          )}
        </Droppable>
      </div>
    </div>
  );
}