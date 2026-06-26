import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import Seo from '../components/Seo'

export default function Salvati() {
  const router = useRouter()
  const [utente, setUtente] = useState(null)
  const [profilo, setProfilo] = useState(null)
  const [post, setPost] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState(null)

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
        return
      }
      setUtente(data.user)

      const { data: prof } = await supabase
        .from('profili')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()
      setProfilo(prof)

      caricaSalvati(data.user.id)
    }
    init()
  }, [router])

  async function caricaSalvati(utenteId) {
    setCaricamento(true)
    const { data, error } = await supabase
      .from('salvati')
      .select('created_at, posts(*)')
      .eq('utente_id', utenteId)
      .order('created_at', { ascending: false })

    if (error) setErrore(error.message)
    else setPost(data.map((riga) => riga.posts).filter(Boolean))
    setCaricamento(false)
  }

  return (
    <div className="min-h-screen bg-foresta">
      <Seo title="I miei salvati" path="/salvati" />
      <Navbar utente={utente} onLogout={async () => { await supabase.auth.signOut(); router.push('/') }} />

      <header className="max-w-3xl mx-auto px-5 pt-10 pb-6">
        <h1 className="font-display text-4xl text-pergamena leading-tight">I MIEI SALVATI</h1>
        <p className="text-corda mt-3 font-mono text-sm">
          Le tappe che hai messo da parte, per ritrovarle facilmente.
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-5 relative">
        {caricamento && <p className="text-corda font-mono pl-14">Caricamento...</p>}
        {errore && <p className="text-falo font-mono pl-14">Errore: {errore}</p>}

        {!caricamento && post.length === 0 && (
          <p className="text-corda font-mono pl-14">
            Non hai ancora salvato nessuna tappa. Torna alla bacheca e clicca 📑 Salva su quelle che ti interessano.
          </p>
        )}

        {post.length > 0 && <div className="linea-pista" />}

        {post.map((p) => (
          <PostCard key={p.id} post={p} utente={utente} profilo={profilo} />
        ))}
      </main>
    </div>
  )
}
