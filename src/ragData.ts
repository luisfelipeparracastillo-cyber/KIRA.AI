// Fuentes confiables de salud y bienestar canino (Base de Conocimientos RAG)
export interface RagArticle {
  id: string;
  category: 'nutricion' | 'comportamiento' | 'hidratacion' | 'primeros_auxilios' | 'ejercicio';
  title: string;
  content: string;
  keywords: string[];
  source: string;
}

export const KNOWLEDGE_BASE: RagArticle[] = [
  {
    id: "hidratacion_guia",
    category: "hidratacion",
    title: "Guía Completa de Hidratación en Perros",
    content: "Como regla general, un perro saludable necesita beber entre 50 y 100 ml de agua por cada kilogramo de peso corporal al día. Por ejemplo, un Border Collie de 20 kg debe tomar de 1 a 2 litros diarios. Esto varía según el nivel de actividad, la temperatura ambiental y la alimentación (los perros que comen croquetas secas necesitan más agua que los que comen alimento húmedo). La deshidratación excesiva puede comprometer los riñones y causar fallos orgánicos.",
    keywords: ["agua", "hidratacion", "beber", "liquido", "litros", "ml", "sed"],
    source: "Asociación Mundial de Veterinarios de Pequeños Animales (WSAVA)"
  },
  {
    id: "alimentos_prohibidos",
    category: "nutricion",
    title: "Alimentos Altamente Tóxicos para los Perros",
    content: "Nunca le des a un perro: 1. Chocolate (contiene teobromina, que afecta el corazón y el sistema nervioso). 2. Uvas y pasas (pueden causar fallo renal agudo incluso en pequeñas dosis). 3. Cebolla y ajo (provocan anemia hemolítica). 4. Xilitol (edulcorante que causa una liberación masiva de insulina e hipoglucemia severa). 5. Cafeína. Si consume alguno, acude inmediatamente al veterinario de urgencia.",
    keywords: ["comida", "toxicidad", "veneno", "chocolate", "uvas", "cebolla", "ajo", "comer", "alimento"],
    source: "Veterinary Medicine Association & ASPCA Animal Poison Control"
  },
  {
    id: "golpe_calor",
    category: "primeros_auxilios",
    title: "Prevención y Tratamiento del Golpe de Calor canino",
    content: "El golpe de calor (hipertermia) ocurre rápidamente si la temperatura interna supera los 39.5°C. Síntomas: jadeo excesivo, babeo espeso, encías rojo brillante, debilidad extrema. Tratamiento inmediato: Traslada al perro a la sombra, humedece su cuerpo con agua fresca (nunca helada, ya que provoca vasoconstricción y retira el calor del centro), abanica al animal y ofrécele agua fresca sin forzarlo a beber. Llévalo al veterinario de inmediato.",
    keywords: ["calor", "golpe", "temperatura", "sol", "jadeo", "hipertermia", "verano", "quemaduras"],
    source: "Colegio de Veterinarios de España"
  },
  {
    id: "reactividad_comportamiento",
    category: "comportamiento",
    title: "Manejo de Perros Reactivos en Paseo",
    content: "La reactividad (ladridos, gruñidos o tirarse de la correa al ver otros perros o estímulos) suele provenir del miedo, frustración o sobreestimulación. Enfoque científico: Utiliza el contracondicionamiento y la desensibilización sistemática. Mantén al perro por debajo de su 'umbral de reactividad' (la distancia a la que nota el estímulo pero no reacciona) y premia la visualización tranquila con comida de alto valor. Nunca castigues físicamente el gruñido, ya que eliminarás la señal de advertencia previa a una mordedura.",
    keywords: ["miedo", "reactivo", "ladrido", "gruñir", "tirar corrida", "pelea", "ansiedad", "Kira", "comportamiento"],
    source: "Manual de Comportamiento Canino de KIRA.AI"
  },
  {
    id: "ejercicio_limites",
    category: "ejercicio",
    title: "Límites Saludables de Ejercicio Diario",
    content: "El ejercicio excesivo puede dañar las articulaciones en razas en crecimiento y causar fatiga cardíaca. Razas de alta energía (como Border Collies, Pastores Alemanes) necesitan caminatas estructuradas y estimulación mental de entre 60 y 90 minutos diarios. Razas braquicéfalas (Bulldog Francés, Pug) deben limitar su esfuerzo a sesiones cortas de 20-30 minutos a temperaturas moderadas para evitar colapsos respiratorios.",
    keywords: ["ejercicio", "caminar", "actividad", "cansar", "correr", "cachorro", "articulaciones"],
    source: "Clínicas Veterinarias de Referencia Europea"
  },
  {
    id: "nutricion_basica",
    category: "nutricion",
    title: "Nutrición Óptima y Control de Peso",
    content: "Una dieta balanceada debe contener proteínas animales de alta calidad (pollo, res, pescado), grasas esenciales (ácidos grasos omega-3 y -6 para el pelaje) y carbohidratos digeribles. Evita el sobrepeso midiendo la ración con báscula. El sobrepeso incrementa un 50% el riesgo de artritis, displasia de cadera y acorta la expectativa de vida hasta en 2 años.",
    keywords: ["peso", "dieta", "gordo", "flaco", "comida", "croquetas", "nutricion", "artritis", "cadera"],
    source: "Asociación de Nutrición Animal Comparativa"
  },
  {
    id: "hidratacion_signos_deshidratacion",
    category: "hidratacion",
    title: "Cómo Detectar la Deshidratación",
    content: "Para saber si tu perro está deshidratado: 1. Prueba de elasticidad de la piel (tira suavemente de la piel de la nuca; si tarda en volver a su posición de inmediato, indica deshidratación). 2. Encías secas o pegajosas (en un perro sano deben estar húmedas y resbaladizas). 3. Ojos hundidos o letargo. En estos casos, ofrécele electrolitos aptos para mascotas o agua fresca y contacta a tu veterinario.",
    keywords: ["deshidratacion", "encías secas", "elasticidad piel", "agua", "beber", "enfermo"],
    source: "Federación Veterinaria Internacional"
  }
];

// Simple Text Search Retrieval Algorithm for the RAG prompt
export function retrieveRelevantDocs(query: string, limit: number = 3): RagArticle[] {
  const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Calculate a matching score for each article
  const scored = KNOWLEDGE_BASE.map(article => {
    let score = 0;
    
    // Exact match in title
    const normalizedTitle = article.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedTitle.includes(normalizedQuery)) score += 10;
    
    // Keywords matching
    article.keywords.forEach(keyword => {
      const normKeyword = keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalizedQuery.includes(normKeyword)) {
        score += 5;
      }
    });

    // Content match word by word
    const words = normalizedQuery.split(/\s+/);
    const normContent = article.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    words.forEach(word => {
      if (word.length > 3 && normContent.includes(word)) {
        score += 1;
      }
    });

    return { article, score };
  });

  // Sort by score descending and filter articles with score > 0.
  // If no score matches, we provide the general standard articles as fallback (limit matches).
  const matches = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.article);

  if (matches.length > 0) {
    return matches.slice(0, limit);
  }

  // Fallback return the most popular ones
  return KNOWLEDGE_BASE.slice(0, limit);
}
