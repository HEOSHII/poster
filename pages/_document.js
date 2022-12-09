import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
          <meta charset="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@200;400;700&family=Open+Sans:ital@1&display=swap" rel="stylesheet" />
      </Head>
      <body className="text-textColor-light  bg-background-light dark:bg-background-dark dark:text-textColor-dark">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}