# Analytics Integration Guide

This guide explains how to integrate the Analytics Service into the application.

## 1. Prerequisites
*   An instance of the Collector Service running (or a mock endpoint for dev).
*   A `Write Key` for the project.

## 2. Install the SDK
(Assuming we build the SDK as a package or simple script)

**Option A: NPM Package (Recommended)**
```bash
npm install @your-org/analytics-js
```

**Option B: Script Tag**
Add to `layout.tsx` or `index.html`.

## 3. Next.js App Router Integration

Create a client component `app/_components/AnalyticsTracker.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import analytics from '@your-org/analytics-js'; // OR your local utility

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize
    analytics.init(process.env.NEXT_PUBLIC_ANALYTICS_KEY);
  }, []);

  useEffect(() => {
    if (pathname) {
      analytics.page();
    }
  }, [pathname, searchParams]);

  return null;
}
```

Add to `app/layout.tsx`:
```tsx
import { AnalyticsTracker } from './_components/AnalyticsTracker';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
```

## 4. Tracking Key Actions

### Manual Tracking in Components
Import the analytics instance and call `track`:

```tsx
// Inside a component (e.g., submit button)
const handlePayment = () => {
  analytics.track('payment_initiated', {
    amount: 500,
    currency: 'KES'
  });
  // ... proceed with logic
};
```

### Server-Side Tracking (Optional)
For critical events that must not be missed (like successful filing), you can track from Server Actions.
*   Requires a Node.js client or simple HTTP POST to the Collector API.
*   **Note**: Server-side events won't have the browser context (User Agent, Screen Size) automatically, so you might need to pass relevant IDs.

## 5. Verification
1.  Open Network Tab in DevTools.
2.  Filter for `/capture`.
3.  Perform actions and verify 200 OK responses.
4.  Check payload content for `event_name` and `properties`.
