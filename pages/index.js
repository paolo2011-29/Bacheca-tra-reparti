import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { ZONE, TIPI_REPARTO } from '../lib/zone'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import Seo from '../components/Seo'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState(null)
  const [zonaFiltro, setZonaFiltro] = useState('tutte')
  const [tipoFiltro, setTipoFiltro] = useState('tutti')
  const [utente, setUtente] = useState(null)
  const [profilo, setProfilo] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUtente(data.user)
      if (data.user) {
        const { data: prof } = await supabase
          .from('profili')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()
        setProfilo(prof)
      }
    })
    caricaPost()
  }, [])

  async function caricaPost() {
    setCaricamento(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setErrore(error.message)
    else setPosts(data)
    setCaricamento(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUtente(null)
    setProfilo(null)
  }

  const postFiltrati = posts.filter((p) => {
    const passaZona = zonaFiltro === 'tutte' || p.zona === zonaFiltro
    const passaTipo = tipoFiltro === 'tutti' || p.tipo_reparto === tipoFiltro
    return passaZona && passaTipo
  })

  return (
    <div className="min-h-screen bg-foresta">
      <Seo />
      <Navbar utente={utente} onLogout={handleLogout} />

      <header className="max-w-3xl mx-auto px-5 pt-10 pb-6">
        <h1 className="font-display text-4xl md:text-5xl text-pergamena leading-tight">
          IL SENTIERO CHE<br />UNISCE I REPARTI
        </h1>
        <p className="text-corda mt-3 font-mono text-sm">
          Foto, video e racconti di campo da tutta Italia.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-5 mb-8 flex flex-wrap gap-6">
        <div>
          <label className="font-mono text-xs text-corda block mb-1">Zona</label>
          <select
            value={zonaFiltro}
            onChange={(e) => setZonaFiltro(e.target.value)}
            className="bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2 font-mono text-sm"
          >
            <option value="tutte">Tutte</option>
            {ZONE.map((z) => <option key={z.valore} value={z.valore}>{z.etichetta}</option>)}
          </select>
        </div>

        <div>
          <label className="font-mono text-xs text-corda block mb-1">Tipo di reparto</label>
          <select
            value={tipoFiltro}
            onChange={(e) => setTipoFiltro(e.target.value)}
            className="bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2 font-mono text-sm"
          >
            <option value="tutti">Tutti</option>
            {TIPI_REPARTO.map((t) => <option key={t.valore} value={t.valore}>{t.etichetta}</option>)}
          </select>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-5 relative">
        {caricamento && <p className="text-corda font-mono pl-14">Caricamento tappe...</p>}
        {errore && <p className="text-falo font-mono pl-14">Errore: {errore}</p>}

        {!caricamento && postFiltrati.length === 0 && (
          <p className="text-corda font-mono pl-14">
            Nessuna tappa qui. Sii il primo reparto a piantare la bandierina.
          </p>
        )}

        {postFiltrati.length > 0 && <div className="linea-pista" />}

        {postFiltrati.map((post) => (
          <PostCard key={post.id} post={post} utente={utente} profilo={profilo} />
        ))}
      </main>
    </div>
  )
}
