
import { Inter } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import { auth } from '@/auth';
import ProfileInfo from "@/components/profile-info";
import TokenInfo from '@/components/token-info';
import PageDescription from '@/components/page-description';


const inter = Inter({ subsets: ['latin'] });



// ✅ Create a PageWrapper to accept description
export function PageWrapper({ description, children }: { description: string, children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-6 w-full max-w-7xl mx-auto px-6 mt-8">
      {/* Left Column (6 columns) - Page Description */}
      <div className="col-span-6">
        <PageDescription description={description} />
      </div>
      {/* Right Columns (3 + 3) - Profile Info + Token Info */}
      <div className="col-span-3">
        <TokenInfo />
      </div>
      <div className="col-span-3">
        <ProfileInfo />
      </div>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-6 col-span-12">
        {children}
      </main>
    </div>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const isAuthenticated = Boolean(session);
  const authProvider = session?.user?.provider || "Unknown";

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white flex flex-col min-h-screen`}>
        {isAuthenticated && <NavBar authProvider={authProvider} />}
        
        {children} {/* ✅ Children now includes PageWrapper */}
      </body>
    </html>
  );
}
