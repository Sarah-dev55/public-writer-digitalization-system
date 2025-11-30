import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import DocumentManagement from '../../components/client/DocumentDetails';

export default function Documents() {
	const menuItems = [
		{ label: 'HOME', href: '/' },
		{ label: 'ABOUT US', href: '/about' },
		{ label: 'CONTACT US', href: '/contact' },
		{ label: 'BLOG', href: '/blog' },
	];

	const testUser = {
		name: 'Sarah Smith',
		avatar: null,
	};

	return (
		<div className="min-h-screen bg-[#F3ECDC]">
			<Header
				logo="MENSEUR"
				email="Disnmarketir@gmail.com"
				phone="(+92) 123-456-789"
				menuItems={menuItems}
				user={testUser}
			/>

			<main className="py-6">
				<DocumentManagement />
			</main>

			<Footer />
		</div>
	);
}
