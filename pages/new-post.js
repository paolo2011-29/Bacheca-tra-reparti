import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import Seo from '../components/Seo'

export default function NewPost() {
  const router = useRouter()
  const [utente, setUtente] = useState(null)
  const [profilo, setProfilo] = useState(null)
  const [testo, setTesto] = useState('')
  const [file, setFile] = useState(null)
  const [caricamento, setCaricamento] = useState(false)
  const [errore, setErrore] = useState(null)
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
        return
      }
      setUtente(data.user)

      const { data: prof, error } = await supabase
        .from('profili')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (error || !prof) {
        router.push('/profilo')
        return
      }
      setProfilo(prof)
      setPronto(true)
    }
    init()
  }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    setErrore(null)
    setCaricamento(true)

    try {
      let mediaUrl = null
      let mediaType = null

      if (file) {
        const estensione = file.name.split('.').pop()
        const percorso = `${utente.id}/${Date.now()}.${estensione}`
        const { error: erroreUpload } = await supabase.storage
          .from('media')
          .upload(percorso, file)

        if (erroreUpload) throw erroreUpload

        const { data: pubData } = supabase.storage.from('media').getPublicUrl(percorso)
        mediaUrl = pubData.publicUrl
        mediaType = file.type.startsWith('video') ? 'video' : 'immagine'
      }

      const { error: erroreInsert } = await supabase.from('posts').insert({
        autore_id: utente.id,
        autore_nome: profilo.nome_persona,
        reparto_nome: profilo.reparto_nome,
        squadriglia: profilo.squadriglia,
        tipo_reparto: profilo.tipo_reparto,
        zona: profilo.zona,
        regione: profilo.regione,
        testo,
        media_url: mediaUrl,
        media_type: mediaType,
      })

      if (erroreInsert) throw erroreInsert

      router.push('/')
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }

  if (!pronto) return null

  return (
    <div className="min-h-screen bg-foresta">
      <Seo title="Nuova tappa" path="/new-post" />
      <Navbar utente={utente} onLogout={async () => { await supabase.auth.signOut(); router.push('/') }} />
      <main className="max-w-md mx-auto px-5 pt-10 pb-16">
        <h1 className="font-display text-3xl text-pergamena mb-2">NUOVA TAPPA</h1>

        <div className="bg-foresta-scuro border border-corda/30 rounded-lg px-4 py-3 mb-6 font-mono text-xs text-corda">
          <p>{profilo.nome_persona} · {profilo.reparto_nome}</p>
          {profilo.squadriglia && <p>{profilo.squadriglia}</p>}
          <p>{profilo.regione} ({profilo.zona}) · {profilo.tipo_reparto === 'nautico' ? 'reparto nautico' : 'reparto normale'}</p>
          <a href="/profilo" className="text-falo underline">Modifica il profilo</a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-corda block mb-1">Racconta la tappa</label>
            <textarea
              rows={4}
              placeholder="Cosa avete vissuto al campo, all'uscita, all'attivita'..."
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2 placeholder:text-corda/60"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-corda block mb-1">Foto o video (opzionale)</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-pergamena font-mono text-sm"
            />
          </div>

          {errore && <p className="text-falo text-sm font-mono">{errore}</p>}

          <button
            type="submit"
            disabled={caricamento}
            className="w-full bg-falo text-foresta-scuro font-display tracking-wide py-2.5 rounded hover:opacity-90 disabled:opacity-50"
          >
            {caricamento ? 'PUBBLICAZIONE...' : 'PUBBLICA SULLA PISTA'}
          </button>
        </form>
      </main>
    </div>
  )
}
