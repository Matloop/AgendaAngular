# Agenda

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Development server

To start a local development server, run:

```bash
npm install -g @angular/cli
```

```bash
npm install -g json-server
```

```
npm install
```

```bash
npm start
```

```bash
npx json-server db.json
```
taskmaster/
│
├── public/
│   └── index.html
│
├── src/
│   ├── compromissos
│   │   locais
│   │   contatos
│   │   guards
│   │   services
│   │
│   ├── context/
│   │   └── TaskContext.js
│   │
│   ├── hooks/
│   │   └── useLocalStorage.js
│   │
│   ├── utils/
│   │   └── taskHelpers.js
│   │
│   ├── App.js
│   └── index.js
│
├── tests/
│   ├── TaskList.test.js
│   └── TaskItem.test.js
│
├── package.json
├── vite.config.js

