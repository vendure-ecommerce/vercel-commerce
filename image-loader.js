'use client'

export default function vendureImageLoader({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality || 75}`
}