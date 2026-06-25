import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function Login() {
  const [email, setEmail] = useState('')
  const [inviato, setInviato] = useState(false)
  const [errore, setErrore] = useState(null)
  const [caricamento, setCaricamento] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setCaricamento(true)
    setErrore(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined },
    })

    setCaricamento(false)
    if (error) setErrore(error.message)
    else setInviato(true)
  }

  return (
    <div className="min-h-screen bg-foresta">
      <Navbar utente={null} onLogout={() => {}} />
      <main className="max-w-md mx-auto px-5 pt-16">
        <h1 className="font-display text-3xl text-pergamena mb-2">ACCEDI</h1>
        <p className="text-corda font-mono text-sm mb-6">
          Niente password: ti mandiamo un link via email.
        </p>

        {inviato ? (
          <p className="text-pergamena bg-foresta-scuro border border-falo/50 rounded p-4">
            Controlla la tua casella email: ti abbiamo mandato il link per accedere.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="capo.reparto@email.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-foresta-scuro border border-corda/40 text-pergamena rounded px-3 py-2 placeholder:text-corda/60"
            />
            {errore && <p className="text-falo text-sm font-mono">{errore}</p>}
            <button
              type="submit"
              disabled={caricamento}
              className="w-full bg-falo text-foresta-scuro font-display tracking-wide py-2.5 rounded hover:opacity-90 disabled:opacity-50"
            >
              {caricamento ? 'INVIO...' : 'MANDA IL LINK'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
