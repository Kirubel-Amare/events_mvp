"use client"

import { useState, useEffect } from "react"
import Image, { ImageProps } from "next/image"

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
    const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setImgSrc(src || fallbackSrc)
        setHasError(false)
    }, [src, fallbackSrc])

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
