const APP_DESCRIPTION =
  'Student platform & digital workspace for schools - A SaaS solution to improve in-school communication';

export const metadata = {
  title: 'OKAMPUS API v1.0',
  description: APP_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
