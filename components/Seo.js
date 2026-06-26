import Head from 'next/head'

const SITO_NOME = 'La Pista — Bacheca Scout tra Reparti'
const DESCRIZIONE_DEFAULT = 'La bacheca digitale che unisce i Reparti scout di tutta Italia: foto, video e racconti di campo da Nord, Centro e Sud, reparti normali e nautici.'
const PAROLE_CHIAVE_DEFAULT = 'scout, reparti scout, AGESCI, bacheca scout, campo scout, reparto nautico, scout Italia, squadriglia, foto scout, video scout'
const URL_SITO = 'https://bacheca-tra-reparti.vercel.app'
const IMMAGINE_DEFAULT = `${URL_SITO}/agesci-logo.jpeg`

export default function Seo({ title, description, path = '' }) {
  const titoloCompleto = title ? `${title} · La Pista` : SITO_NOME
  const desc = description || DESCRIZIONE_DEFAULT
  const url = `${URL_SITO}${path}`

  return (
    <Head>
      <title>{titoloCompleto}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={PAROLE_CHIAVE_DEFAULT} />
      <meta name="author" content="La Pista — Bacheca Scout" />
      <link rel="canonical" href={url} />

      {/* Anteprima quando il link viene condiviso (WhatsApp, Facebook, ecc.) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="La Pista" />
      <meta property="og:title" content={titoloCompleto} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={IMMAGINE_DEFAULT} />
      <meta property="og:locale" content="it_IT" />

      {/* Anteprima su Twitter/X */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={titoloCompleto} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={IMMAGINE_DEFAULT} />

      <link rel="icon" href="/agesci-logo.jpeg" />
    </Head>
  )
}
