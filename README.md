# dugout

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

```
pj3-2
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ api
│  │  └─ games
│  │     ├─ handsomeTournament.json
│  │     ├─ heroTournament.json
│  │     ├─ playerQuiz.json
│  │     ├─ recordQuiz.json
│  │     ├─ traitorTournament.json
│  │     └─ triviaQuiz.json
│  └─ favicon.ico
├─ README.md
├─ src
│  ├─ api
│  │  ├─ axios.js
│  │  └─ supabase-api
│  ├─ App.vue
│  ├─ assets
│  │  ├─ icons
│  │  └─ images
│  ├─ components
│  │  ├─ common
│  │  ├─ CreateHeader.vue
│  │  ├─ crewboard
│  │  ├─ foodboard
│  │  ├─ freeboard
│  │  ├─ highlight
│  │  ├─ mypage
│  │  ├─ photoboard
│  │  └─ ui
│  ├─ constants
│  ├─ layouts
│  ├─ main.js
│  ├─ pages
│  ├─ router
│  ├─ stores
│  ├─ styles
│  └─ utils
│     ├─ getRandomQuizs.js
│     ├─ setkakaoMap.js
│     └─ useGameStart.js
├─ tailwind.config.js
└─ vite.config.js

```