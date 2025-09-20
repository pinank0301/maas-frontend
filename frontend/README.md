# MaaS - Mock as a Service

A responsive, accessible, production-ready React + TypeScript application for generating mock APIs instantly. Built with shadcn/ui components and modern web standards.

## Features

- 🚀 **Instant Mock Generation**: Describe your API requirements and get production-ready mock endpoints
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🎭 **Smooth Animations**: Elegant transitions and micro-interactions
- 📋 **Copy & Download**: Easy copying and downloading of generated JSON responses
- 🔧 **TypeScript**: Fully typed for better development experience

## Tech Stack

- **React 19+** with TypeScript
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Radix UI** primitives for accessibility

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

1. **Describe Your API**: Enter a description of the API you want to mock in the chat input
2. **Generate**: Click "Generate Mock" or press Enter to start generation
3. **View Results**: Watch the real-time generation progress and explore generated endpoints
4. **Interact**: Copy JSON responses, download files, or manage endpoints

### Example Prompts

- "Create a user management API with CRUD operations"
- "Build an e-commerce API with products and orders"
- "Generate a blog API with posts and comments"
- "Create a simple todo API with tasks and categories"

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # App header with theme toggle
│   ├── ChatPanel.tsx   # Main chat interface
│   ├── RightPanel.tsx  # Results panel
│   ├── EndpointList.tsx # Endpoint management
│   ├── JsonViewer.tsx  # JSON response viewer
│   └── ProgressIndicator.tsx # Generation progress
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Theme management
├── hooks/              # Custom hooks
│   └── useMockGenerator.ts # Mock generation logic
├── lib/                # Utilities
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Key Features

### Responsive Layout
- **Desktop**: Split view with chat (40%) and results (60%)
- **Mobile**: Stacked layout with smooth transitions
- **Tablet**: Adaptive layout based on screen size

### Accessibility
- Full keyboard navigation support
- ARIA labels and roles for screen readers
- High contrast ratios for better visibility
- Focus management and visual indicators

### Theme Support
- Light and dark mode toggle
- System preference detection
- Persistent theme selection
- Smooth theme transitions

### Mock Generation
- Real-time progress indicators
- Step-by-step generation process
- Error handling and retry functionality
- Realistic sample data generation

## Customization

### Styling
Global styles and theme variables are centralized in `src/index.css`. You can customize:
- Color schemes
- Animation durations
- Spacing and typography
- Component-specific styles

### Components
All components are modular and can be easily customized or extended. Each component includes:
- TypeScript interfaces
- Accessibility attributes
- Responsive design
- Error boundaries

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details