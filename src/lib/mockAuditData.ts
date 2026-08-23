import type { AuditResponse } from "@/types/audit";
import type { Recommendation } from "@/types/recommendation";

// Full sample audit — your original hardcoded data (DataCorp International
// / Alexandre Chen), reshaped to match the real backend's flat response
// (score_global etc. top-level, no nested "score" object) and with
// recommendations split out as their own array, matching how the real
// backend actually returns them.
export const MOCK_AUDIT_DATA: AuditResponse = {
  id: "mock-audit-id",
  company_id: "mock-company-id",
  score_global: 83,
  score_entreprise: 75,
  score_dirigeant: 100,
  dirigeant_present: true,
  created_at: new Date().toISOString(),
  score_detail: {
    sous_scores_categories: [
      {
        code: "page_entreprise",
        libelle: "Page entreprise",
        obtenu: 15,
        max: 16,
        pourcentage: 94,
        evaluee: true,
      },
      {
        code: "activite_engagement",
        libelle: "Activité et engagement",
        obtenu: 0,
        max: 4,
        pourcentage: 0,
        evaluee: true,
      },
      {
        code: "dirigeant",
        libelle: "Profil du dirigeant",
        obtenu: 13,
        max: 13,
        pourcentage: 100,
        evaluee: true,
      },
      {
        code: "coherence",
        libelle: "Cohérence dirigeant/entreprise",
        obtenu: 2,
        max: 2,
        pourcentage: 100,
        evaluee: true,
      },
    ],
  },
  analyse_ia: {
    evaluations: [
      {
        categorie: "page_entreprise",
        critere: "slogan",
        niveau: "2",
        preuve: "Leading the data revolution across industries",
        justification:
          "Le slogan est clair, professionnel et valorise la proposition de valeur de l'entreprise en mettant en avant son leadership dans la révolution data.",
      },
      {
        categorie: "page_entreprise",
        critere: "description_entreprise",
        niveau: "3",
        preuve:
          "DataCorp International est un acteur global de la transformation data. Nous accompagnons les grandes entreprises dans leur stratégie data, de la collecte à la valorisation, avec des solutions d'intelligence artificielle, de business intelligence et de gouvernance à grande échelle. Présents dans 15 pays, nous servons les secteurs de la finance, de l'industrie et de la distribution.",
        justification:
          "La description est structurée et contient l'activité, la cible client, la proposition de valeur, les éléments différenciants et des mots-clés pertinents.",
      },
      {
        categorie: "page_entreprise",
        critere: "services",
        niveau: "2",
        preuve:
          "Stratégie data, Intelligence artificielle, Business intelligence, Gouvernance de données, Formation data",
        justification:
          "Les services sont clairement expliqués et leur valeur pour les clients est identifiable.",
      },
      {
        categorie: "page_entreprise",
        critere: "seo_mots_cles",
        niveau: "2",
        preuve: "Data Strategy, IA, BI, Data Governance, Big Data",
        justification:
          "Les mots-clés sont pertinents et liés au secteur, intégrés naturellement dans les spécialités de l'entreprise.",
      },
      {
        categorie: "page_entreprise",
        critere: "publications_entreprise",
        niveau: "2",
        preuve:
          "Notre rapport annuel sur l'état de la maturité data des entreprises européennes est disponible. Retour sur notre conférence data de Paris.",
        justification:
          "Les publications sont professionnelles et adaptées à l'activité de l'entreprise, démontrant une expertise dans le domaine data.",
      },
      {
        categorie: "dirigeant",
        critere: "titre_dirigeant",
        niveau: "2",
        preuve:
          "CEO & Founder at DataCorp International | Keynote speaker | Data strategy for Fortune 500",
        justification:
          "Le titre est précis et valorise l'expertise du dirigeant en mettant en avant son rôle, ses compétences et sa cible.",
      },
      {
        categorie: "dirigeant",
        critere: "resume_dirigeant",
        niveau: "3",
        preuve:
          "Serial entrepreneur in the data space. J'ai fondé DataCorp en 2008 avec la conviction que la data allait transformer chaque industrie. Aujourd'hui, nous accompagnons plus de 400 grandes entreprises dans le monde. Ancien consultant en stratégie, diplômé de Polytechnique, je partage régulièrement mes analyses sur l'avenir de l'IA en entreprise.",
        justification:
          "Le résumé est structuré et contient l'expertise, les réalisations, la vision et la proposition de valeur du dirigeant.",
      },
      {
        categorie: "dirigeant",
        critere: "experience_dirigeant",
        niveau: "2",
        preuve:
          "Direction générale, vision stratégique, développement international sur 15 pays. Conseil en stratégie pour des clients du secteur financier.",
        justification:
          "L'expérience est détaillée et cohérente avec l'activité de l'entreprise, mettant en avant des rôles pertinents et des réalisations significatives.",
      },
      {
        categorie: "dirigeant",
        critere: "competences_dirigeant",
        niveau: "2",
        preuve:
          "Data Strategy, Leadership, Artificial Intelligence, Public Speaking, Business Development, Entrepreneurship, Management",
        justification:
          "Les compétences sont pertinentes et cohérentes avec le domaine d'activité de l'entreprise et le rôle du dirigeant.",
      },
      {
        categorie: "dirigeant",
        critere: "publications_dirigeant",
        niveau: "2",
        preuve:
          "3 tendances IA que tout dirigeant devrait suivre en 2026. Mon analyse après avoir échangé avec des dizaines de CEO cette année.",
        justification:
          "La publication est professionnelle et démontre une expertise dans le domaine de l'IA et du leadership.",
      },
      {
        categorie: "coherence",
        critere: "coherence_dirigeant_entreprise",
        niveau: "2",
        preuve:
          "Serial entrepreneur in the data space. J'ai fondé DataCorp en 2008 avec la conviction que la data allait transformer chaque industrie. DataCorp International est un acteur global de la transformation data.",
        justification:
          "Il existe une forte cohérence entre l'expertise du dirigeant, sa communication personnelle et le positionnement de l'entreprise.",
      },
    ],
    points_forts: [
      "Description d'entreprise très complète et structurée, couvrant tous les aspects clés (activité, cible, proposition de valeur, différenciation).",
      "Slogan percutant et professionnel qui renforce le positionnement de leader dans le domaine data.",
      "Services bien détaillés et alignés avec les spécialités de l'entreprise.",
      "Mots-clés SEO pertinents et intégrés naturellement.",
      "Publications de l'entreprise et du dirigeant démontrant une expertise solide et une ligne éditoriale cohérente.",
      "Profil du dirigeant très bien construit, avec un titre précis, un résumé détaillé et des compétences alignées avec l'activité de l'entreprise.",
      "Forte cohérence entre le profil du dirigeant et l'entreprise, renforçant la crédibilité et l'expertise perçue.",
    ],
    points_faibles: [
      "Les publications de l'entreprise pourraient être plus variées et approfondies pour mieux illustrer l'expertise sectorielle.",
      "Le contenu des publications du dirigeant, bien que pertinent, pourrait être plus régulier pour maintenir l'engagement.",
    ],
    synthese:
      "La présence LinkedIn de DataCorp International et de son dirigeant Alexandre Chen est globalement excellente, avec une stratégie de personal branding et de communication d'entreprise bien alignée. La description de l'entreprise est complète, les services sont clairement présentés, et les mots-clés SEO sont pertinents. Le profil du dirigeant est très professionnel, avec une forte cohérence entre son expertise et l'activité de l'entreprise.",
  },
};

