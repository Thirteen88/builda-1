"use client"

import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Wand2, Eye, Smartphone, Tablet, Monitor, Download } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const componentMap = {
  layout: ({ content, columns }) => (
    <div className={`p-4 border rounded grid grid-cols-${columns || 1} gap-4`}>
      <h2 className="text-lg font-semibold mb-2 col-span-full">Layout Component</h2>
      {content ? content.split('|').map((col, index) => (
        <div key={index} className="border p-2">{col}</div>
      )) : <p>Add content here</p>}
    </div>
  ),
  typography: ({ content, variant }) => {
    const Tag = variant || 'p';
    return (
      <div className="p-4 border rounded">
        <Tag className={variant === 'h1' ? 'text-2xl font-bold' : 
                        variant === 'h2' ? 'text-xl font-semibold' : 
                        variant === 'h3' ? 'text-lg font-medium' : ''}>
          {content || 'Add text here'}
        </Tag>
      </div>
    );
  },
  images: ({ src, alt }) => (
    <div className="p-4 border rounded">
      <h3 className="text-md font-semibold mb-2">Image Component</h3>
      {src ? (
        <img src={src} alt={alt || 'Image'} className="max-w-full h-auto" />
      ) : (
        <div className="bg-gray-200 h-32 flex items-center justify-center">
          No image uploaded
        </div>
      )}
    </div>
  ),
  containers: ({ content, backgroundColor }) => (
    <div className="p-4 border rounded" style={{ backgroundColor }}>
      <h3 className="text-md font-semibold mb-2">Container Component</h3>
      <div className="p-4 rounded">
        {content || 'Add content here'}
      </div>
    </div>
  ),
};

export function WebsiteBuilder() {
  const [components, setComponents] = useState([]);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [aiPrompt, setAiPrompt] = useState('');

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'sidebar' && result.destination.droppableId === 'builder') {
      const newComponent = {
        id: `${result.draggableId}-${Date.now()}`,
        type: result.draggableId,
        props: {},
      };
      setComponents([...components, newComponent]);
    } else if (result.source.droppableId === 'builder' && result.destination.droppableId === 'builder') {
      const newComponents = Array.from(components);
      const [reorderedItem] = newComponents.splice(result.source.index, 1);
      newComponents.splice(result.destination.index, 0, reorderedItem);
      setComponents(newComponents);
    }
  };

  const generateWithAI = async () => {
    // Simulating AI-generated content based on the prompt
    const aiGeneratedComponents = [
      { id: 'ai-layout-1', type: 'layout', props: { content: `${aiPrompt} layout|Second column`, columns: 2 } },
      { id: 'ai-typography-1', type: 'typography', props: { content: `Heading: ${aiPrompt}`, variant: 'h1' } },
      { id: 'ai-images-1', type: 'images', props: { src: 'https://source.unsplash.com/random/800x600', alt: `AI-generated image for ${aiPrompt}` } },
      { id: 'ai-containers-1', type: 'containers', props: { content: `Container for ${aiPrompt}`, backgroundColor: '#f0f0f0' } },
    ];
    setComponents(aiGeneratedComponents);
  };

  const handleEditComponent = (component) => {
    setEditingComponent(component);
  };

  const handleSaveComponent = (updatedProps) => {
    const updatedComponents = components.map((comp) =>
      comp.id === editingComponent.id ? { ...comp, props: updatedProps } : comp
    );
    setComponents(updatedComponents);
    setEditingComponent(null);
  };

  const renderEditDialog = () => {
    if (!editingComponent) return null;

    const ComponentForm = () => {
      const [props, setProps] = useState(editingComponent.props);

      const handleChange = (e) => {
        setProps({ ...props, [e.target.name]: e.target.value });
      };

      return (
        <div className="space-y-4">
          {editingComponent.type === 'layout' && (
            <>
              <div>
                <Label htmlFor="content">Content (use | to separate columns)</Label>
                <Textarea id="content" name="content" value={props.content || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="columns">Columns</Label>
                <Input id="columns" name="columns" type="number" value={props.columns || 1} onChange={handleChange} />
              </div>
            </>
          )}
          {editingComponent.type === 'typography' && (
            <>
              <div>
                <Label htmlFor="content">Text</Label>
                <Textarea id="content" name="content" value={props.content || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="variant">Variant</Label>
                <Select name="variant" value={props.variant || 'p'} onValueChange={(value) => setProps({ ...props, variant: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p">Paragraph</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {editingComponent.type === 'images' && (
            <>
              <div>
                <Label htmlFor="src">Image URL</Label>
                <Input id="src" name="src" value={props.src || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input id="alt" name="alt" value={props.alt || ''} onChange={handleChange} />
              </div>
            </>
          )}
          {editingComponent.type === 'containers' && (
            <>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" value={props.content || ''} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input id="backgroundColor" name="backgroundColor" type="color" value={props.backgroundColor || '#ffffff'} onChange={handleChange} />
              </div>
            </>
          )}
          <Button onClick={() => handleSaveComponent(props)}>Save</Button>
        </div>
      );
    };

    return (
      <Dialog open={!!editingComponent} onOpenChange={() => setEditingComponent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingComponent.type} Component</DialogTitle>
          </DialogHeader>
          <ComponentForm />
        </DialogContent>
      </Dialog>
    );
  };

  const exportWebsite = () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exported Website</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          ${components.map(component => {
            const ComponentRenderer = componentMap[component.type];
            return ComponentRenderer ? ComponentRenderer(component.props) : '';
          }).join('')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter AI prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-64"
            />
            <Button onClick={generateWithAI}>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            {showPreview && (
              <>
                <Button variant="outline" size="icon" onClick={() => setPreviewDevice('mobile')}>
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPreviewDevice('tablet')}>
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setPreviewDevice('desktop')}>
                  <Monitor className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button onClick={exportWebsite}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <Card className="flex-1 overflow-hidden">
          <CardContent className="h-full p-6">
            {showPreview ? (
              <div className={`border rounded-lg h-full p-4 overflow-y-auto ${
                previewDevice === 'mobile' ? 'max-w-sm' :
                previewDevice === 'tablet' ? 'max-w-md' :
                'w-full'
              } mx-auto`}>
                {components.map((component) => (
                  <div key={component.id} className="mb-4">
                    {componentMap[component.type](component.props)}
                  </div>
                ))}
              </div>
            ) : (
              <Droppable droppableId="builder">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="border-2 border-dashed border-gray-300 rounded-lg h-full p-4 overflow-y-auto"
                  >
                    {components.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold mb-2">Start Building Your Website</h3>
                          <p className="text-sm text-gray-500 mb-4">Drag and drop components or use AI to generate your website</p>
                          <Button onClick={generateWithAI}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate with AI
                          </Button>
                        </div>
                      </div>
                    ) : (
                      components.map((component, index) => (
                        <Draggable key={component.id} draggableId={component.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-4 relative group"
                            >
                              {componentMap[component.type](component.props)}
                              <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleEditComponent(component)}
                              >
                                Edit
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </CardContent>
        </Card>
      </div>
      {renderEditDialog()}
    </DragDropContext>
  );
}