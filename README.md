
# Bug Tracker Application

A comprehensive bug tracking application built with React, showcasing testing and debugging best practices.

## Features

- **Create Bug Reports**: Submit detailed bug reports with title, description, and priority
- **View Bug List**: See all reported bugs with filtering by status
- **Update Bug Status**: Mark bugs as Open, In Progress, or Resolved
- **Delete Bugs**: Remove bug reports when no longer needed
- **Search Functionality**: Quickly find specific bugs

## Testing and Debugging Features

### Testing Implementation

This project demonstrates various testing strategies:

#### Backend Tests (in a full MERN stack)
- Unit tests for utility functions
- Integration tests for API routes
- Mock database interactions

#### Frontend Tests
- Component tests using React Testing Library
- Integration tests for component interactions
- UI state testing

### Debugging Features

The application includes several features to aid in debugging:

- Console logging strategy for tracking application flow
- Error boundaries for graceful error handling
- Form validation with detailed error messages
- Mocked API with simulated delays and errors

## Project Structure

```
src/
├── components/           # UI components
│   ├── BugCard.tsx       # Individual bug display
│   ├── BugForm.tsx       # Form for creating/editing bugs
│   ├── BugsList.tsx      # List of bugs with filtering
│   └── ErrorBoundary.tsx # React error boundary component
├── lib/                  # Utilities and API
│   ├── api.ts            # API functions
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── pages/                # Application pages
    └── Index.tsx         # Main dashboard page
```

## Testing Structure

```
src/
├── components/
│   └── BugCard.test.tsx  # Component tests
├── lib/
│   ├── api.test.ts       # API function tests
│   └── utils.test.ts     # Utility function tests
```

## Running the Project

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open [http://localhost:8080](http://localhost:8080) to view the application

## Running Tests

In a complete implementation, tests would be run using:

```
npm test
```

## Debugging Techniques

1. **Console Logging**: Strategic console logs have been placed in key areas to track application flow
2. **React DevTools**: The application is structured to work well with React DevTools for component inspection
3. **Network Monitoring**: The mock API includes simulated network delays to demonstrate debugging async operations
4. **Error Boundaries**: React Error Boundaries catch and display errors gracefully

## Error Handling

- Form validation with clear error messages
- API error handling with user feedback via toast notifications
- React Error Boundaries to prevent entire application crashes

## Future Enhancements

- User authentication system
- Project management to group bugs by project
- Comment system for bug discussions
- File attachments for bug reports
- Detailed analytics and reporting
