import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SpeakersProps {
  t: (key: string) => string;
}

interface Speaker {
  name: string;
  title: string;
  affiliation: string;
  photo: string;
}

const speakers: Speaker[] = [
  {
    name: 'Prof. Moshe Y. Vardi',
    title: 'University Professor',
    affiliation: 'Rice University, USA',
    photo: '/images/speakers/6_Moshe_Vardi_Named_2026_NAAI_Academy.png',
  },
  {
    name: 'Prof. Einar Broch Johnsen',
    title: 'Professor',
    affiliation: 'University of Oslo, Norway',
    photo: '/images/speakers/4_Einar_Broch_Johnsen.png',
  },
  {
    name: 'Prof. Kim Guldstrand Larsen',
    title: 'Professor',
    affiliation: 'Aalborg University, Denmark',
    photo: '/images/speakers/2_Kim_Guldstrand_Larsen_Aalborg_Universitets.png',
  },
  {
    name: 'Prof. Bernhard K. Aichernig',
    title: 'Professor',
    affiliation: 'Johannes Kepler University Linz, Austria',
    photo: '/images/speakers/1_Bernhard_AICHERNIG_Associate_Professor.png',
  },
  {
    name: 'Prof. Emily Yu',
    title: 'Assistant Professor',
    affiliation: 'Leiden University, Netherlands',
    photo: '/images/speakers/8_Myunggyo_Emily_Yu_Retail_Management.png',
  },
  {
    name: 'Prof. Joseph Sifakis',
    title: 'Professor, Turing Award Laureate',
    affiliation: 'Verimag / EPFL, France/Switzerland',
    photo: '/images/speakers/5_Joseph_Sifakis_A_M_Turing_Award_Laureat.png',
  },
  {
    name: 'Prof. Wei Dong',
    title: 'Professor',
    affiliation: 'National University of Defense Technology, China',
    photo: '/images/speakers/6_Asst_Prof_Wei_Dong_Academic_Profile.png',
  },
  {
    name: 'Prof. Miaomiao Zhang',
    title: 'Professor',
    affiliation: 'Tongji University, China',
    photo: '/images/speakers/2_Miaomiao_Zhang.png',
  },
  {
    name: 'Prof. Jonathan P. Bowen',
    title: 'Emeritus Professor',
    affiliation: 'London South Bank University, UK',
    photo: '/images/speakers/3_Jonathan_Bowen_Formal_Methods_Wiki.png',
  },
];

export default function Speakers({ t }: SpeakersProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll('.speaker-card');
    const tl = gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, stagger: 0.06, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
      }
    );
    return () => { tl.kill(); };
  }, []);

  return (
    <section id="speakers" ref={sectionRef} className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="animate-in text-[11px] font-bold tracking-[0.2em] text-[#005C99] uppercase mb-2">
            {t('speakersSubtitle')}
          </p>
          <h2 className="section-title">{t('invitedSpeakers')}</h2>
          <div className="w-12 h-1 bg-[#005C99] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {speakers.map((speaker) => (
            <div
              key={speaker.name}
              className="speaker-card group cursor-pointer"
              onClick={() => navigate(`/courses?speaker=${encodeURIComponent(speaker.name)}`)}
            >
              <div className="relative overflow-hidden bg-slate-200 aspect-[3/4]">
                <img
                  src={speaker.photo}
                  alt={speaker.name}
                  className="w-full h-full object-cover saturate-[0.65] group-hover:saturate-100 transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-[9px] font-bold tracking-[0.15em] text-white/60 uppercase">
                    {speaker.affiliation}
                  </p>
                  <h3 className="text-[12px] sm:text-[13px] font-semibold text-white leading-tight mt-0.5">
                    {speaker.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-[12px] text-slate-500">
          {t('speakersDetail')}
        </p>
      </div>
    </section>
  );
}