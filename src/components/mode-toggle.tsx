"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

enum Theme { light = "light", dark = "dark" }

export function ModeToggle() {
    const { setTheme } = useTheme();

    const handleToggleTheme = () => {
        const current_theme = localStorage.getItem("theme")

        if (current_theme == Theme.dark) {
            setTheme(Theme.light)
        } else {
            setTheme(Theme.dark)
        }
    }

    return (
        <Button onClick={handleToggleTheme} variant="outline" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

    );
}
