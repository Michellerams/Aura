# ✨ Aura: AI Fundamentals Chatbot

**Aura** is an interactive AI educational chatbot designed to serve as a friendly and knowledgeable assistant for learning the fundamentals of **Artificial Intelligence**.  
Built with modern web technologies, it leverages the power of **Google’s Gemini 2.5 Flash model** to provide real-time, streaming responses.

---

## 🚀 Overview & Technology Stack

This project is a single-page application built for **speed**, **scalability**, and a great **user experience**, focusing on a real-time, streaming chat interface.

| **Category** | **Key Technologies** | **Description** |
|---------------|----------------------|-----------------|
| **AI Model** | Google Gemini 2.5 Flash | The core intelligence providing fast, high-quality responses. |
| **API SDK** | `@google/genai` (npm package) | Used for seamless integration with the Gemini API. |
| **Frontend** | React, TypeScript, Tailwind CSS | A modern, scalable component-based architecture with strong typing and utility-first styling. |
| **Build Tool** | Vite | Next-generation frontend tooling for a fast development experience. |
| **Input Feature** | Web Speech API | Enables Speech-to-Text functionality for hands-free interaction. |
| **Deployment** | Vercel | Provides a seamless CI/CD pipeline and global deployment. |

---

## 💡 User Interaction & Data Flow

Aura follows a **simple, unidirectional data flow model**, ensuring a responsive and smooth user experience.

1. **User Action** – The user enters text or uses the Speech-to-Text feature to submit a prompt.  
2. **State Update** – The input is sent to the central `App` component for state management.  
3. **API Call** – The `App` component triggers `geminiService.ts` to send the prompt to the Gemini API.  
4. **Streaming Response** – `geminiService.ts` receives the response in small chunks (streaming response chunks).  
5. **Real-time Rendering** – The `App` component updates the application state and the `ChatWindow` component renders the new message chunks in real-time, creating a smooth "typing" effect.

---

## 🛠️ API Integration (Google Gemini)

The intelligence of **Aura** is powered by the **Gemini 2.5 Flash** model, accessed securely via the official SDK.

