'use client'

import { useEffect, useState } from 'react'

const GREETINGS = [
  { text: 'Hello', lang: 'en', dir: 'ltr' },
  { text: 'Hola', lang: 'es', dir: 'ltr' },
  { text: 'سلام', lang: 'fa', dir: 'rtl' },
] as const

export function RotatingHello() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % GREETINGS.length)
    }, 2400)
    return () => window.clearInterval(id)
  }, [])

  const greeting = GREETINGS[index]

  return (
    <h1 className="font-serif text-7xl leading-none tracking-tight text-primary sm:text-8xl lg:text-9xl">
      <span className="sr-only">Hello, Hola, سلام</span>
      <span
        key={greeting.text}
        aria-hidden="true"
        lang={greeting.lang}
        dir={greeting.dir}
        className="inline-block animate-in fade-in slide-in-from-bottom-3 duration-700"
      >
        {greeting.text}
      </span>
    </h1>
  )
}
