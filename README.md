# UrbanoRJ 📍

App mobile feito em React Native (Expo) pra registrar e acompanhar problemas urbanos no Rio de Janeiro, como buracos, postes apagados, focos de dengue e afins.

---

## 👥 Integrantes

- Nome Fabrizio Moreira De Andrade Brucker — Matrícula: 202402543822


---

## 🚨 O problema que o app resolve

Quem mora no Rio sabe como é: buraco na rua que fica meses sem conserto, poste apagado que vira ponto de assalto, terreno abandonado com foco de dengue. A população não tem um canal fácil e direto pra registrar essas situações e acompanhar se alguém resolveu.

O **UrbanoRJ** permite que qualquer morador faça esse registro com foto, localização GPS e descrição detalhada. Outros moradores podem confirmar o problema votando nele, o que ajuda a mostrar prioridade. O status vai de *Aberto* → *Em Andamento* → *Resolvido*.

---

## ✅ Requisitos técnicos

| Item | Como foi feito |
|------|----------------|
| React Native + Expo | Expo SDK 51 |
| React Navigation | Stack Navigator + Bottom Tab Navigator |
| Persistência local | AsyncStorage (funciona offline) |
| Criar | Formulário de nova denúncia |
| Ler | Lista com filtros de status e categoria + busca por texto |
| Atualizar | Edição de título, descrição e status |
| Deletar | Botão de excluir com confirmação |

---

## 📱 Telas do app

- **Lista de denúncias** – busca, filtros, FAB pra nova denúncia
- **Nova denúncia** – formulário com categoria, GPS, câmera/galeria
- **Detalhes** – ver, editar, mudar status, votar, deletar
- **Estatísticas** – resumo geral com barras de progresso por categoria
- **Sobre** – informações do app e do projeto

---

## 🚀 Como rodar

Precisa ter Node.js instalado e o app **Expo Go** no celular.

```bash
# clona o repositório
git clone https://github.com/SEU_USUARIO/urbanorj.git
cd urbanorj

# instala as dependências
npm install

# inicia o servidor
npx expo start
```

Abre o **Expo Go** no celular e escaneia o QR code que aparecer no terminal.

> Na primeira vez que abrir o app, já carrega 5 denúncias de exemplo automaticamente.

---

## 📁 Estrutura de pastas

```
urbanorj/
├── App.js
├── src/
│   ├── database/db.js         # CRUD com AsyncStorage
│   ├── navigation/            # Configuração das rotas
│   ├── screens/               # Telas do app
│   ├── components/            # Componentes reutilizáveis
│   └── theme.js               # Cores e constantes
```

---

## 🛠️ Tecnologias

- React Native / Expo
- React Navigation (Stack + Bottom Tabs)
- AsyncStorage
- Expo Location
- Expo Image Picker
- @expo/vector-icons (Ionicons)
