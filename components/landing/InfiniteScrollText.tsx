'use client'

import React, { useEffect, useRef } from 'react'
import styles from './infinite.module.css'

const words = [
  'Headless',
  'Modular',
  'Expandable',
  'Fully customizable',
  'Maximally scalable'
]

export const InfiniteScrollText: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleAnimation = () => {
      const firstItem = container.querySelector(`.${styles.item}`)
      if (firstItem) {
        container.appendChild(firstItem.cloneNode(true))
        container.removeChild(firstItem)
      }
    }

    container.addEventListener('animationiteration', handleAnimation)

    return () => {
      container.removeEventListener('animationiteration', handleAnimation)
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.container}>
        {words.concat(words).map((word, index) => (
          <div key={index} className={styles.item}>
            <span className={styles.outline}>{word}</span>
            <span className={styles.filled}>{word}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

