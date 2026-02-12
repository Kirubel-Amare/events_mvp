"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"
import { useMemo } from "react"

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
    src: string | null | undefined
    fallbackSrc?: string
}

const DEFAULT_FALLBACK = "/images/placeholder.svg"

export function SafeImage({
    src,
    fallbackSrc = DEFAULT_FALLBACK,
    alt,
    ...props
}: SafeImageProps) {
    const finalSrc = useMemo(() => {
        if (!src) return fallbackSrc;
        if (src.startsWith('/uploads/')) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
            return `${baseUrl}${src}`;
        }
        return src;
    }, [src, fallbackSrc]);

    const [imgSrc, setImgSrc] = useState<string>(finalSrc)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setImgSrc(finalSrc)
        setHasError(false)
    }, [finalSrc])

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallbackSrc)
            setHasError(true)
        }
    }

    return (
        <Image
            {...props}
            src={imgSrc}
            alt={alt || "Image"}
            onError={handleError}
            unoptimized={hasError || props.unoptimized}
        />
    )
}
