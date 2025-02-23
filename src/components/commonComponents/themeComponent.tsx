
'use client'
 
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Moon, Sun } from 'lucide-react';
import { Store } from '@/app/store/themeStore';

const ThemeComponent = () => {
    
    // const theme = useAppSelector((state) => state.auth.theme);
    const theme = Store((state: any) => state.theme);
    const changeTheme = Store((state: any) => state.changeTheme);
    
    const toggleTheme = () => {
        changeTheme(theme === 'dark' ? 'light' : 'dark');
      }
    
      useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
      }, [theme])
  
    return (
     
        <Button
        onClick={toggleTheme}
        className="relative"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
  )
}

export default ThemeComponent;