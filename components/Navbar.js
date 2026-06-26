import Link from 'next/link'

export default function Navbar({ utente, onLogout }) {
  return (
    <nav className="border-b border-corda/30 bg-foresta-scuro">
      <div className="max-w-3xl mx-auto px-5 py-3 grid grid-cols-3 items-center">
        <Link href="/" className="font-display text-2xl tracking-wide text-pergamena justify-self-start">
          LA PISTA
        </Link>

        <Link href="/" className="justify-self-center" aria-label="Vai alla bacheca">
         {/* Logo ufficiale AGESCI: public/agesci-logo.jpeg */}
          <img
            src="/agesci-logo.jpeg"
            alt="Logo AGESCI"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </Link>

        <div className="flex items-center gap-4 font-mono text-sm justify-self-end">
          {utente ? (
            <>
              <Link href="/new-post" className="px-3 py-1.5 rounded bg-falo text-foresta-scuro font-semibold hover:opacity-90">
                + Nuova tappa
              </Link>
              <button onClick={onLogout} className="text-corda hover:text-pergamena">
                Esci
              </button>
            </>
          ) : (
            <Link href="/login" className="px-3 py-1.5 rounded border border-corda text-pergamena hover:bg-corda/20">
              Accedi
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
