import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "glass";
    size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-primary-600 text-white hover:bg-primary-500 shadow-md shadow-primary-900/20": variant === "default",
                        "border border-white/20 bg-transparent hover:bg-white/5 text-white": variant === "outline",
                        "bg-transparent hover:bg-white/10 text-white": variant === "ghost",
                        "glass-panel text-white hover:bg-white/10": variant === "glass",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 px-3 rounded-md text-xs": size === "sm",
                        "h-12 px-8 rounded-md text-base": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
