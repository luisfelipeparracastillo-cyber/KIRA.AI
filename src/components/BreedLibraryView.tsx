import { useState } from 'react';
import { Search, Filter, Shield, Bolt } from 'lucide-react';

interface BreedItem {
  id: string;
  name: string;
  category: 'Compañía' | 'Trabajo' | 'Pastoreo' | 'Miniatura' | 'Guardián' | 'Rastreador';
  description: string;
  imageUrl: string;
  energy: boolean;
  prey: boolean;
  territorial: boolean;
  traits: string[];
}

export default function BreedLibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const breeds: BreedItem[] = [
    {
      id: 'golden',
      name: 'Cobrador Dorado (Golden)',
      category: 'Compañía',
      description: 'Paciente, extremadamente sociable y ansioso por complacer. Ideal para familias y dueños primerizos.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBexZhramEbGmJcc32wye1MPic-zlLoNYfCzYCIgyAcnfujB_tV8oh5wM7vQ-hyY-2-UVjjVjXqeOLvobYub4ZIz4-XsNDMejlNCR2mZWOlh9JBOME_x7hDDk7tBqHyZPO09gBRO7666e3oeo7GGC2ivNP8_Zx5k52zphmzxOT9axLJn_3rUVbAeCbcyNPbLnrAfkNPWPFpt__5XPGDM8QapicqLr6y1q9eWRtPRiAd6zUJtUvTUJl-6hPyXEH9ZRa5G5E3K7hpL0T-',
      energy: true,
      prey: false,
      territorial: false,
      traits: ['Sociable', 'Dócil', 'Bajo Impulso Presa']
    },
    {
      id: 'doberman',
      name: 'Dóberman',
      category: 'Trabajo',
      description: 'Alerta, profundamente leal y sumamente inteligente. Requiere un liderazgo firme y socialización temprana.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJiLu45igiaqSHrwPZBG05SPU98UoM0xiz9kCcmV8b6z7ON0i7u_J7fOgkfRLYlSgP9Xukx3TFnx0Uiu1NpU1U9ByYNvQBgDBNT0ljsNL1MB3gbTzSx8lvSzNWcm_cRncHl-dShV2hZRdW7Q3EjUwnJd1BTJUpOe-w7s2haPwXNFY8PV38o9Q0tWYPBaXvuXZ9H-WGK1_Y7yvA-tlgubSCWsmbcisx1oL2S_4sOus9zK7ADjAtAnaMJYooegDaeMSzSgNsUAq10Rxj',
      energy: true,
      prey: false,
      territorial: true,
      traits: ['Protector', 'Vigilante', 'Alta Energía']
    },
    {
      id: 'collie',
      name: 'Border Collie',
      category: 'Pastoreo',
      description: 'Foco de atención desbordante, agilidad innata y un impulso infatigable. Los retos y juegos de estimulación son indispensables.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBfCm3y2Cg7kCob4mEQaQvZfMv3CmGnlAWOXTqigQx-uX273ScbtutMVhVxIryRBjch3ynxi38NM7Irk4DT4L_cOhPLQdTjv4Iq6CTPZzNSX0WNkA-L-5Rhc6EfFfPeS4zXGkIDBFrJxH4C9wyOcd9SZpFGl6GJn_k1yCv9FRlZKGtJ4LX-eYaz0TnLj82rEisibiAMmeO3wCD1wKRolJZZM5Ns6pS5oybEI7LZlBMulb6c7DXEUNsjPeB6tCJOeDukWCxDAbmTD44',
      energy: true,
      prey: true,
      territorial: false,
      traits: ['Hiper-Focalizado', 'Agilidad', 'Intelectual']
    },
    {
      id: 'frenchie',
      name: 'Bulldog Francés',
      category: 'Miniatura',
      description: 'Afectuoso, juguetón y encantador. Sumamente adaptable a la vida en departamentos urbanos.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCj04hq2QOzRo_VSV0g0fo-dRDbaHmiU655fdXa7wA2aFnP8txVOgg81gvGza5eUdawyfmWfL0UUo79uqXCqhZN_6EIAGWMspD8wNpXHb-y459cbxdLZ6U5xjH1pKUIuZW2cezj3wjYROTqse2sr_SAnoAFMTXBwm9GzXUcStzzo6ueagnCs3FKti1wevFE-sUm65Zo8wge0C_gEE3FMnwZ5ZWdj2g8o2uCptJns3tqzc9-JyPiMfDu4j5XrWCDdj7dZdASNYLV7O7D',
      energy: false,
      prey: false,
      territorial: false,
      traits: ['Tranquilo', 'Braquicéfalo', 'Baja Energía']
    },
    {
      id: 'g_shepherd',
      name: 'Pastor Alemán',
      category: 'Guardián',
      description: 'Valiente, vigilante y extraordinariamente dotado para tareas de obediencia, rescate y protección familiar.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmgQNCKpcLIlwJ8AJPuYdglEz5PnUVe617GPo4nJPZd--fD8LoA6SDA_jNlBIDJhy1HBP6SKcRzL5ICXJCH3xeEfozX3kHpa4Ctkg89rB-JnM3vuuLKupJbNkWQV1cTJgkRJgYORvJa7smx6r9ZcRYRHANedAsVhgEO9_3eFoCC6n4HDMNthnBST_6bVH-roOSjkhJHPOq8PzVR8Zbras1zcW1IosgFbFt1KfTpJsX3x8UFcSzThg0W3cie9F6Tt_RY1jhx-PUCWMI',
      energy: true,
      prey: false,
      territorial: true,
      traits: ['Leal', 'Entrenable', 'Alta Alerta']
    },
    {
      id: 'beagle',
      name: 'Beagle',
      category: 'Rastreador',
      description: 'De temperamento dulce, explorador inalcanzable y guiado eternamente por su poderoso sentido del olfato.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK25jrDo1S-Tpl-fy8jPGzeuDU_qXoLU3HNrzMyiDKlET8cHFsVhAACp4r-m1MAXmGCjCDd-S4pa0h9CH05xQsyVK_yZlx_U5RqYi5R8tCpylhA_vyvYh34-rqlXmfrAbygnNKWjc40VAsBLlyt_8xcuAv1_3hIGZ0EPH9JH8aKlnojP2sElwMlDwSLtFAfOisULT69fvDdimQVSZASlxTG1b6SQ-ys4xDZztoeVS5xA3_WOPMJiRW7qYxs61NKbA-_RfKHZazxWvF',
      energy: false,
      prey: true,
      territorial: false,
      traits: ['Olpeis', 'Curioso', 'Ladrador']
    }
  ];

  const filteredBreeds = breeds.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.traits.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'high_energy') return matchesSearch && b.energy;
    if (activeCategory === 'low_prey') return matchesSearch && !b.prey;
    if (activeCategory === 'apartment') return matchesSearch && b.category === 'Miniatura';
    if (activeCategory === 'guardians') return matchesSearch && b.territorial;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Headings */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold font-headline-lg text-[#006c49]">
          Biblioteca de Razas y Genética Canina
        </h2>
        <p className="text-[#3c4a42] text-lg max-w-3xl">
          Comprende el temperamento y predisposición genética de tu compañero. Cada perfil está elaborado por analistas de comportamiento y veterinarios.
        </p>
      </div>

      {/* Search and Quick Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c7a71] w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por raza o característica..."
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white border-2 border-transparent focus:border-[#006c49] outline-none shadow-sm text-sm text-[#0b1c30] transition-colors"
            />
          </div>
          <button className="w-full md:w-auto px-8 py-4 bg-[#006c49] hover:bg-[#10b981] text-white rounded-full font-bold shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer">
            <Filter className="w-4 h-4" /> Filtrar Comportamientos
          </button>
        </div>

        {/* Category chip selectors */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todas las Razas' },
            { id: 'high_energy', label: 'Alta Energía' },
            { id: 'low_prey', label: 'Bajo Impulso de Presa' },
            { id: 'apartment', label: 'Apto para Departamentos' },
            { id: 'guardians', label: 'Línea de Guardia / Territorial' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#10b981] text-white shadow-sm'
                  : 'bg-white text-[#3c4a42] border border-[#bbcabf]/30 hover:bg-[#f8f9ff]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.map((breed) => (
          <article
            key={breed.id}
            className="group bg-white p-4 rounded-3xl shadow-sm border border-[#e5eeff] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image banner */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
                <img
                  src={breed.imageUrl}
                  alt={breed.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#0b1c30]">
                  {breed.category}
                </span>
              </div>

              {/* Breed details */}
              <div className="px-1 space-y-3">
                <h3 className="text-xl font-extrabold text-[#0b1c30]">{breed.name}</h3>
                <p className="text-xs text-[#3c4a42] leading-relaxed line-clamp-3">{breed.description}</p>
                
                {/* Custom tags/traits */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {breed.traits.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-[#f8f9ff] text-[#465e8e] text-[10px] font-bold border border-[#e5eeff]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trait Matrix indices */}
            <div className="flex justify-between items-center bg-[#f8f9ff] rounded-2xl p-4 mt-6 border border-[#e5eeff]">
              <div className="flex flex-col items-center gap-1">
                <Bolt className={`w-5 h-5 ${breed.energy ? 'text-[#10b981] fill-[#10b981]' : 'text-[#6c7a71]/40'}`} />
                <span className="text-[10px] text-[#6c7a71] font-black uppercase tracking-widest">Energía</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <span className={`text-lg leading-none select-none ${breed.prey ? 'opacity-100' : 'opacity-20 filter grayscale'}`}>🐾</span>
                <span className="text-[10px] text-[#6c7a71] font-black uppercase tracking-widest">Presa</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Shield className={`w-5 h-5 ${breed.territorial ? 'text-[#465e8e] fill-[#465e8e]' : 'text-[#6c7a71]/40'}`} />
                <span className="text-[10px] text-[#6c7a71] font-black uppercase tracking-widest">Alerta</span>
              </div>
            </div>
          </article>
        ))}

        {filteredBreeds.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#6c7a71]">
            <p className="text-lg font-bold">No se encontraron razas que coincidan con la búsqueda.</p>
            <button
              onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
              className="mt-4 px-6 py-2 bg-[#006c49] text-white font-bold rounded-full cursor-pointer hover:bg-[#10b981]"
            >
              Borrarfiltros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
