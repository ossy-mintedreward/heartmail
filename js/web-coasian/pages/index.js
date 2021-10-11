import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Coasian</title>
        <meta name="description" content="Truth, Love & Beauty" />
        <link rel="icon" href="/pixel-heart-dark.png" />
      </Head>

      <main className={styles.main}>
        <span className={styles.logoheader}>
            <Image src="/coasian-header-light.png" alt="Coasian" width="300" height="200" />
        </span>
      </main>

      <footer className={styles.footer}>
        <a href="https://www.coasian.com">
          <span className={styles.logofooter}>
            <Image src="/coasian-footer-dark.png" alt="Coasian" width={180} height={50} />
          </span>
        </a>
      </footer>
    </div>
  )
}
