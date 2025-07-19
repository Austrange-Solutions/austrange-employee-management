# Development Setup Guide

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **MongoDB**: Version 5.0 or higher (local or cloud)
- **Code Editor**: VS Code (recommended) or any preferred editor

### Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Prettier - Code formatter**
- **ESLint**
- **GitLens**
- **MongoDB for VS Code**

---

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sahil1330/austrange-employee-management.git
cd austrange-employee-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/austrange-employee-management

# JWT Secret (Generate a strong secret key)
TOKEN_SECRET=your-secret-key-here-make-it-long-and-secure

# Email Service (Resend)
RESEND_API_KEY=your-resend-api-key

# Application URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Enable debug mode
DEBUG=true
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://mongodb.com/atlas
2. Create a new cluster
3. Get connection string
4. Replace `MONGODB_URI` in `.env.local`

### 5. Initial Data Setup
```bash
# Create admin user (optional script)
npm run seed:admin
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at http://localhost:3000

---

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes
# Commit changes
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

### 2. Code Quality
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check TypeScript errors
npm run type-check

# Format code
npm run format
```

### 3. Testing
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

---

## Database Management

### MongoDB Commands
```bash
# Connect to local MongoDB
mongosh

# Use project database
use austrange-employee-management

# View collections
show collections

# Find users
db.users.find()

# Find attendance records
db.attendances.find()

# Create index
db.users.createIndex({ email: 1 }, { unique: true })
```

### Data Models
```javascript
// User document example
{
  "_id": ObjectId("..."),
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "$2b$10$...", // hashed
  "role": "employee",
  "designation": "Software Developer",
  "department": "Engineering",
  "status": "active",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}

// Attendance document example
{
  "_id": ObjectId("..."),
  "user": ObjectId("..."),
  "dateOfWorking": ISODate("..."),
  "dayOfWeek": "Monday",
  "loginTime": ISODate("..."),
  "logoutTime": ISODate("..."),
  "status": "present",
  "workingHoursCompleted": true,
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

---

## API Development

### Creating New Endpoints

#### 1. Create API Route
```typescript
// src/app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import dbConnect from '@/db/dbConnect';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Authentication check
    const token = await getDataFromToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Your logic here
    
    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### 2. Add Validation Schema
```typescript
// src/schema/yourSchema.ts
import { z } from 'zod';

export const yourSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
});

export type YourSchemaType = z.infer<typeof yourSchema>;
```

#### 3. Create Frontend Hook
```typescript
// src/hooks/useYourFeature.ts
import { useState } from 'react';
import { toast } from 'sonner';

export const useYourFeature = () => {
  const [loading, setLoading] = useState(false);
  
  const performAction = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/your-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Request failed');
      }
      
      toast.success('Success!');
      return await response.json();
    } catch (error) {
      toast.error('Error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return { performAction, loading };
};
```

---

## Component Development

### Creating New Components

#### 1. Component Structure
```typescript
// src/components/YourComponent.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface YourComponentProps {
  className?: string;
  children?: React.ReactNode;
  // Add your props here
}

const YourComponent: React.FC<YourComponentProps> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn('your-default-classes', className)} {...props}>
      {children}
    </div>
  );
};

export default YourComponent;
```

#### 2. With State Management
```typescript
// src/components/StatefulComponent.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface StatefulComponentProps {
  initialData?: any;
  onDataChange?: (data: any) => void;
}

const StatefulComponent: React.FC<StatefulComponentProps> = ({
  initialData,
  onDataChange,
}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (onDataChange) {
      onDataChange(data);
    }
  }, [data, onDataChange]);
  
  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      // API call
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast.success('Success!');
        setData(await response.json());
      }
    } catch (error) {
      toast.error('Error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default StatefulComponent;
```

---

## Styling Guidelines

### Tailwind CSS Setup
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};
```

### CSS Variable System
```css
/* src/app/globals.css */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
}

.dark {
  --primary-color: #60a5fa;
  --secondary-color: #9ca3af;
}
```

### Component Styling Patterns
```typescript
// Using cn utility for conditional classes
const buttonClasses = cn(
  'px-4 py-2 rounded-md font-medium transition-colors',
  {
    'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
    'opacity-50 cursor-not-allowed': disabled,
  },
  className
);
```

---

## State Management

### Zustand Store Setup
```typescript
// src/store/yourStore.ts
import { create } from 'zustand';

interface YourState {
  data: any[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  updateData: (id: string, data: any) => void;
  clearError: () => void;
}

export const useYourStore = create<YourState>((set, get) => ({
  data: [],
  loading: false,
  error: null,
  
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/your-endpoint');
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch data', loading: false });
    }
  },
  
  updateData: (id: string, newData: any) => {
    const { data } = get();
    const updatedData = data.map(item => 
      item.id === id ? { ...item, ...newData } : item
    );
    set({ data: updatedData });
  },
  
  clearError: () => set({ error: null }),
}));
```

---

## Form Handling

### React Hook Form with Zod
```typescript
// src/components/forms/YourForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18 or older'),
});

type FormData = z.infer<typeof schema>;

const YourForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name')}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
};
```

---

## Error Handling

### Global Error Handler
```typescript
// src/lib/errorHandler.ts
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error.response?.status === 401) {
    // Redirect to login
    window.location.href = '/signin';
  } else if (error.response?.status === 403) {
    // Show access denied message
    toast.error('Access denied');
  } else {
    // Generic error message
    toast.error('Something went wrong');
  }
};
```

### Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10">
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## Testing Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
};
```

### Jest Setup
```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
```

### Test Examples
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

---

## Performance Optimization

### Code Splitting
```typescript
// Dynamic imports
const LazyComponent = dynamic(() => import('./LazyComponent'), {
  loading: () => <div>Loading...</div>,
});

// Route-based splitting
const DashboardPage = dynamic(() => import('./pages/Dashboard'), {
  ssr: false,
});
```

### Image Optimization
```typescript
import Image from 'next/image';

const OptimizedImage = () => (
  <Image
    src="/image.jpg"
    alt="Description"
    width={500}
    height={300}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
  />
);
```

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your Next.js config
});

# Run analysis
ANALYZE=true npm run build
```

---

## Security Considerations

### Environment Variables
```bash
# Never commit sensitive data
# Use .env.local for local development
# Use platform-specific env vars for production

# Good practices
TOKEN_SECRET=long-random-string-here
DB_PASSWORD=secure-password
API_KEY=your-api-key

# Bad practices (never do this)
TOKEN_SECRET=123456
DB_PASSWORD=password
```

### Input Validation
```typescript
// Always validate inputs
const validateInput = (data: any) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  
  return schema.parse(data);
};

// Sanitize HTML content
import DOMPurify from 'dompurify';

const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html);
};
```

---

## Deployment Preparation

### Build Optimization
```bash
# Clean build
npm run build

# Start production server
npm start

# Check build size
npm run build:analyze
```

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb://production-server/db
TOKEN_SECRET=production-secret-key
RESEND_API_KEY=production-api-key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Troubleshooting

### Common Issues

#### MongoDB Connection
```bash
# Check MongoDB status
systemctl status mongod

# Check connection
mongosh --eval "db.runCommand({connectionStatus: 1})"

# Check logs
tail -f /var/log/mongodb/mongod.log
```

#### Next.js Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

#### Build Errors
```bash
# Check for unused imports
npm run lint

# Check for type errors
npm run build

# Debug build issues
DEBUG=* npm run build
```

---

*Last updated: January 2024*
