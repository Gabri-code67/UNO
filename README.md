# UNO — starter per versione reale

Questa versione è predisposta per:
- Supabase Auth + PostgreSQL
- annunci con RLS
- Stripe Checkout a €1
- webhook Stripe che attiva l'annuncio dopo il pagamento
- deploy su Vercel

## Configurazione
1. Crea un progetto Supabase.
2. Esegui `supabase/schema.sql` nel SQL Editor.
3. Copia `config.example.js` in `config.js` e inserisci URL + publishable key.
4. Crea un account Stripe e configura le variabili di `.env.example`.
5. Deploy su Vercel.
6. Crea il webhook Stripe `https://TUO-DOMINIO/api/stripe-webhook` per `checkout.session.completed`.
7. Imposta `STRIPE_WEBHOOK_SECRET`.
8. Collega il dominio.

Non inserire mai `STRIPE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY` in `config.js` o nel browser.

Prima del lancio pubblico vanno aggiunti privacy/cookie/termini, moderazione e aspetti fiscali applicabili.
