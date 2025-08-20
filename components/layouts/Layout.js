'use client';

import Navbar from "./Navbar";
import Footer from "./Footer";
import { IconContext } from "react-icons";


export default function Layout({ children }) {
    return (
        
        <IconContext.Provider value={{ color: "blue", className: "global-class-name" }}>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </IconContext.Provider>
    );
}
