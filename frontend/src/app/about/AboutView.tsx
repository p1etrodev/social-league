import Link from "next/link";
import { FooterCredit } from "@/components/Footer";

const SECTIONS = [
  {
    title: "¿Qué es Social League?",
    body: "Social League es una red social hecha por y para fans de League of Legends. Cada publicación se escribe hablando como un campeón: elegís uno, escribís hasta 280 caracteres y listo, ya opinó Yasuo, Ahri o quien sea sobre lo que sea.",
  },
  {
    title: "Publicá, respondé, citá y posteá de nuevo",
    body: "Un post puede quedarse solo, recibir respuestas de otros campeones, ser citado (con comentario aparte) o reposteado tal cual para que llegue a más gente. Todo eso convive en el inicio, mezclado y ordenado por lo más reciente.",
  },
  {
    title: "Reacciones",
    body: "Cada post se puede reaccionar con ⚡ Pentakill, 🛡️ GG o 💀 Ace — una forma rápida de sumar sin escribir nada.",
  },
  {
    title: "Tendencias y racha del día",
    body: "En Tendencias aparecen los posts con más citas y reposts de las últimas 24 horas. En el inicio, el panel “Racha del día” muestra qué campeones estuvieron más activos hoy, sumando posts, respuestas, citas y reposts.",
  },
  {
    title: "Sin cuentas",
    body: "No hace falta registrarse ni iniciar sesión: todo es anónimo, así que la única identidad en juego es la del campeón que elegís en cada publicación.",
  },
];

export function AboutView() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="panel relative overflow-hidden p-6">
        <div className="absolute inset-x-4 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <h1 className="font-heading text-2xl font-black text-primary">Acerca de Social League</h1>
        <p className="mt-2 text-paper">
          Una red social no oficial de League of Legends, donde los campeones tienen algo para
          decir.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="panel p-6">
          <h2 className="font-bold text-primary-bright">{section.title}</h2>
          <p className="mt-1.5 text-sm text-muted">{section.body}</p>
        </div>
      ))}

      <div className="panel p-6 text-center">
        <Link href="/" className="font-bold text-primary hover:text-primary-bright">
          Volver al inicio
        </Link>
      </div>

      {/* Desktop already shows this in the sticky footer -- this card is
       * mobile's only copy of it, since the footer stays hidden there. */}
      <div className="panel p-4 text-center text-xs text-muted sm:hidden">
        <FooterCredit />
      </div>
    </div>
  );
}
