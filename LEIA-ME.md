# KidPark Frontend — Instruções de substituição

Cada pasta e arquivo deste zip corresponde EXATAMENTE ao caminho
dentro do seu projeto React. Basta arrastar e substituir.

## Mapa completo

```
SEU PROJETO (pasta raiz onde fica package.json)
│
├── .env                          ← NOVO — colar na raiz
│
└── src/
    ├── contexts/                 ← NOVA PASTA — criar
    │   └── AuthContext.tsx       ← NOVO
    │
    ├── lib/                      ← NOVA PASTA — criar
    │   └── api.ts                ← NOVO
    │
    ├── services/                 ← NOVA PASTA — criar
    │   └── index.ts              ← NOVO
    │
    └── app/
        ├── routes.tsx            ← SUBSTITUIR
        │
        ├── pages/
        │   ├── Login.tsx         ← SUBSTITUIR
        │   ├── Dashboard.tsx     ← SUBSTITUIR
        │   ├── Cadastro.tsx      ← SUBSTITUIR
        │   └── Perfil.tsx        ← SUBSTITUIR
        │
        └── components/
            └── kidpark/
                └── ChildCard.tsx ← SUBSTITUIR
```

## Logins após rodar o seed no backend

| Cargo     | Usuário    | Senha        |
|-----------|------------|--------------|
| Atendente | atendente  | atendente123 |
| Gerente   | gerente    | gerente123   |

## Atenção

- O Login agora pede **usuário** (não email).
- O token fica em `localStorage` (chave `kp_token`).
- Para limpar a sessão manualmente: F12 → Application → Local Storage → limpar.
