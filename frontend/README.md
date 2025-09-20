# MaaS - Mock as a Service

A dynamic, responsive web application for generating mock APIs instantly. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🎨 Dynamic Layout
- **Hero Section**: Centered chat interface similar to ChatGPT's design
- **Smooth Transitions**: Animated layout shift from centered to split-panel view
- **Responsive Design**: Adapts seamlessly to desktop and mobile devices

### 💬 Chat Interface
- **Real-time Messaging**: Interactive chat with message history
- **Smart Input**: Enter key support and input validation
- **Visual Feedback**: Loading states and smooth animations

### 🚀 Mock API Generation
- **Instant Generation**: Real-time mock data creation based on user input
- **Multiple Endpoints**: Automatically generates GET, POST, and other HTTP methods
- **Visual Progress**: Loading indicators and completion status

### 🎯 Right Panel Features
- **Endpoint Management**: View and manage generated API endpoints
- **Response Preview**: Syntax-highlighted JSON responses
- **Copy Functionality**: One-click copying of endpoints and responses
- **Tabbed Interface**: Organized view of endpoints and responses

### 🌙 Theme Support
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Consistent Branding**: Maintains visual consistency across themes
- **Accessibility**: High contrast support and keyboard navigation

### 📱 Mobile Responsive
- **Adaptive Layout**: Stacks vertically on mobile devices
- **Touch-Friendly**: Optimized for touch interactions
- **Responsive Typography**: Scales appropriately across screen sizes

## Technical Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** for icons
- **Next Themes** for theme management
- **Vite** for build tooling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local development URL

## Usage

1. **Initial State**: The app starts with a centered hero section
2. **Describe Your API**: Type what kind of API you want to mock
3. **Send Message**: Press Enter or click the send button
4. **Watch the Magic**: The layout smoothly transitions to a split-panel view
5. **Explore Results**: View generated endpoints and responses in the right panel
6. **Copy & Use**: Copy endpoints or responses for your development needs

## Customization

The app uses CSS custom properties for theming and can be easily customized by modifying the color variables in `src/index.css`.

## Accessibility

- Full keyboard navigation support
- ARIA labels for screen readers
- High contrast mode support
- Focus management for better UX