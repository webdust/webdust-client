import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { createCookieSessionStorage, json } from '@remix-run/node';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import GothamBook from '~/assets/fonts/gotham-book.woff2';
import GothamMedium from '~/assets/fonts/gotham-medium.woff2';
import { useEffect } from 'react';
import { Error } from '~/layouts/error';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Progress } from '~/components/progress';
import { useScrollIndicator } from '~/hooks';
import config from '~/config.json';
import styles from './root.module.css';
import './reset.module.css';
import './global.module.css';

// --- NEW SEO META EXPORT (REMIX V2) ---
// This handles your ranking for Kerala, Malappuram, and South India.
export const meta = () => {
  return [
    { title: "Webdust | Best Digital Marketing Agency in Kerala & South India" },
    {
      name: "description",
      content: "Webdust is a premier digital marketing agency in Kerala, serving brands across South India. Specializing in performance marketing and web design in Malappuram, we help businesses scale with data-driven results.",
    },
    { 
      name: "keywords", 
      content: "best digital marketing agency in Kerala, digital marketing agency South India, performance marketing Malappuram, web design Kerala, Webdust digital marketing, SEO agency Malappuram, branding agency Kerala, digital marketing firm Malappuram, Kottakkal digital marketing" 
    },
    { property: "og:title", content: "Webdust | Leading Digital Growth Agency in Kerala" },
    { property: "og:description", content: "World-class performance marketing and web design based in Malappuram, Kerala." },
    { property: "og:url", content: "https://www.webdust.in" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { charSet: "utf-8" },
    { name: "robots", content: "index, follow" },
    { name: "language", content: "English" },
    { name: "revisit-after", content: "7 days" },
    { name: "author", content: "Webdust" },
  ];
};

export const links = () => [
  {
    rel: 'preload',
    href: GothamMedium,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: GothamBook,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut_icon', href: '/shortcut.png', type: 'image/png', sizes: '64x64' },
  { rel: 'apple-touch-icon', href: '/icon-256.png', sizes: '256x256' },
  { rel: 'author', href: '/humans.txt', type: 'text/plain' },
];

export const loader = async ({ request }) => {
  const { url } = request;
  const { pathname } = new URL(url);
  const pathnameSliced = pathname.endsWith('/') ? pathname.slice(0, -1) : url;
  const canonicalUrl = `${config.url}${pathnameSliced}`;

  const { getSession, commitSession } = createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET || ' '],
      secure: true,
    },
  });

  const session = await getSession(request.headers.get('Cookie'));
  const theme = session.get('theme') || 'dark';

  return json(
    { canonicalUrl, theme, url },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export default function App() {
  let { canonicalUrl, theme, url } = useLoaderData();
  const fetcher = useFetcher();
  const { state } = useNavigation();
  const isScrolling = useScrollIndicator();

  if (fetcher.formData?.has('theme')) {
    theme = fetcher.formData.get('theme');
  }

  function toggleTheme(newTheme) {
    fetcher.submit(
      { theme: newTheme ? newTheme : theme === 'dark' ? 'light' : 'dark' },
      { action: '/api/set-theme', method: 'post' }
    );
  }

  useEffect(() => {
    console.info(
      `${config.ascii}\n`,
      `Taking a peek huh? Check out the source code: ${config.repo}\n\n`
    );
  }, []);

  return (
    <html lang="en" data-scrolling={isScrolling}>
      <head>
        {/* LOCAL BUSINESS SCHEMA: Tells Google you are in Malappuram, Kerala */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Webdust",
              "url": "https://www.webdust.in",
              "logo": "https://www.webdust.in/favicon.svg",
              "description": "Best Digital Marketing Agency in Kerala and South India.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Malappuram",
                "addressRegion": "Kerala",
                "addressCountry": "IN"
              },
              "areaServed": ["Kerala", "South India", "Malappuram", "Kottakkal"],
              "sameAs": [
                "https://www.instagram.com/webdust.in"
              ]
            }),
          }}
        />

        {/* The Meta component now uses the meta function above for all keywords/SEO */}
        <Meta />
        <Links />
        
        {/* Dynamic theme colors (Untouched) */}
        <meta name="theme-color" content={theme === 'dark' ? '#111' : '#F2F2F2'} />
        <meta
          name="color-scheme"
          content={theme === 'light' ? 'light dark' : 'dark light'}
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Google Analytics (Untouched) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-H7LZ4FR01J"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H7LZ4FR01J');
          `
        }} />
      </head>
      <body data-theme={theme}>
        <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
          <Progress />
          <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
            Skip to main content
          </VisuallyHidden>
          <Navbar />
          <main
            id="main-content"
            className={styles.container}
            tabIndex={-1}
            data-loading={state === 'loading'}
          >
            <Outlet />
          </main>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111" />
        <meta name="color-scheme" content="dark light" />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
      </head>
      <body data-theme="dark">
        <Error error={error} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

