import './globals.css';
import { AuthProvider } from '@/features/auth/AuthContext';

export const metadata = {
  title: 'CTG Admin Portal',
  description: 'Creators Touch Global Admin & Employee Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
