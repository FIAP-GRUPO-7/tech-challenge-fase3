# 🚀 Tech Challenge – Grupo 8 (FIAP) - Fase 3  

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
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9j59QILJJRBxhVb3RjRhotLwI8YiRWdw",
  authDomain: "fase3-banco.firebaseapp.com",
  projectId: "fase3-banco",
  storageBucket: "fase3-banco.appspot.com",
  messagingSenderId: "763272564201",
  appId: "1:763272564201:web:5a230c20015683f2e0cf78",
  measurementId: "G-0S35DXRK1F",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);     
export const storage = getStorage(app);   
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
- ✅ **Dashboard** com **Gráficos e Análises** 
- ✅ **Animações Fluidas** para Transições entre Seções (Reanimated/Animated) 
- ✅ **Listagem e filtros de transações** (por data, categoria, etc.)
- ✅ **Busca e Filtragem Integrada** com Cloud Firestore 
- ✅ **Paginação** implementada para lidar com grande volume de dados 
- ✅ **Adição/Edição de transações**
- ✅ **Validação Avançada** de Valor e Categoria 
- ✅ Upload de comprovantes para **Firebase Storage**

---

## Link do Design System

```bash
https://www.figma.com/design/ULceZeAR4otGhLXf684Tvo/P%C3%B3sTech-Fase3?node-id=0-1&t=PtnS5sskQRlU3ohO-1
```
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
