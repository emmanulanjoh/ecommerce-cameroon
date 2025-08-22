# Project Reorganization Plan

## Current Issues
1. **Duplicate Authentication Systems**: AuthContext vs UserContext
2. **Mixed Admin Components**: Scattered across different folders
3. **Inconsistent Structure**: No clear feature-based organization
4. **Import Path Confusion**: Deep nested imports

## New Structure (Feature-Based)

```
client/src/
├── features/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminHeader.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── pages/
│   │   │   ├── Admin.tsx
│   │   │   ├── AdminAccess.tsx
│   │   │   ├── OrderManagement.tsx
│   │   │   ├── CategoryManagement.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ReviewManagement.tsx
│   │   │   └── Settings.tsx
│   │   └── index.ts (barrel exports)
│   │
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── UserAuth.tsx
│   │   │   └── Login.tsx
│   │   ├── context/
│   │   │   └── UserContext.tsx
│   │   └── index.ts
│   │
│   ├── products/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── PublicProductList.tsx
│   │   └── index.ts
│   │
│   ├── orders/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── components/
│       ├── pages/
│       │   └── UserDashboard.tsx
│       └── index.ts
│
├── shared/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   └── common/       # Common components
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── constants/        # App constants
│
├── pages/                # Main page components
│   ├── ModernHome.tsx
│   ├── ModernAbout.tsx
│   ├── ModernContact.tsx
│   ├── ModernFAQ.tsx
│   └── NotFound.tsx
│
└── App.tsx
```

## Benefits
1. **Clear Feature Separation**: Each feature has its own folder
2. **Unified Authentication**: Single auth system
3. **Better Imports**: Barrel exports for cleaner imports
4. **Scalability**: Easy to add new features
5. **Maintainability**: Related code is grouped together

## Migration Steps
1. ✅ Create new folder structure
2. ✅ Move admin components to features/admin
3. ✅ Move auth components to features/auth  
4. ✅ Move product components to features/products
5. 🔄 Update import paths in all files
6. 🔄 Create barrel exports (index.ts files)
7. 🔄 Remove duplicate authentication systems
8. 🔄 Update App.tsx routing

## Next Steps
- Update all import statements
- Create index.ts barrel exports
- Remove AuthContext (keep only UserContext)
- Update routing in App.tsx