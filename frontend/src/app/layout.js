import ClientLayout from 'components/ClientLayout';
import 'app/globals.css';

export const metadata = {
  title: 'ML with Aryan',
  description: 'Exploring the Frontiers of Machine Learning.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
