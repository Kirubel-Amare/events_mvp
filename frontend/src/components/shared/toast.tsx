"use client"

import { Toaster, type ToasterProps } from "react-hot-toast"

export function ToastProvider({ ...props }: ToasterProps) {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                className: "bg-background text-foreground border border-border shadow-md",
                style: {
                    borderRadius: "10px",
                    background: "var(--background)",
                    color: "var(--foreground)",
                },
            }}
            {...props}
        />
    )
}
