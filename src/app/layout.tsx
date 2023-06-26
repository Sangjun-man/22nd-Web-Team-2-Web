import QueryProvider from '@/providers/QueryProvider';
import RecoilRootWrapper from '@/providers/RecoilRootWrapper';
import font from '@/styles/font';
import '@/styles/global.css';
import * as styles from './layout.css';
import { GlobalComponents } from '@/components/global/GlobalComponents/GlobalComponents';
import Header from '@/components/common/Header/Header';
import { AuthProvider } from '@/providers/AuthContext';

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={font.className}>
      <body className={styles.container}>
        <RecoilRootWrapper>
          <QueryProvider>
            <AuthProvider>
              <div id="modal-portal" />
              <GlobalComponents />
              <main>
                <Header />
                {children}
              </main>
            </AuthProvider>
          </QueryProvider>
        </RecoilRootWrapper>
      </body>
    </html>
  );
}
