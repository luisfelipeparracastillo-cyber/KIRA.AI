import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { retrieveRelevantDocs } from "./src/ragData";

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Lazy-loaded Gemini AI client helper
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// RAG Q&A Assistant Endpoint
app.post("/api/rag", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Por favor, proporciona una pregunta sobre bienestar canino." });
    }

    // Retrieve matching articles from Knowledge Base
    const matchedDocs = retrieveRelevantDocs(question, 3);
    const contextText = matchedDocs
      .map(doc => `[Categoría: ${doc.category}] [Origen confiable: ${doc.source}]\n**${doc.title}**: ${doc.content}`)
      .join("\n\n");

    const prompt = `
Eres KIRA.AI, el asistente virtual experto e inteligente en comportamiento, salud, bienestar canino y adiestramiento de perros.
Tu objetivo principal es responder de manera atenta, detallada y comprensiva en español a la consulta de salud o bienestar del usuario.

Por favor, formula tu respuesta utilizando PRINCIPALMENTE la siguiente información de contexto recopilada de fuentes veterinarias confiables:
-------------------------------------------
${contextText}
-------------------------------------------

PREGUNTA DEL DUEÑO DE LA MASCOTA:
"${question}"

DIRECTRICES PARA LA RESPUESTA:
1. Responde con un tono empático, tranquilizador, profesional y amigable.
2. Organiza tu respuesta en secciones legibles o viñetas cortas si es apropiado.
3. Si la base de conocimientos provista arriba NO cubre completamente la pregunta (por ejemplo, si te preguntan sobre síntomas graves), recomienda amigablemente las medidas inmediatas de primeros auxilios generales pero insiste con firmeza en consultar a un veterinario calificado para un diagnóstico preciso.
4. Indica la fuente de la información al final de forma sutil y elegante (ej. "Fuente consultada: [Origen confiable]").
5. Responde directamente al usuario. No expliques cómo funciona el RAG o el sistema de recuperación de documentos.
`;

    const ai = getGenAIClient();
    if (!ai) {
      // Elegant, rich mockup/fallback when GEMINI_API_KEY is not configured
      const topDoc = matchedDocs[0];
      const answerFallback = `¡Hola! Soy tu asistente KIRA.AI. Actualmente el servidor está operando en modo local fuera de línea (sin API Key). Basándome en nuestra base de datos veterinaria de respaldo en KIRA.AI, aquí tienes información confiable relacionada con tu consulta:

${topDoc ? `**${topDoc.title}**: ${topDoc.content}\n\n*Fuente consultada de respaldo: ${topDoc.source}*` : "Para un óptimo bienestar canino, recuerda asegurar una hidratación adecuada (aproximadamente 50-100ml de agua por kg de peso corporal al día) y vigilar la ingesta de alimentos peligrosos (como chocolate, ajo, cebollas o pasas)."}

*Recomendación:* Si notas síntomas persistentes en tu mascota, es fundamental programar una visita con su veterinario de cabecera. Una vez que configures tu clave API de Gemini en AI Studio, podré darte diagnósticos cognitivos e interactivos de IA más profundos.`;

      return res.json({
        answer: answerFallback,
        sources: matchedDocs.map(d => ({ title: d.title, source: d.source })),
        cached: true
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      answer: response.text,
      sources: matchedDocs.map(d => ({ title: d.title, source: d.source })),
      cached: false
    });

  } catch (error: any) {
    console.error("Error en el servicio RAG de KIRA.AI:", error);
    res.status(500).json({
      error: "Ocurrió un error temporal al procesar su consulta.",
      details: error.message
    });
  }
});

// Start integration with Vite in development
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production build from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`============= KIRA.AI ONLINE =============`);
    console.log(`Puerto de Ingress: http://localhost:${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || "development"}`);
    console.log(`==========================================`);
  });
}

bootstrap().catch(err => {
  console.error("Error bootstrapping the KIRA.AI server:", err);
});
