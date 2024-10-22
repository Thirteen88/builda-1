"use client"

import React from 'react';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { Sidebar } from './sidebar';
import { Layers, Save } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold">AI Website Builder</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Layers className="h-4 w-4" />
            </Button>
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}