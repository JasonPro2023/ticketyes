<div align="center">

# 🎫 TicketYes

### Clasificador inteligente de tickets de soporte con Machine Learning

[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933)]()
[![Python](https://img.shields.io/badge/python-%3E%3D3.11-3776AB)]()

</div>

---

## 🧠 ¿Qué es TicketYes?

**TicketYes** es una aplicación web full-stack que ayuda a empresas a **clasificar automáticamente tickets de soporte** usando Machine Learning. El sistema analiza el texto del ticket, predice la categoría y el nivel de urgencia, y lo asigna al equipo correcto.

### 🎯 Problema que resuelve

Empresas reciben cientos o miles de tickets de soporte al día. Clasificarlos manualmente es:
- ⏱️ Lento
- 💸 Costoso
- ❌ Propenso a errores humanos
- 😤 Genera tiempos de respuesta altos

TicketYes automatiza esta clasificación, permitiendo respuestas más rápidas y mejor enrutamiento.

---

## 🏗️ Arquitectura

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│   Frontend  │ ───> │  Backend API │ ───> │  ML Service    │
│  React+TS   │ <─── │  Node+TS     │ <─── │  Python+FastAPI │
└─────────────┘      └──────┬───────┘      └────────────────┘
                            │
                    ┌───────▼────────┐
                    │   PostgreSQL   │
                    │   (Prisma)     │
                    └────────────────┘
```

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Backend** | Node.js 20, Express, TypeScript, Prisma ORM |
| **Base de datos** | PostgreSQL |
| **ML Service** | Python 3.11+, FastAPI, scikit-learn, NLTK |
| **Autenticación** | JWT |
| **Deploy** | Vercel (FE) + Render (BE/ML) + Neon (DB) |

---

## 📂 Estructura del proyecto

```
ticketyes/
├── backend/          # API REST con Node + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── prisma/
│   │   ├── utils/
│   │   ├── config/
│   │   └── index.ts
│   └── tests/
├── frontend/         # SPA con React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── contexts/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── public/
├── ml-service/       # Servicio de ML con Python + FastAPI
│   ├── app/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── main.py
│   ├── notebooks/    # Jupyter notebooks de experimentación
│   └── tests/
└── docs/             # Diagramas, capturas, ER
```

---

## 🚀 Roadmap

- [x] Setup inicial del proyecto
- [ ] Backend: autenticación con JWT
- [ ] Backend: CRUD de tickets
- [ ] ML: modelo clasificador (Naive Bayes)
- [ ] ML: endpoint de predicción
- [ ] Frontend: dashboard de tickets
- [ ] Frontend: formulario de creación
- [ ] Frontend: visualización de predicciones
- [ ] Deploy completo en producción
- [ ] CI/CD con GitHub Actions

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

<div align="center">

Construido con 💙 por [Ivan Alejandro Hernández Regino](https://github.com/JasonPro2023)

</div>
