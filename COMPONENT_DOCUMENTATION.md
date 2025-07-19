# Component Documentation

## Core Components

### Layout Components

#### DashboardLayout
**Location**: `src/app/dashboard/layout.tsx`

**Purpose**: Main layout wrapper for all dashboard pages with navigation and authentication

**Props**:
```typescript
interface Props {
  children: React.ReactNode;
}
```

**Features**:
- Role-based navigation menu
- Authentication check
- Sidebar with collapsible menu
- Responsive design
- Logout functionality

**Usage**:
```tsx
<DashboardLayout>
  <YourPageContent />
</DashboardLayout>
```

---

#### UnifiedLayout
**Location**: `src/components/UnifiedLayout.tsx`

**Purpose**: Shared layout for authentication pages

**Features**:
- Centered content layout
- Responsive design
- Consistent styling across auth pages

---

### Form Components

#### Employee Form (Add/Edit)
**Location**: `src/app/dashboard/employees/add/page.tsx`

**Purpose**: Comprehensive form for creating and editing employee records

**Features**:
- React Hook Form integration
- Zod validation schema
- Real-time validation feedback
- Multi-step form sections
- Auto-save functionality

**Form Fields**:
- Personal Information (Name, Email, Phone, Age)
- Work Information (Department, Level, Designation)
- Address Information (City, State, Country, ZIP)
- Additional Information (Blood Group, Working Hours)

**Validation Rules**:
- Required fields validation
- Email format validation
- Phone number validation
- Password strength requirements
- Date validation

---

#### Attendance Form
**Location**: `src/app/dashboard/attendance/page.tsx`

**Purpose**: Mark attendance with geolocation tracking

**Features**:
- Geolocation integration
- Real-time status updates
- Break time tracking
- Working hours calculation

**Form Fields**:
- Login/Logout time
- Break start/end time
- Location coordinates
- Status (Present, Absent, On Leave)

---

### Data Display Components

#### AttendanceTable
**Location**: `src/components/Attendance/AttendanceTable.tsx`

**Purpose**: Display attendance records in a sortable, filterable table

**Props**:
```typescript
interface Props {
  attendanceData: Attendance[];
}
```

**Features**:
- Sortable columns
- Pagination
- Search functionality
- Export capabilities
- Role-based action buttons

**Columns**:
- Employee Name
- Date of Working
- Login Time
- Logout Time
- Break Duration
- Status
- Actions (Edit for Admin)

---

#### EmployeeTable
**Location**: `src/components/EmployeeTable.tsx`

**Purpose**: Display employee records with management actions

**Props**:
```typescript
interface Props {
  fetchEmployees: () => Promise<void>;
  filteredEmployees: Employee[];
  searchTerm: string;
  statusFilter: string;
}
```

**Features**:
- Advanced filtering (Status, Department, Level)
- Bulk actions
- Employee promotion/demotion
- Delete functionality
- Profile links

---

#### DataTable
**Location**: `src/components/Attendance/data-table.tsx`

**Purpose**: Reusable table component with TanStack Table

**Props**:
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
```

**Features**:
- Generic table implementation
- Column sorting
- Row selection
- Pagination
- Loading states

---

### Specialized Components

#### EmployeeIdCard
**Location**: `src/components/EmployeeIdCard.tsx`

**Purpose**: Generate digital employee ID cards

**Props**:
```typescript
interface EmployeeIdCardProps {
  user: TUser;
  showActions?: boolean;
}
```

**Features**:
- Front and back card design
- QR code generation
- Print functionality
- Responsive layout
- Company branding

**Card Information**:
- Employee photo placeholder
- Name and designation
- Employee ID
- Department and level
- Join date
- Company logo

---

#### Dashboard Cards
**Location**: `src/app/dashboard/page.tsx`

**Purpose**: Display key metrics and statistics

**Types**:
- **Stats Cards**: Total employees, active employees, departments
- **Quick Action Cards**: Common tasks and shortcuts
- **Profile Cards**: User information and settings

**Features**:
- Gradient backgrounds
- Icon integration
- Responsive grid layout
- Real-time data updates

---

### UI Components (Shadcn/UI)

#### Button
**Location**: `src/components/ui/button.tsx`

**Variants**:
- `default`: Primary button style
- `outline`: Outlined button
- `ghost`: Transparent button
- `link`: Link-styled button

**Sizes**:
- `sm`: Small button
- `default`: Standard size
- `lg`: Large button

**Usage**:
```tsx
<Button variant="default" size="lg">
  Click me
</Button>
```

---

#### Input
**Location**: `src/components/ui/input.tsx`

**Purpose**: Styled input field with consistent design

**Features**:
- Focus states
- Error states
- Disabled states
- Consistent styling

**Usage**:
```tsx
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={handleChange}
/>
```

---

#### Card
**Location**: `src/components/ui/card.tsx`

**Components**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title component
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Usage**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

---

#### Badge
**Location**: `src/components/ui/badge.tsx`

**Variants**:
- `default`: Primary badge
- `secondary`: Secondary badge
- `destructive`: Error/warning badge
- `outline`: Outlined badge

**Usage**:
```tsx
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Inactive</Badge>
```

---

#### Alert
**Location**: `src/components/ui/alert.tsx`

**Components**:
- `Alert`: Main container
- `AlertDescription`: Description text

**Variants**:
- `default`: Standard alert
- `destructive`: Error alert

**Usage**:
```tsx
<Alert>
  <AlertDescription>
    This is an alert message
  </AlertDescription>
