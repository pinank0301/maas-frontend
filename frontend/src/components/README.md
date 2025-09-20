# MaaS Components

This directory contains all the reusable components for the MaaS (Mock as a Service) application. The components are organized for easy maintenance and reusability.

## Component Structure

### Core Components

#### `Header.tsx`
- **Purpose**: Application header with branding and theme toggle
- **Props**: `theme`, `onToggleTheme`
- **Features**: Responsive design, accessibility support

#### `Layout.tsx`
- **Purpose**: Main layout wrapper that orchestrates the entire application
- **Props**: All necessary state and handlers
- **Features**: Responsive layout management, smooth transitions

### Chat Components

#### `ChatInterface.tsx`
- **Purpose**: Main chat interface container
- **Props**: `messages`, `onSendMessage`, `isGenerating`, `isTransitioned`, `isMobile`
- **Features**: Conditional rendering, responsive behavior

#### `MessageList.tsx`
- **Purpose**: Displays chat messages with animations
- **Props**: `messages`
- **Features**: Smooth animations, hover effects, message styling

#### `ChatInput.tsx`
- **Purpose**: Input field for sending messages
- **Props**: `onSendMessage`, `isGenerating`, `isTransitioned`, `isMobile`
- **Features**: Enter key support, loading states, accessibility

#### `HeroSection.tsx`
- **Purpose**: Initial centered hero section
- **Props**: `children`
- **Features**: Gradient text, responsive design

### Mock API Components

#### `MockPanel.tsx`
- **Purpose**: Right panel showing generated mock APIs
- **Props**: `mockEndpoints`, `isGenerating`, `isMobile`, `onCopy`, `getMethodColor`
- **Features**: Tabbed interface, progress indicators, responsive design

#### `EndpointCard.tsx`
- **Purpose**: Individual endpoint display card
- **Props**: `endpoint`, `onCopy`, `getMethodColor`
- **Features**: Method color coding, copy functionality, status indicators

#### `ResponseCard.tsx`
- **Purpose**: JSON response display card
- **Props**: `endpoint`, `onCopy`
- **Features**: Syntax highlighting, copy functionality, scrollable content

## Type Definitions

### `types/index.ts`
Centralized type definitions:
- `Message`: Chat message structure
- `MockEndpoint`: API endpoint structure
- `Theme`: Theme type definition

## Custom Hooks

### `hooks/useMockGeneration.ts`
- **Purpose**: Manages mock data generation logic
- **Returns**: `isGenerating`, `mockEndpoints`, `generateMockEndpoints`, `getMethodColor`
- **Features**: Async mock generation, status management

## Usage Examples

### Direct Component Import
```tsx
import { Header } from './components/Header'
import { ChatInterface } from './components/ChatInterface'
import { MockPanel } from './components/MockPanel'
```

### Using with Types
```tsx
import { Message, MockEndpoint, Theme } from './types'
```

### Custom Hook Usage
```tsx
import { useMockGeneration } from './hooks/useMockGeneration'

function MyComponent() {
  const { isGenerating, mockEndpoints, generateMockEndpoints } = useMockGeneration()
  // ... component logic
}
```

## Component Features

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- High contrast mode support

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Responsive typography

### Animations
- Smooth transitions
- Hover effects
- Loading states
- Custom keyframe animations

### Theme Support
- Light/dark mode
- Consistent color schemes
- Smooth theme transitions
- CSS custom properties

## Best Practices

1. **Props Interface**: Always define clear prop interfaces
2. **Type Safety**: Use TypeScript for all components
3. **Accessibility**: Include ARIA labels and keyboard support
4. **Responsive**: Test on multiple screen sizes
5. **Performance**: Use React.memo for expensive components when needed
6. **Reusability**: Keep components focused and single-purpose
