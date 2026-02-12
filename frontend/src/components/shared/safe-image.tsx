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
    const isLocal = useMemo(() => !!src && src.startsWith('/uploads/'), [src]);

    const finalSrc = useMemo(() => {
        if (!src) return fallbackSrc;
        if (isLocal) {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
            const baseUrl = apiBase.split('/api/v1')[0];
            const cleanSrc = src.startsWith('/') ? src : `/${src}`;
            const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            return `${cleanBase}${cleanSrc}`;
        }
        return src;
    }, [src, fallbackSrc, isLocal]);

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
            unoptimized={isLocal || hasError || props.unoptimized}
        />
    )
}
