import React, { useState } from 'react';
import Link from 'next/link';
import config from '../config.json';
import Image from 'next/image';

interface HeaderProps {
    onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
    const [q, setQ] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQ(val);
        if (onSearch) onSearch(val);
    };

    const whatsappInternational = config.company.whatsapp_international || config.company.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${whatsappInternational}?text=${encodeURIComponent("Hi, I want to connect with Pluss Wood.")}`;

    return (
        <header className="site-header">
            {/* Top Bar - Common for all pages */}
            <div className="top-bar">
                <div className="container top-bar-inner">
                    <div className="contact-info">
                        <span className="contact-item">
                            <span className="icon">✉️</span> {config.company.email}
                        </span>
                        <span className="contact-item">
                            <span className="icon">📞</span> {config.company.phone}
                        </span>
                    </div>
                    <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn-connect">
                        Connect with Us <span className="icon-wp">💬</span>
                    </a>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="main-nav">
                <div className="container nav-inner">
                    <div className="logo">
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <h1>{config.company.name}</h1>
                        </Link>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search products, tags..."
                            value={q}
                            onChange={handleSearch}
                            aria-label="Search"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
