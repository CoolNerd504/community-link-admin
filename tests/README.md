# CommLink Test Suite

This directory contains comprehensive test files for different user types and functionality in the CommLink platform.

## Test Structure

```
tests/
├── features/
│   ├── individual/          # Tests for individual user functionality
│   │   └── search-functionality.test.tsx
│   ├── provider/            # Tests for service provider functionality
│   │   └── service-management.test.tsx
│   ├── admin/               # Tests for admin functionality
│   │   └── category-management.test.tsx
│   └── shared/              # Tests for shared functionality
│       └── category-loading.test.tsx
└── README.md
```

## Test Files

### 1. Category Loading Test (`shared/category-loading.test.tsx`)
**Purpose:** Test Firebase category loading functionality
**Features:**
- Load and display all categories from Firebase
- Load and display active categories only
- Create sample categories for testing
- Debug category loading issues

**Usage:**
- Navigate to `/tests/features/shared/category-loading.test.tsx`
- Use "Create Sample Categories" if no categories exist
- Check browser console for debugging information

### 2. Service Management Test (`provider/service-management.test.tsx`)
**Purpose:** Test service provider functionality
**Features:**
- Test MultiServiceManagement component
- Load provider services from Firebase
- Add new services with category selection
- Debug service management issues

**Usage:**
- Must be logged in as a service provider
- Navigate to `/tests/features/provider/service-management.test.tsx`
- Test adding services with category dropdown
- Check browser console for debugging information

### 3. Search Functionality Test (`individual/search-functionality.test.tsx`)
**Purpose:** Test search and filtering functionality
**Features:**
- Test AdvancedSearch component
- Load categories for search filters
- Test search state management
- Debug search functionality issues

**Usage:**
- Navigate to `/tests/features/individual/search-functionality.test.tsx`
- Test category filtering in search
- Check search state updates

### 4. Category Management Test (`admin/category-management.test.tsx`)
**Purpose:** Test admin category management functionality
**Features:**
- Create, update, and delete categories
- Load all and active categories
- Create sample categories
- Test category CRUD operations

**Usage:**
- Navigate to `/tests/features/admin/category-management.test.tsx`
- Use "Create Sample Categories" for testing
- Test full category management workflow

## How to Use These Tests

### 1. Debug Category Loading Issues
If categories are not showing in dropdowns:

1. **Check if categories exist:**
   - Go to `/tests/features/shared/category-loading.test.tsx`
   - Look at "All Categories" and "Active Categories" sections
   - If empty, click "Create Sample Categories"

2. **Check browser console:**
   - Open browser developer tools
   - Look for console logs showing category loading process
   - Check for any error messages

3. **Test specific components:**
   - Use the appropriate test file for the component you're debugging
   - Check if the component receives categories properly

### 2. Test Service Provider Functionality
To test service management:

1. **Log in as a service provider**
2. **Navigate to:** `/tests/features/provider/service-management.test.tsx`
3. **Test the "Add Service" functionality:**
   - Click "Add Service" button
   - Check if category dropdown is populated
   - Try creating a service with different categories

### 3. Test Search Functionality
To test search and filtering:

1. **Navigate to:** `/tests/features/individual/search-functionality.test.tsx`
2. **Test category filtering:**
   - Use the AdvancedSearch component
   - Check if categories appear in the dropdown
   - Test filtering by category

### 4. Test Admin Category Management
To test admin functionality:

1. **Navigate to:** `/tests/features/admin/category-management.test.tsx`
2. **Test category operations:**
   - Create new categories
   - Edit existing categories
   - Delete categories
   - Toggle category status

## Debugging Tips

### Common Issues and Solutions

1. **No categories showing:**
   - Check if categories exist in Firebase
   - Use "Create Sample Categories" button
   - Check Firestore security rules

2. **Category dropdown empty:**
   - Verify `getActiveCategories()` function is working
   - Check browser console for errors
   - Ensure categories have `isActive: true`

3. **Firebase permission errors:**
   - Check if user is authenticated
   - Verify Firestore security rules
   - Check browser console for specific error messages

4. **Type errors:**
   - Check if Firebase types match component types
   - Look for Timestamp vs Date type mismatches
   - Verify interface definitions

### Console Logging
All test files include comprehensive console logging:
- Category loading process
- Service operations
- Error messages
- Data transformations

Check the browser console for detailed debugging information.

## Adding New Tests

When adding new test files:

1. **Create in appropriate folder:**
   - Individual user tests → `individual/`
   - Provider tests → `provider/`
   - Admin tests → `admin/`
   - Shared functionality → `shared/`

2. **Follow naming convention:**
   - Use descriptive names: `feature-name.test.tsx`
   - Include `.test.tsx` suffix

3. **Include debugging:**
   - Add console logs for key operations
   - Show loading states
   - Display error messages
   - Provide clear feedback

4. **Test specific functionality:**
   - Focus on one feature per test file
   - Include both success and error scenarios
   - Test edge cases

## Security Notes

- Test files are for development/debugging only
- Remove or secure test routes in production
- Don't expose sensitive data in test outputs
- Use test data, not real user data 