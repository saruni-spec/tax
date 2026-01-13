# Testing Analytics with an External App

Since your **Analytics Collector** is running on `localhost:3000`, and your **Tax App** is likely a Next.js app (which also defaults to port 3000), follow these steps to test them together.

## 1. Avoid Port Conflicts

You **MUST** run your Tax App on a different port (e.g., 3005) so it doesn't clash with the Analytics Collector.

**Run your Tax App with this command:**
```bash
# In /home/saruni/chatnation/tax/
npm run dev -- -p 3005
```
*Access it at `http://localhost:3005`.*

## 2. Add the Tracking Snippet

Since the Tax App is outside this monorepo, the easiest way to connect them is using the **HTML Snippet**. This works exactly like adding Google Analytics.

### Option A: App Router (Updated Next.js)
If your Tax App uses `app/layout.tsx`:

1. Open `app/layout.tsx`.
2. Add the `Script` component from `next/script`.
3. Paste the snippet code.

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Analytics Snippet */}
        <Script id="analytics-init" strategy="afterInteractive">
          {`
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Analytics snippet included twice.");else{analytics.invoked=!0;analytics.methods=["init","page","track","identify","reset","flush"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src="http://localhost:3000/sdk.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a),analytics.init(t,e)};
            
            // CONFIGURATION
            analytics.load("TAX_APP_WRITE_KEY", {
              apiEndpoint: "http://localhost:3000/v1/capture"
            });
            
            analytics.page();
            }}();
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Option B: Pages Router (Older Next.js)
If your Tax App uses `pages/_app.tsx`:

1. Open `pages/_app.tsx` (or `_document.tsx`).
2. Use `next/script` similarly.

```tsx
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script id="analytics-init" strategy="afterInteractive">
        {`
          !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Analytics snippet included twice.");else{analytics.invoked=!0;analytics.methods=["init","page","track","identify","reset","flush"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src="http://localhost:3000/sdk.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a),analytics.init(t,e)};
          
          analytics.load("TAX_APP_WRITE_KEY", {
            apiEndpoint: "http://localhost:3000/v1/capture"
          });
          
          analytics.page();
          }}();
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

## 3. Verify It Works

1. **Start Analytics**: Ensure your analytics platform is running (`npm run start:dev` in `analytics` folder).
2. **Start Tax App**: Run `npm run dev -- -p 3005` in `tax` folder.
3. **Visit Tax App**: Open `http://localhost:3005`.
4. **Check Dashboard**: Open `http://localhost:3001` (Dashboard API) or check the Analytics terminal logs. You should see "Event received" or similar logs in the Collector output.
5. **Check Network Tab**: In your browser on the Tax App, look for a network request to `capture`. It should be `201 Created`.
