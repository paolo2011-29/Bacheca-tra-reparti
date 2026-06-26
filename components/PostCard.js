import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function formattaData(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PostCard({ post, utente, profilo }) {
  const [numeroMiPiace, setNumeroMiPiace] = useState(0)
  const [hoMessoMiPiace, setHoMessoMiPiace] = useState(false)
  const [caricamentoMiPiace, setCaricamentoMiPiace] = useState(false)

  const [numeroCommenti, setNumeroCommenti] = useState(0)
  const [commentiAperti, setCommentiAperti] = useState(false)
  const [commenti, setCommenti] = useState([])
  const [nuovoCommento, setNuovoCommento] = useState('')
  const [invioCommento, setInvioCommento] = useState(false)

  const [salvato, setSalvato] = useState(false)
  const [caricamentoSalvato, setCaricamentoSalvato] = useState(false)

  useEffect(() => {
    caricaConteggi()
  }, [])

  async function caricaConteggi() {
    const { count: countMiPiace } = await supabase
      .from('mi_piace')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id)
    setNumeroMiPiace(countMiPiace || 0)

    if (utente) {
      const { data } = await supabase
        .from('mi_piace')
        .select('id')
        .eq('post_id', post.id)
        .eq('utente_id', utente.id)
        .maybeSingle()
      setHoMessoMiPiace(!!data)
    }

    const { count: countCommenti } = await supabase
      .from('commenti')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id)
    setNumeroCommenti(countCommenti || 0)

    if (utente) {
      const { data: salvatoData } = await supabase
        .from('salvati')
        .select('id')
        .eq('post_id', post.id)
        .eq('utente_id', utente.id)
        .maybeSingle()
      setSalvato(!!salvatoData)
    }
  }

  async function toggleSalvato() {
    if (!utente) {
      window.location.href = '/login'
      return
    }
    setCaricamentoSalvato(true)

    if (salvato) {
      await supabase.from('salvati').delete().eq('post_id', post.id).eq('utente_id', utente.id)
      setSalvato(false)
    } else {
      await supabase.from('salvati').insert({ post_id: post.id, utente_id: utente.id })
      setSalvato(true)
    }
    setCaricamentoSalvato(false)
  }

  async function toggleMiPiace() {
    if (!utente) {
      window.location.href = '/login'
      return
    }
    setCaricamentoMiPiace(true)

    if (hoMessoMiPiace) {
      await supabase.from('mi_piace').delete().eq('post_id', post.id).eq('utente_id', utente.id)
      setHoMessoMiPiace(false)
      setNumeroMiPiace((n) => Math.max(0, n - 1))
    } else {
      await supabase.from('mi_piace').insert({ post_id: post.id, utente_id: utente.id })
      setHoMessoMiPiace(true)
      setNumeroMiPiace((n) => n + 1)
    }
    setCaricamentoMiPiace(false)
  }

  async function apriCommenti() {
    const apertura = !commentiAperti
    setCommentiAperti(apertura)
    if (apertura && commenti.length === 0) {
      const { data } = await supabase
        .from('commenti')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true })
      setCommenti(data || [])
    }
  }

  async function inviaCommento(e) {
    e.preventDefault()
    if (!utente) {
      window.location.href = '/login'
      return
    }
    if (!nuovoCommento.trim()) return
    setInvioCommento(true)

    const nomeAutore = profilo ? profilo.nome_persona : 'Anonimo'

    const { data, error } = await supabase
      .from('commenti')
      .insert({
        post_id: post.id,
        autore_id: utente.id,
        autore_nome: nomeAutore,
        testo: nuovoCommento.trim(),
      })
      .select()
      .single()

    if (!error && data) {
      setCommenti((c) => [...c, data])
      setNumeroCommenti((n) => n + 1)
      setNuovoCommento('')
    }
    setInvioCommento(false)
  }

  return (
    <div className="relative pl-14 pb-10">
      <div className="segnavia top-1" />
      <div className="bg-foresta-scuro border border-corda/30 rounded-lg p-5 shadow-lg">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <span className="font-display text-lg text-falo tracking-wide">
            {post.reparto_nome}
          </span>
          <span className="font-mono text-xs text-corda border border-corda/50 rounded px-2 py-1">
            {post.regione} · {formattaData(post.created_at)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3 font-mono text-xs text-corda/90">
          <span>{post.autore_nome}</span>
          {post.squadriglia && <span>· {post.squadriglia}</span>}
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${post.tipo_reparto === 'nautico' ? 'bg-fazzoletto/30 text-fazzoletto' : 'bg-rosso/30 text-rosso'}`}>
            {post.tipo_reparto === 'nautico' ? 'Nautico' : 'Normale'}
          </span>
        </div>

        {post.testo && (
          <p className="text-pergamena/90 leading-relaxed mb-3 whitespace-pre-wrap">
            {post.testo}
          </p>
        )}

        {post.media_url && post.media_type === 'immagine' && (
          <img
            src={post.media_url}
            alt={`Foto pubblicata da ${post.reparto_nome}`}
            className="rounded-md border border-corda/20 max-h-[480px] w-full object-cover mb-3"
          />
        )}

        {post.media_url && post.media_type === 'video' && (
          <video
            src={post.media_url}
            controls
            className="rounded-md border border-corda/20 max-h-[480px] w-full mb-3"
          />
        )}

        {/* Mi piace e commenti */}
        <div className="flex items-center gap-4 pt-3 border-t border-corda/20 font-mono text-sm">
          <button
            onClick={toggleMiPiace}
            disabled={caricamentoMiPiace}
            className={`flex items-center gap-1.5 transition-colors ${hoMessoMiPiace ? 'text-falo' : 'text-corda hover:text-pergamena'}`}
          >
            <span>{hoMessoMiPiace ? '★' : '☆'}</span>
            <span>{numeroMiPiace > 0 ? numeroMiPiace : ''} Mi piace</span>
          </button>

          <button
            onClick={apriCommenti}
            className="flex items-center gap-1.5 text-corda hover:text-pergamena transition-colors"
          >
            <span>💬</span>
            <span>{numeroCommenti > 0 ? numeroCommenti : ''} Commenti</span>
          </button>

          <button
            onClick={toggleSalvato}
            disabled={caricamentoSalvato}
            className={`flex items-center gap-1.5 ml-auto transition-colors ${salvato ? 'text-falo' : 'text-corda hover:text-pergamena'}`}
          >
            <span>{salvato ? '🔖' : '📑'}</span>
            <span>{salvato ? 'Salvato' : 'Salva'}</span>
          </button>
        </div>

        {/* Sezione commenti, apribile/chiudibile */}
        {commentiAperti && (
          <div className="mt-4 pt-4 border-t border-corda/20 space-y-3">
            {commenti.length === 0 && (
              <p className="text-corda/70 text-sm font-mono">Nessun commento ancora. Scrivi il primo!</p>
            )}

            {commenti.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="text-falo font-semibold">{c.autore_nome}</span>
                <span className="text-pergamena/80"> {c.testo}</span>
              </div>
            ))}

            <form onSubmit={inviaCommento} className="flex gap-2 pt-2">
              <input
                type="text"
                value={nuovoCommento}
                onChange={(e) => setNuovoCommento(e.target.value)}
                placeholder={utente ? 'Scrivi un commento...' : 'Accedi per commentare'}
                disabled={!utente}
                className="flex-1 bg-foresta border border-corda/40 text-pergamena rounded px-3 py-1.5 text-sm placeholder:text-corda/60 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!utente || invioCommento}
                className="px-3 py-1.5 rounded bg-falo text-foresta-scuro font-semibold text-sm hover:opacity-90 disabled:opacity-50"
              >
                Invia
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
