"use client"

import { useState, useRef } from "react"
import { toast } from "react-hot-toast"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api/client"
import { SafeImage } from "@/components/shared/safe-image"

interface ImageUploadProps {
    onUpload: (url: string) => void
    onDelete?: () => void
    value?: string
    label?: string
    className?: string
}

export function ImageUpload({ onUpload, onDelete, value, label, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        // Validate size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("image", file)

        try {
            const response = await apiClient.post("/upload/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            const url = response.data.url
            onUpload(url)
            toast.success("Image uploaded successfully")
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload image")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const handleDelete = () => {
        if (onDelete) onDelete()
        onUpload("")
    }

    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium mb-1.5">{label}</label>}

            <div className="relative group">
                {value ? (
                    <div className="relative h-40 w-full rounded-lg overflow-hidden border-2 border-gray-100">
                        <SafeImage
                            src={value}
                            alt="Upload preview"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all disabled:opacity-50"
                    >
                        {isUploading ? (
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                        ) : (
                            <>
                                <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <Upload className="h-5 w-5" />
                                </div>
                                <div className="text-sm font-medium text-gray-600">Click to upload image</div>
                                <div className="text-xs text-gray-400">PNG, JPG or WebP (Max 5MB)</div>
                            </>
                        )}
                    </button>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="hidden"
                    accept="image/*"
                />
            </div>
        </div>
    )
}
