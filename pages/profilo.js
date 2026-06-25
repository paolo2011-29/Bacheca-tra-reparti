import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { REGIONI_PER_ZONA, ZONE, TIPI_REPARTO } from '../lib/zone'
import Navbar from '../components/Navbar'

export default function Profilo() {
  const router = useRouter()
  const [utente, setUtente] = useState(null)
  const [nomePersona, setNomePersona] = useState('')
  const [repartoNome, setRepartoNome] = useState('')
  const [squadriglia, setSquadriglia] = useState('')
  const [tipoReparto, setTipoReparto] = useState('normale')
  const [zona, setZona] = useState('nord')
  const [regione, setRegione] = useState(REGIONI_PER_ZONA.nord[0])
  const [caricamento, setCaricamento] = useState(false)
  const [errore, setErrore] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUtente(data.user)
    })
  }, [router])

  function handleZonaChange(nuovaZona) {
    setZona(nuovaZona)
    setRegione(REGIONI_PER_ZONA[nuovaZona][0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setCaricamento(true)
    setErrore(null)

    const { error } = await supabase.from('profili').upsert({
      id: utente.id,
      nome_persona: nomePersona,
      reparto_nome: repartoNome,
      squadriglia: squadriglia || null,
      tipo_reparto: tipoReparto,
      zona,
      regione,
    })

    setCaricamento(false)
    if (error) setErrore(error.message)
    else router.push('/new-post')
  }

  if (!utente) return null

  return (
    <div className="min-h-screen bg-foresta">
      <Navbar utente={utente} onLogout={async () => { await supabase.auth.signOut(); router.push('/') }} />
      <main className="max-w-md mx-auto px-5 pt-10 pb-16">
        <h1 className="font-display text-3xl text-pergamena mb-2">IL TUO PROFILO</h1>
        <p className="text-corda font-mono text-sm mb-6">
          Lo compili una sola volta: comparirà su ogni tappa che pubblichi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-corda block mb-1">Il tuo nome</label>
            <input
              type="text"
              required
              placeholder="Es. Marco"
              value={nomePersona}
              onChange={(e) => setNomePersona(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2 placeholder:text-corda/60"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-corda block mb-1">Nome del reparto</label>
            <input
              type="text"
              required
              placeholder="Es. Reparto Aquile - Palermo 3"
              value={repartoNome}
              onChange={(e) => setRepartoNome(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2 placeholder:text-corda/60"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-corda block mb-1">Squadriglia (opzionale)</label>
            <input
              type="text"
              placeholder="Es. Squadriglia Lupi"
              value={squadriglia}
              onChange={(e) => setSquadriglia(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2 placeholder:text-corda/60"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-corda block mb-1">Tipo di reparto</label>
            <select
              value={tipoReparto}
              onChange={(e) => setTipoReparto(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2"
            >
              {TIPI_REPARTO.map((t) => <option key={t.valore} value={t.valore}>{t.etichetta}</option>)}
            </select>
          </div>

          <div>
            <label className="font-mono text-xs text-corda block mb-1">Zona</label>
            <select
              value={zona}
              onChange={(e) => handleZonaChange(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2"
            >
              {ZONE.map((z) => <option key={z.valore} value={z.valore}>{z.etichetta}</option>)}
            </select>
          </div>

          <div>
            <label className="font-mono text-xs text-corda block mb-1">Regione</label>
            <select
              value={regione}
              onChange={(e) => setRegione(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2"
            >
              {REGIONI_PER_ZONA[zona].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {errore && <p className="text-falo text-sm font-mono">{errore}</p>}

          <button
            type="submit"
            disabled={caricamento}
            className="w-full bg-falo text-foresta-scuro font-display tracking-wide py-2.5 rounded hover:opacity-90 disabled:opacity-50"
          >
            {caricamento ? 'SALVATAGGIO...' : 'SALVA E CONTINUA'}
          </button>
        </form>
      </main>
    </div>
  )
}
