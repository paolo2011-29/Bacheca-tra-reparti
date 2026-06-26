# La Pista — Bacheca Scout tra Reparti

Sito di comunità per reparti scout di tutta Italia: foto, video e racconti di campo, in un feed pubblico organizzato come un sentiero.

## Cosa contiene il progetto

- `pages/index.js` — la bacheca pubblica (feed), filtrabile per zona (Nord/Centro/Sud) e tipo di reparto (normale/nautico)
- `pages/login.js` — accesso via email (senza password, "magic link")
- `pages/profilo.js` — al primo accesso, ogni persona compila una volta: nome, reparto, squadriglia, tipo reparto, zona e regione
- `pages/new-post.js` — pubblicare un nuovo post (testo + foto/video); nome e reparto compaiono automaticamente dal profilo
- `supabase/schema.sql` — lo schema del database da creare su Supabase (tabelle `profili` e `posts`)
- `components/` — gli elementi grafici riutilizzabili (card del post, barra di navigazione)

### Come funziona il profilo
La prima volta che una persona clicca su "+ Nuova tappa" senza aver ancora compilato il profilo, viene mandata automaticamente alla pagina `/profilo`. Da lì in poi, ogni post che pubblica mostra in automatico il suo nome, il reparto, la squadriglia (se inserita) e se è un reparto normale o nautico — senza doverlo riscrivere ogni volta.

### Logo AGESCI
Il componente `components/Navbar.js` è già impostato per caricare il file `public/agesci-logo.jpg`. Per metterlo:
1. Procurati il file ufficiale (il tuo Gruppo/Reparto di solito lo ha già, oppure è disponibile tra i materiali ufficiali AGESCI/Pattuglia Comunicazione)
2. Copialo nella cartella `public/` del progetto, chiamandolo esattamente `agesci-logo.jpg`

Nota: il formato JPEG non supporta lo sfondo trasparente. Il logo viene mostrato dentro un cerchio (per mitigare un eventuale sfondo bianco quadrato); se in futuro ottieni una versione PNG o SVG con sfondo trasparente, il risultato sarà ancora più curato — basta aggiornare il nome del file nella riga `src="/agesci-logo.jpg"` dentro `components/Navbar.js`.

### SEO: titolo, descrizione, parole chiave e anteprime social
Il sito ora ha:
- **Titolo e descrizione** per ogni pagina (visibili nei risultati di Google) — gestiti dal componente `components/Seo.js`
- **Parole chiave** pensate per chi cerca "bacheca scout", "reparti AGESCI", "campo scout", ecc.
- **Anteprima social**: quando condividi il link su WhatsApp/Facebook/X, compare un'anteprima con titolo, descrizione e il logo
- **`robots.txt`** e **`sitemap.xml`**: dicono a Google quali pagine indicizzare

⚠️ **Importante:** dentro `components/Seo.js` e nei file `robots.txt`/`sitemap.xml` c'è scritto l'indirizzo `https://bacheca-tra-reparti.vercel.app`. Se il tuo sito ha un indirizzo diverso (es. un dominio personalizzato), aggiorna quell'indirizzo in tutti questi file.

Una volta pubblicate queste modifiche, ci vorranno comunque alcuni giorni/settimane prima che Google indicizzi il sito. Se vuoi accelerare, puoi registrare il sito su [Google Search Console](https://search.google.com/search-console) (gratuito) e chiedere l'indicizzazione manuale.

## Come pubblicarlo online (gratis) — passo per passo

### 1. Crea il database su Supabase
1. Vai su https://supabase.com e crea un account gratuito
2. Crea un nuovo progetto (scegli una regione vicina, es. Frankfurt)
3. Una volta pronto, vai su **SQL Editor** > **New query**
4. Apri il file `supabase/schema.sql` di questo progetto, copia tutto il contenuto, incollalo lì e clicca **Run**
5. Vai su **Project Settings > API**: copia l'**URL del progetto** e la chiave **anon public** — ti serviranno dopo

### 2. Configura l'invio email per il login
Supabase manda già email di test in automatico, ma per un sito vero ti conviene:
- Andare su **Authentication > Providers > Email** e verificare che sia attivo
- (Consigliato dopo, non obbligatorio per iniziare) collegare un servizio email tipo Resend per non finire nello spam

### 3. Metti il codice su GitHub
1. Crea un account su https://github.com se non lo hai
2. Crea un nuovo repository (es. "bacheca-scout")
3. Carica tutti i file di questo progetto nel repository (puoi usare GitHub Desktop se non conosci la riga di comando)

### 4. Pubblica il sito con Vercel
1. Vai su https://vercel.com e accedi con GitHub
2. Clicca **Add New > Project**, scegli il repository che hai appena creato
3. In **Environment Variables** aggiungi:
   - `NEXT_PUBLIC_SUPABASE_URL` → l'URL copiato prima da Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → la chiave anon copiata prima
4. Clicca **Deploy**
5. Dopo 1-2 minuti il sito è online, con un indirizzo tipo `bacheca-scout.vercel.app`

### 5. (Opzionale) Un indirizzo personalizzato
Su Vercel, in **Settings > Domains**, puoi collegare un dominio tuo (es. `lapista-scout.it`) se ne acquisti uno.

## Come provarlo sul tuo computer prima di pubblicarlo

```bash
npm install
cp .env.example .env.local   # poi inserisci le tue chiavi Supabase
npm run dev
```

Apri http://localhost:3000

## Idee per estensioni future
- Pagina profilo per ogni reparto, con il proprio "diario" storico
- Like o commenti sotto ogni tappa
- Notifiche email quando un reparto della propria regione pubblica
- Moderazione: un capo regionale che approva i post prima della pubblicazione
