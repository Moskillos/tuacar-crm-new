import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import {Theme} from '@radix-ui/themes';
import NavBar from './components/NavBar';
import Spoki from './components/spokiChat';
const inter = Inter({subsets: ['latin']});
import {UserProvider} from '@auth0/nextjs-auth0/client';
import './react-datepicker.css';
import AppProvider from '@/context/AppProvider';
import Menu from './components/menu';

export const metadata: Metadata = {
	title: 'CRM TuaCar',
	description: 'CRM App - TuaCar',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="it">
			<body className={inter.className}>
				<Theme
					accentColor="amber"
					grayColor="sand"
					radius="large"
					scaling="95%"
					className="antialised"
				>
					<UserProvider>
						<AppProvider>
							<NavBar />
							{children}
							<Spoki />
							<Menu />
						</AppProvider>
					</UserProvider>
				</Theme>
			</body>
		</html>
	);
}