</Alert>
```

---

#### Select
**Location**: `src/components/ui/select.tsx`

**Components**:
- `Select`: Main container
- `SelectTrigger`: Trigger button
- `SelectValue`: Selected value display
- `SelectContent`: Dropdown content
- `SelectItem`: Individual option

**Usage**:
```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

#### Form Components
**Location**: `src/components/ui/form.tsx`

**Components**:
- `Form`: Form provider wrapper
- `FormField`: Individual form field
- `FormItem`: Field container
- `FormLabel`: Field label
- `FormControl`: Input wrapper
- `FormDescription`: Helper text
- `FormMessage`: Error message

**Usage**:
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="fieldName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Field Label</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>Helper text</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

#### Table
**Location**: `src/components/ui/table.tsx`

**Components**:
- `Table`: Main table container
- `TableHeader`: Header section
- `TableBody`: Body section
- `TableRow`: Table row
- `TableHead`: Header cell
- `TableCell`: Body cell

**Usage**:
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Header 1</TableHead>
      <TableHead>Header 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell 1</TableCell>
      <TableCell>Cell 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Authentication Components

#### LogoSection
**Location**: `src/components/auth/LogoSection.tsx`

**Purpose**: Display company logo and branding on auth pages

**Features**:
- Company logo
- Brand name
- Consistent styling
- Responsive design

---

### Utility Components

#### Skeleton
**Location**: `src/components/ui/skeleton.tsx`

**Purpose**: Loading placeholder with animation

**Usage**:
```tsx
<Skeleton className="w-full h-4" />
```

---

#### Separator
**Location**: `src/components/ui/separator.tsx`

**Purpose**: Visual divider between sections

**Props**:
- `orientation`: "horizontal" | "vertical"
- `decorative`: boolean

**Usage**:
```tsx
<Separator orientation="horizontal" />
```

---

#### Avatar
**Location**: `src/components/ui/avatar.tsx`

**Components**:
- `Avatar`: Main container
- `AvatarImage`: Image component
- `AvatarFallback`: Fallback text/icon

**Usage**:
```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Component Patterns

### Higher-Order Components (HOCs)

#### withAuth
**Purpose**: Wrap components that require authentication

```tsx
const withAuth = (Component: React.ComponentType) => {
  return (props: any) => {
    const user = useAuthStore(state => state.user);
    
    if (!user) {
      return <div>Please log in</div>;
    }
    
    return <Component {...props} />;
  };
};
```

---

#### withRole
**Purpose**: Wrap components that require specific roles

```tsx
const withRole = (Component: React.ComponentType, requiredRole: string) => {
  return (props: any) => {
    const user = useAuthStore(state => state.user);
    
    if (!user || user.role !== requiredRole) {
      return <div>Access denied</div>;
    }
    
    return <Component {...props} />;
  };
};
```

---

### Render Props Pattern

#### DataFetcher
**Purpose**: Generic data fetching component

```tsx
interface DataFetcherProps<T> {
  url: string;
  children: (data: T | null, loading: boolean, error: string | null) => React.ReactNode;
}

const DataFetcher = <T,>({ url, children }: DataFetcherProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch logic...
  
  return children(data, loading, error);
};
```

---

### Compound Components

#### Modal
**Purpose**: Flexible modal component with multiple parts

```tsx
const Modal = ({ children, ...props }) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

Modal.Header = DialogHeader;
Modal.Title = DialogTitle;
Modal.Description = DialogDescription;
Modal.Footer = DialogFooter;
```

---

## Styling Guidelines

### CSS Classes Structure
```css
/* Component specific styles */
.component-name {
  /* Base styles */
}

.component-name--variant {
  /* Variant styles */
}

.component-name__element {
  /* Element styles */
}

.component-name--modifier {
  /* Modifier styles */
}
```

### Tailwind CSS Patterns
```tsx
// Responsive design
<div className="w-full md:w-1/2 lg:w-1/3">

// State variants
<button className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300">

// Dark mode support
<div className="bg-white dark:bg-gray-900">

// Spacing consistency
<div className="p-4 m-2 space-y-4">
```

---

## Testing Components

### Unit Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  const button = screen.getByText('Click me');
  expect(button).toBeInTheDocument();
});
```

### Integration Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeForm } from './EmployeeForm';

test('submits form with valid data', async () => {
  const onSubmit = jest.fn();
  render(<EmployeeForm onSubmit={onSubmit} />);
  
  fireEvent.change(screen.getByLabelText('First Name'), {
    target: { value: 'John' }
  });
  
  fireEvent.click(screen.getByText('Submit'));
  
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      firstName: 'John'
    });
  });
});
```

---

## Performance Optimization

### Code Splitting
```tsx
const LazyComponent = lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

### Memoization
```tsx
const ExpensiveComponent = memo(({ data }) => {
  const expensiveValue = useMemo(() => 
    heavyCalculation(data), [data]
  );
  
  return <div>{expensiveValue}</div>;
});
```

### Callback Optimization
```tsx
const Parent = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return <Child onClick={handleClick} />;
};
```

---

*Last updated: January 2024*
