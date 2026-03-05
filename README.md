# red_tetris

Exemple d'arborescence:

red-tetris/
│
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   ├── server/
│   │   └── Dockerfile
│   └── db/
│       └── init.sql
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── app.js
│   │
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── gameController.js
│   │   │   └── userController.js
│   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── gameRoutes.js
│   │   │   └── userRoutes.js
│   │
│   │   ├── services/
│   │   │   ├── gameService.js
│   │   │   ├── matchmakingService.js
│   │   │   └── scoreService.js
│   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Game.js
│   │   │   └── Score.js
│   │
│   │   ├── websocket/
│   │   │   ├── socketServer.js
│   │   │   ├── gameSocket.js
│   │   │   └── lobbySocket.js
│   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   └── helpers.js
│   │
│   │   └── game/
│   │       ├── engine/
│   │       │   ├── tetrisEngine.js
│   │       │   ├── board.js
│   │       │   └── pieces.js
│   │       │
│   │       ├── mechanics/
│   │       │   ├── collision.js
│   │       │   ├── rotation.js
│   │       │   └── lineClear.js
│   │       │
│   │       └── multiplayer/
│   │           ├── garbageSystem.js
│   │           └── roomManager.js
│
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── main.js
│   │   ├── App.js
│   │
│   │   ├── api/
│   │   │   ├── apiClient.js
│   │   │   └── gameApi.js
│   │
│   │   ├── components/
│   │   │   ├── GameBoard.js
│   │   │   ├── Lobby.js
│   │   │   ├── ScoreBoard.js
│   │   │   └── LoginForm.js
│   │
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── GamePage.js
│   │   │   └── ProfilePage.js
│   │
│   │   ├── hooks/
│   │   │   ├── useGameSocket.js
│   │   │   └── useAuth.js
│   │
│   │   ├── store/
│   │   │   └── gameStore.js
│   │
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── game.css
│   │
│   │   └── utils/
│   │       └── constants.js
│
│   └── package.json
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_games.sql
│   │   └── 003_create_scores.sql
│   │
│   └── seeds/
│       └── seed_users.sql
│
├── scripts/
│   ├── start.sh
│   └── dev.sh
│
├── .env
├── docker-compose.yml
└── README.md


Ordre de développement logique

Serveur de base — Express + Socket.io qui tourne
Parsing de l'URL — extraire room et player du hash
Classes serveur — Piece, Player, Room, Game
Logique Tetris — grille, déplacement, rotation, collision, lignes
Communication Socket — définir les events (move, drop, line_added, game_over…)
Front-end — afficher la grille, gérer les inputs clavier
Redux — state management (grille, score, pièce courante…)
Multijoueur — shadow/spectre, pénalités, conditions de victoire
Tests — viser 70%+ de coverage
