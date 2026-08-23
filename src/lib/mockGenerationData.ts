import type { GenerationResponse } from "@/types/generation";

// Your original hardcoded generation sample, reshaped for the real
// confirmed schema: id/company_id/created_at added, variantes wrapped,
// marqueurs_a_completer field name fixed.
export const MOCK_GENERATION_DATA: GenerationResponse = {
  id: "mock-generation-id",
  company_id: "mock-company-id",
  created_at: new Date().toISOString(),
  type_contenu: "etude_de_cas",
  titre_interne:
    "Migration ERP en environnement critique : le cas d'un acteur agroalimentaire",
  brief: {
    sujet: "Accompagnement d'un client agroalimentaire dans sa migration ERP",
    objectif: "expertise",
  },
  variantes: {
    variantes: [
      {
        angle: "Approche technique et sécurisée pour éviter l'interruption de production",
        contenu:
          "Dans l'agroalimentaire, une migration ERP ne tolère aucune improvisation.\n\nUn de nos clients du secteur faisait face à un défi majeur : son ERP, devenu obsolète, menaçait la continuité de sa chaîne de production. Une bascule mal maîtrisée aurait pu entraîner un arrêt coûteux et prolongé.\n\nNotre réponse ? Une migration progressive, module par module, couplée à la mise en place d'un environnement de secours opérationnel. Cette approche a permis de :\n- Maintenir la production en continu pendant toute la durée du projet\n- Limiter les risques techniques liés à la bascule\n- Valider chaque étape avant de passer à la suivante\n\nRésultat : [résultat chiffré].\n\nUne preuve que même les projets ERP les plus critiques peuvent être menés à bien avec une méthodologie adaptée aux enjeux industriels.\n\nVous préparez une migration ERP dans un environnement sensible ? Parlons-en.",
        hashtags: ["#ERP", "#Agroalimentaire", "#TransformationDigitale", "#Industrie", "#ConseilIT"],
        cta: "Échangeons sur vos enjeux de migration ERP [lien à compléter]",
      },
      {
        angle: "Focus sur la méthodologie adaptée aux contraintes industrielles",
        contenu:
          "Quand un ERP devient un risque pour la production, la migration ne peut pas être traitée comme un projet standard.\n\nPour [nom du client], acteur du secteur agroalimentaire, l'obsolescence de son système représentait une menace directe sur sa chaîne de production. L'enjeu ? Éviter tout arrêt, même temporaire.\n\nNotre méthodologie a reposé sur trois piliers :\n- Une analyse préalable des modules critiques pour la production\n- La création d'un environnement de secours garantissant la continuité des opérations\n- Une migration par étapes, avec des tests en conditions réelles avant chaque bascule\n\nCette approche sur-mesure a permis de sécuriser le projet sans compromettre l'activité.\n\nRésultat : [résultat chiffré].\n\nUn exemple concret de notre expertise en accompagnement ERP pour les industries à flux tendus.\n\nBesoin d'une stratégie adaptée à vos contraintes opérationnelles ? Contactez-nous.",
        hashtags: ["#ERPIndustriel", "#ContinuiteOperationnelle", "#ConseilEnTransformation", "#PMEIndustrielles", "#TechnologieCritique"],
        cta: "Découvrez comment sécuriser votre migration ERP [lien à compléter]",
      },
    ],
  },
  marqueurs_a_completer: ["[résultat chiffré]", "[lien à compléter]", "[nom du client]"],
};