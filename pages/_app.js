import '../styles/globals.css'
import { useEffect } from 'react'
import { initDatabase } from '../lib/database'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 初始化資料庫
    initDatabase()
  }, [])

  return <Component {...pageProps} />
}

