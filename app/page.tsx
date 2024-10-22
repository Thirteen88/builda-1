"use client"

import { MainLayout } from '@/components/main-layout';
import { WebsiteBuilder } from '@/components/website-builder';
import { DragDropContext } from 'react-beautiful-dnd';
import ErrorBoundary from '@/components/error-boundary';

// Suppress specific warning
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Warning: %s: Support for defaultProps')) {
    return;
  }
  originalError.apply(console, args);
};

export default function Home() {
  return (
    <ErrorBoundary>
      <DragDropContext onDragEnd={() => {}}>
        <MainLayout>
          <WebsiteBuilder />
        </MainLayout>
      </DragDropContext>
    </ErrorBoundary>
  );
}