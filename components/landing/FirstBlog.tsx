'use client'

import React, { useEffect, useRef } from 'react'
import styles from './infinite2.module.css'

const words1 = [
  'Innovative',
  'Collaborative',
  'Inclusive',
  'Impact-driven',
  'Future-ready'
];

const words2 = [
  'Innovative',
  'Efficient',
  'Powerful',
  'User-friendly',
  'Future-proof'
]

const words3 = [
  'AI-driven',
  'Cloud-native',
  'Secure',
  'Responsive',
  'Intuitive'
]

export const InfiniteScroll: React.FC = () => {
  const containerRef1 = useRef<HTMLDivElement>(null)
  const containerRef2 = useRef<HTMLDivElement>(null)
  const containerRef3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleAnimation = (container: HTMLDivElement) => {
      const firstItem = container.querySelector(`.${styles.item}`)
      if (firstItem) {
        container.appendChild(firstItem.cloneNode(true))
        container.removeChild(firstItem)
      }
    }

    const containers = [containerRef1.current, containerRef2.current, containerRef3.current]

    containers.forEach((container) => {
      if (!container) return

      const animationHandler = () => handleAnimation(container)
      container.addEventListener('animationiteration', animationHandler)

      return () => {
        container.removeEventListener('animationiteration', animationHandler)
      }
    })
  }, [])

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef1} className={`${styles.container} ${styles.scrollRight}`}>
        {words1.concat(words1).map((word, index) => (
          <div key={`line1-${index}`} className={styles.item}>
            <span className={styles.outline}>{word}</span>
            <span className={styles.filled}>{word}</span>
          </div>
        ))}
      </div>
      <div ref={containerRef2} className={`${styles.container} ${styles.scrollLeft}`}>
        {words2.concat(words2).map((word, index) => (
          <div key={`line2-${index}`} className={styles.item}>
            <span className={styles.outline}>{word}</span>
            <span className={styles.filled}>{word}</span>
          </div>
        ))}
      </div>
      <div ref={containerRef3} className={`${styles.container} ${styles.scrollRight}`}>
        {words3.concat(words3).map((word, index) => (
          <div key={`line3-${index}`} className={styles.item}>
            <span className={styles.outline}>{word}</span>
            <span className={styles.filled}>{word}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

