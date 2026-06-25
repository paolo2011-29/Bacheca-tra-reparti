function formattaData(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function PostCard({ post }) {
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
            className="rounded-md border border-corda/20 max-h-[480px] w-full object-cover"
          />
        )}

        {post.media_url && post.media_type === 'video' && (
          <video
            src={post.media_url}
            controls
            className="rounded-md border border-corda/20 max-h-[480px] w-full"
          />
        )}
      </div>
    </div>
  )
}
