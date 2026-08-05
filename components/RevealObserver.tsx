'use client'

import { useEffect } from 'react'

/** Lightweight scroll reveals for [data-reveal] elements. Respects reduced motion. Safe fallbacks. */
export default function RevealObserver() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    document.documentElement.classList.add('js')

    const revealAll = () => {
      const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]')
      nodes.forEach((node) => node.classList.add('is-in'))
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      revealAll()
      return undefined
    }

    const observedNodes = new Set<HTMLElement>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.01, rootMargin: '120px 0px 120px 0px' }
    )

    const scanAndObserve = () => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
      nodes.forEach((node, index) => {
        if (!node.classList.contains('is-in') && !observedNodes.has(node)) {
          observedNodes.add(node)
          if (!node.style.getPropertyValue('--delay')) {
            node.style.setProperty('--delay', `${Math.min(index % 6, 5) * 55}ms`)
          }
          const rect = node.getBoundingClientRect()
          if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
            node.classList.add('is-in')
          } else {
            observer.observe(node)
          }
        }
      })
    }

    scanAndObserve()

    // Safety fallback: reveal everything after 1 second if still hidden
    const fallbackTimer = setTimeout(() => {
      revealAll()
    }, 1000)

    // Observe potential DOM mutations (e.g. tab changes or dynamic components)
    const mutationObserver = new MutationObserver(() => {
      scanAndObserve()
    })

    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(fallbackTimer)
      mutationObserver.disconnect()
      observer.disconnect()
    }
  }, [])

  return null
}

