'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import DarkVeil from '@/components/ui/dark-veil';
import SpotlightCard from '@/components/ui/spotlight-card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Background with WebGL animation */}
      <div className="absolute inset-0">
        <DarkVeil speed={0.5} hueShift={180} />
      </div>

      <div className="relative z-10">
        <div className="animate-fade-in-down">
          <Header />
        </div>
        
        {/* Hero Section - Full Screen */}
        <section className="min-h-screen flex items-center justify-center px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full text-sm font-medium text-foreground shadow-sm animate-hero-scale-in [animation-delay:0.2s] opacity-0" style={{ animationFillMode: 'forwards' }}>
              <span className="text-base">🎉</span>
              <span>Récemment 2024-25 Stage ajoutée</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-foreground [text-shadow:_0_0_40px_rgb(255_255_255_/_50%)] animate-text-glow animate-hero-scale-in [animation-delay:0.4s] opacity-0" style={{ animationFillMode: 'forwards' }}>
              Trouvez l'entreprise de vos rêves pour votre stage
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 animate-fade-in-up [animation-delay:0.6s] opacity-0" style={{ animationFillMode: 'forwards' }}>
              Explorez les entreprises qui ont déjà accueilli des stagiaires de l'UFR Ingémédia. Consultez les emails, les secteurs d'activité et les localités.
            </p>

            {/* CTA */}
            <div className="pt-6 animate-hero-scale-in [animation-delay:0.8s] opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Link href="/maps">
                <div className="relative inline-block p-[3px] rounded-full overflow-hidden animate-pulse-glow">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shine-border blur-[1px]"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine-border blur-md"></div>
                  <button className="relative group px-10 py-5 bg-[#1E3664] text-white font-bold text-xl rounded-full shadow-2xl hover:shadow-[0_20px_60px_rgba(30,54,100,0.5)] transform hover:scale-110 transition-all duration-500 cursor-pointer">
                    <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:w-full transition-all duration-700 ease-out rounded-full"></span>
                    <span className="relative flex items-center gap-3">
                      <span>Découvrir les entreprises</span>
                      <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi StageReminder ?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Recherche rapide', desc: 'Trouvez des entreprises en quelques secondes par ville, domaine ou nom' },
                { title: 'Carte interactive', desc: 'Visualisez toutes les entreprises qui ont déjà accueilli des stagiaires sur une carte du monde' },
                { title: 'Informations détaillées', desc: 'Consultez les emails, les responsables et domaines d\'activité' },
              ].map((feature, i) => (
                <SpotlightCard key={i} spotlightColor="rgba(0, 229, 255, 0.2)">
                  <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.desc}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Infinite Scroll */}
        <section className="py-16 md:py-20 px-4 md:px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center mb-4">Ce que disent nos étudiants</h2>
            <p className="text-center text-foreground/70">Des milliers d'étudiants ont trouvé leur stage grâce à StageReminder</p>
          </div>
          
          <div className="relative">
            <div className="flex gap-6 animate-scroll-left">
              {[
                { name: "Marie L.", promo: "Ingémédia 2024", text: "Grâce à StageReminder, j'ai trouvé mon stage en 2 jours ! La carte interactive m'a permis de visualiser toutes les entreprises proches de chez moi.", avatar: "ML" },
                { name: "Thomas B.", promo: "Ingémédia 2023", text: "Super outil ! J'ai pu contacter directement plusieurs entreprises qui avaient déjà pris des stagiaires. Gain de temps énorme !", avatar: "TB" },
                { name: "Sarah K.", promo: "Ingémédia 2025", text: "L'interface est claire et intuitive. En quelques clics, j'avais une liste complète d'entreprises dans mon domaine.", avatar: "SK" },
                { name: "Lucas M.", promo: "Ingémédia 2024", text: "La recherche par domaine est vraiment pratique. J'ai découvert des entreprises auxquelles je n'aurais jamais pensé !", avatar: "LM" },
                { name: "Emma D.", promo: "Ingémédia 2023", text: "Un must-have pour tout étudiant en recherche de stage. Les informations sont à jour et complètes.", avatar: "ED" },
                { name: "Alexandre P.", promo: "Ingémédia 2024", text: "J'ai apprécié pouvoir voir les emails et responsables directement. Ça m'a fait gagner un temps précieux !", avatar: "AP" },
              ].map((testimonial, i) => (
                <div key={i} className="flex-shrink-0 w-[350px] p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F83975] to-[#44A7E0] flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">{testimonial.promo}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{testimonial.text}</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                { name: "Marie L.", promo: "Ingémédia 2024", text: "Grâce à StageReminder, j'ai trouvé mon stage en 2 jours ! La carte interactive m'a permis de visualiser toutes les entreprises proches de chez moi.", avatar: "ML" },
                { name: "Thomas B.", promo: "Ingémédia 2023", text: "Super outil ! J'ai pu contacter directement plusieurs entreprises qui avaient déjà pris des stagiaires. Gain de temps énorme !", avatar: "TB" },
                { name: "Sarah K.", promo: "Ingémédia 2025", text: "L'interface est claire et intuitive. En quelques clics, j'avais une liste complète d'entreprises dans mon domaine.", avatar: "SK" },
                { name: "Lucas M.", promo: "Ingémédia 2024", text: "La recherche par domaine est vraiment pratique. J'ai découvert des entreprises auxquelles je n'aurais jamais pensé !", avatar: "LM" },
                { name: "Emma D.", promo: "Ingémédia 2023", text: "Un must-have pour tout étudiant en recherche de stage. Les informations sont à jour et complètes.", avatar: "ED" },
                { name: "Alexandre P.", promo: "Ingémédia 2024", text: "J'ai apprécié pouvoir voir les emails et responsables directement. Ça m'a fait gagner un temps précieux !", avatar: "AP" },
              ].map((testimonial, i) => (
                <div key={`dup-${i}`} className="flex-shrink-0 w-[350px] p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F83975] to-[#44A7E0] flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">{testimonial.promo}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{testimonial.text}</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Second row - scrolling right */}
          <div className="relative mt-6">
            <div className="flex gap-6 animate-scroll-right">
              {[
                { name: "Julien R.", promo: "Ingémédia 2024", text: "La base de données est impressionnante ! J'ai trouvé des entreprises dans toute la France.", avatar: "JR" },
                { name: "Camille H.", promo: "Ingémédia 2023", text: "Enfin un outil pensé pour les étudiants ! Plus besoin de chercher pendant des heures.", avatar: "CH" },
                { name: "Maxime V.", promo: "Ingémédia 2025", text: "Les filtres par domaine m'ont permis de cibler exactement ce que je cherchais. Parfait !", avatar: "MV" },
                { name: "Léa F.", promo: "Ingémédia 2024", text: "J'ai recommandé StageReminder à toute ma promo. C'est devenu notre référence !", avatar: "LF" },
                { name: "Hugo N.", promo: "Ingémédia 2023", text: "Interface moderne et rapide. On sent que c'est fait par des étudiants pour des étudiants.", avatar: "HN" },
                { name: "Clara S.", promo: "Ingémédia 2024", text: "Merci pour cet outil gratuit et accessible ! Ça change la vie en période de recherche.", avatar: "CS" },
              ].map((testimonial, i) => (
                <div key={i} className="flex-shrink-0 w-[350px] p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#44A7E0] to-[#103049] flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">{testimonial.promo}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{testimonial.text}</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[
                { name: "Julien R.", promo: "Ingémédia 2024", text: "La base de données est impressionnante ! J'ai trouvé des entreprises dans toute la France.", avatar: "JR" },
                { name: "Camille H.", promo: "Ingémédia 2023", text: "Enfin un outil pensé pour les étudiants ! Plus besoin de chercher pendant des heures.", avatar: "CH" },
                { name: "Maxime V.", promo: "Ingémédia 2025", text: "Les filtres par domaine m'ont permis de cibler exactement ce que je cherchais. Parfait !", avatar: "MV" },
                { name: "Léa F.", promo: "Ingémédia 2024", text: "J'ai recommandé StageReminder à toute ma promo. C'est devenu notre référence !", avatar: "LF" },
                { name: "Hugo N.", promo: "Ingémédia 2023", text: "Interface moderne et rapide. On sent que c'est fait par des étudiants pour des étudiants.", avatar: "HN" },
                { name: "Clara S.", promo: "Ingémédia 2024", text: "Merci pour cet outil gratuit et accessible ! Ça change la vie en période de recherche.", avatar: "CS" },
              ].map((testimonial, i) => (
                <div key={`dup-${i}`} className="flex-shrink-0 w-[350px] p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#44A7E0] to-[#103049] flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-foreground/60">{testimonial.promo}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{testimonial.text}</p>
                  <div className="flex gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="w-[95%] mx-auto bg-[#103049] rounded-full px-8 md:px-12 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Commencer la recherche de stage
                </h2>
                <p className="text-white/80 text-sm md:text-base">
                  Plus de 300 entreprises qui ont déjà accueilli des étudiants d'Ingémédia
                </p>
              </div>
              <Link href="/maps">
                <button className="px-8 py-4 bg-white text-[#103049] font-semibold text-lg rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer whitespace-nowrap">
                  Voir la carte
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 px-4 md:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Questions fréquentes</h2>
            <p className="text-center text-foreground/70 mb-12">
              Tout ce que vous devez savoir sur StageReminder
            </p>
            
            <div className="space-y-4">
              {[
                {
                  question: "Qu'est-ce que StageReminder ?",
                  answer: "StageReminder est une plateforme qui recense toutes les entreprises ayant accueilli des stagiaires de l'UFR Ingémédia. Elle permet de faciliter votre recherche de stage en vous donnant accès aux coordonnées et informations des entreprises partenaires."
                },
                {
                  question: "Comment puis-je rechercher une entreprise ?",
                  answer: "Vous pouvez rechercher des entreprises de trois manières : par ville, par domaine d'activité, ou par nom d'entreprise. Utilisez la carte interactive sur la page /maps pour visualiser toutes les entreprises géographiquement."
                },
                {
                  question: "Les informations sont-elles à jour ?",
                  answer: "Oui, notre base de données est régulièrement mise à jour avec les nouvelles entreprises qui accueillent des stagiaires d'Ingémédia. Vous pouvez voir les ajouts récents directement sur la page d'accueil."
                },
                {
                  question: "Puis-je contacter directement les entreprises ?",
                  answer: "Absolument ! Chaque fiche entreprise contient l'email du responsable (quand disponible) ainsi que les coordonnées de l'entreprise. Vous pouvez les contacter directement pour proposer votre candidature."
                },
                {
                  question: "Le service est-il gratuit ?",
                  answer: "Oui, StageReminder est 100% gratuit et accessible à tous les étudiants d'Ingémédia. Notre objectif est de faciliter votre recherche de stage sans aucun frais."
                },
                {
                  question: "Puis-je ajouter une entreprise qui n'est pas dans la liste ?",
                  answer: "Si vous avez effectué un stage dans une entreprise qui n'est pas répertoriée, contactez l'administration pour qu'elle soit ajoutée à la base de données et profite aux futurs étudiants."
                },
              ].map((faq, i) => (
                <details key={i} className="group bg-white rounded-lg border border-border overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg text-foreground pr-4">{faq.question}</h3>
                    <svg 
                      className="w-5 h-5 text-foreground/60 transition-transform group-open:rotate-180" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 pt-2 text-foreground/70 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
