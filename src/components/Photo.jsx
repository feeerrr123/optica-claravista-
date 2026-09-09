import { useRef, useState, useEffect } from 'react'

/*
 * Foto con marco de proporción fija. Carga diferida y aparición suave, pero
 * SIN dejarla invisible si onLoad no llega (imagen en caché): comprobamos
 * `complete` al montar.
 */
export default function Photo({ src, alt, ratio = '4/3', className = '', priority = false }) {
  const imgRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setReady(true)
  }, [src])

  return (
    <div
      className={`relative overflow-hidden bg-surface-2 ring-1 ring-inset ring-line ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setReady(true)}
        style={{ filter: 'contrast(1.05) saturate(1.04)' }}
        className={`h-full w-full object-cover transition-opacity duration-700 ease-out ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
