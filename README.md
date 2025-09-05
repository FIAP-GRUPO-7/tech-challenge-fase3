# 🚀 Tech Challenge – Grupo 7 (FIAP) - Fase 3  

Projeto desenvolvido como parte do desafio técnico da **Fase 3** do curso **POSTECH FIAP**.  
O foco desta fase é o **desenvolvimento mobile** utilizando **React Native (com Expo)**, integrando **Firebase** para autenticação, armazenamento e gerenciamento de transações financeiras.  

---

## 📚 Sobre o Projeto  

Este projeto consiste em uma aplicação de **gerenciamento financeiro**, onde o usuário poderá:  

- 📊 Visualizar gráficos e análises financeiras em um **Dashboard interativo**.  
- 📋 Listar transações com **filtros avançados** (por data, categoria, etc.).  
- 🔄 Navegar com animações fluidas entre telas (utilizando **React Native Animated / Reanimated**).  
- ➕ Adicionar e editar transações, com **validação de campos**.  
- 📤 Fazer upload de recibos/comprovantes para o **Firebase Storage**.  
- 🔑 Autenticar-se com **Firebase Authentication** (Login/Registro com persistência de sessão).  

---

## 🧑‍💻 Integrantes do Grupo 7  

- Alexa Lins  
- Diego Costa  
- Henrique Aguiar  
- Kauane Gonçalves  
- Manoel Meseque  

---

## 📁 Estrutura Geral do Projeto  

📂 **Repositório Mobile (Fase 3)**  
[https://github.com/FIAP-GRUPO-7/tech-challenge-fase3](https://github.com/FIAP-GRUPO-7/tech-challenge-fase3)  

---

## 🚀 Como Executar o Projeto Localmente  

1. Clone o repositório:  

```bash
git clone https://github.com/FIAP-GRUPO-7/tech-challenge-fase3.git
cd tech-challenge-fase3
```

2. Instale as dependências:  

```bash
npm install
```

3. Configure o Firebase:  
   Crie o arquivo `firebaseConfig.js` com suas credenciais do Firebase:  

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

4. Inicie o app:  

```bash
npx expo start
```

📱 O app pode ser testado em:  
- **Expo Go** (Android/iOS)  
- **Emulador Android**  
- **Simulador iOS (apenas em macOS)**  
- **Navegador Web**  

---

## 🔐 Funcionalidades Implementadas  

- ✅ **Login e Autenticação com Firebase** (Cadastro + Login + Logout)  
- ✅ **Sessão persistente** → usuário permanece logado após refresh  
- ✅ **Rotas protegidas** → só acessa `Home` se estiver autenticado  
- 📊 Dashboard (em desenvolvimento)  
- 📋 Listagem e filtros de transações (em desenvolvimento)  
- ➕ Adição/Edição de transações (em desenvolvimento)  
- 📤 Upload de comprovantes para Firebase Storage (em desenvolvimento)  

---

## 📹 Entrega Final  

Além do código fonte, será entregue um **vídeo de até 5 minutos** demonstrando:  

1. Login e autenticação  
2. Adição/Edição de transações  
3. Visualização e filtros na listagem  
4. Upload de anexos/recibos  
5. Integração com Firebase  

---

## 🧪 Tecnologias e Ferramentas  

- **React Native 0.79+ (Expo SDK)**  
- **Expo Router** para navegação  
- **Firebase Authentication, Firestore, Storage**  
- **Context API** para gerenciamento de estado global  
- **React Native Reanimated / Animated** para animações  
- **Chart Kit ou Victory Native** para gráficos  
- **Styled Components** para estilização


---

## ⚙️ Scripts Principais  

```bash
# Instalar dependências
npm install

# Rodar no emulador Android / iOS / Web
npx expo start

# Resetar projeto
npm run reset-project
```