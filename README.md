🚀 Tech Challenge – Grupo 7 (FIAP) - Fase 3

Projeto desenvolvido como parte do desafio técnico da Fase 3 do curso POSTECH.
O foco desta fase é o desenvolvimento mobile utilizando React Native (com Expo), integrando Firebase para autenticação, armazenamento e gerenciamento de transações financeiras.

📚 Sobre o Projeto

Este projeto consiste em uma aplicação de gerenciamento financeiro, onde o usuário poderá:

📊 Visualizar gráficos e análises financeiras em um Dashboard interativo.

📋 Listar transações com filtros avançados (por data, categoria, etc.).

🔄 Navegar com animações fluidas entre telas (utilizando React Native Animated / Reanimated).

➕ Adicionar e editar transações, com validação de campos.

📤 Fazer upload de recibos/comprovantes para o Firebase Storage.

🔑 Autenticar-se com Firebase Authentication (Login/Registro).

🧑‍💻 Integrantes do Grupo 7

Alexa Lins

Diego Costa

Henrique Aguiar

Kauane Gonçalves

Manoel Meseque

📁 Estrutura Geral do Projeto
🔸 Repositório Mobile (Fase 3)

Repositório: https://github.com/FIAP-GRUPO-7/tech-challenge-fase3

🚀 Como Executar o Projeto Localmente

Clone o repositório:

git clone https://github.com/FIAP-GRUPO-7/tech-challenge-fase3.git
cd tech-challenge-fase3


Instale as dependências:

npm install


Configure o Firebase:
Crie um arquivo firebaseConfig.js na raiz com as credenciais do seu projeto Firebase:

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

export const firebaseApp = initializeApp(firebaseConfig);


Inicie o app:

npx expo start


📱 O app pode ser testado em:

Expo Go (Android/iOS)

Emulador Android

Simulador iOS (apenas em macOS)

Navegador Web

🔐 Funcionalidades Principais

Login e Autenticação → Firebase Auth

Dashboard → Gráficos e animações

Listagem de Transações → Filtros, paginação, busca no Firestore

Adicionar/Editar Transação → Validação de campos

Upload de Recibos → Firebase Storage

📹 Entrega Final

Além do código fonte, será entregue um vídeo de até 5 minutos demonstrando:

Login e autenticação

Adição/Edição de transações

Visualização e filtros na listagem

Upload de anexos/recibos

Integração com Firebase

🧪 Tecnologias e Ferramentas

React Native 0.79+ (Expo SDK)

Expo Router para navegação

Firebase Authentication, Firestore, Storage

Context API para gerenciamento de estado global

React Native Reanimated / Animated para animações

Chart Kit ou Victory Native para gráficos

TypeScript

⚙️ Scripts Principais
# Instalar dependências
npm install

# Rodar no emulador Android / iOS / Web
npx expo start

# Resetar projeto
npm run reset-project
