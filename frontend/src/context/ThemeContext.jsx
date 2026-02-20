import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            console.log("ThemeContext: Initializing...");
            if (typeof window !== 'undefined' && window.localStorage) {
                const stored = window.localStorage.getItem('theme');
                if (stored) {
                    console.log("ThemeContext: Found stored theme", stored);
                    return stored;
                }
            }
            if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                console.log("ThemeContext: Detected system dark mode");
                return 'dark';
            }
        } catch (e) {
            console.error("ThemeContext: Initialization error", e);
        }
        return 'light';
    });

    useEffect(() => {
        try {
            const root = window.document.documentElement;
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('theme', theme);
            }
        } catch (e) {
            console.error("ThemeContext: Effect error", e);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