// Recommendations are now a separate entity — this is the mock fallback
// for GET /api/ai/audits/{id}/recommendations.
export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "mock-rec-1",
    audit_id: "mock-audit-id",
    critere_code: "publications_entreprise",
    categorie: "page_entreprise",
    priorite: "OPTIMISATION",
    action:
      "Diversifier les formats de publications (vidéos, infographies, études de cas) pour enrichir le contenu et mieux illustrer l'expertise.",
    raison:
      "Cela permettrait de capter davantage l'attention des abonnés et de démontrer concrètement la valeur des solutions proposées.",
  },
  {
    id: "mock-rec-2",
    audit_id: "mock-audit-id",
    critere_code: "publications_dirigeant",
    categorie: "dirigeant",
    priorite: "OPTIMISATION",
    action:
      "Augmenter la fréquence des publications du dirigeant pour renforcer sa visibilité et son leadership d'opinion.",
    raison:
      "Un rythme de publication plus soutenu permettrait de maintenir un engagement élevé et de positionner le dirigeant comme une référence dans le domaine.",
  },
  {
    id: "mock-rec-3",
    audit_id: "mock-audit-id",
    critere_code: "description_entreprise",
    categorie: "page_entreprise",
    priorite: "IMPORTANTE",
    action:
      "Ajouter des témoignages clients ou des études de cas dans la description de l'entreprise et les publications.",
    raison:
      "Cela renforcerait la crédibilité et illustrerait concrètement l'impact des solutions proposées par DataCorp International.",
  },
];