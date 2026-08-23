import type { OptimisationResponse } from "@/types/optimization";

// Your original hardcoded optimization sample, reshaped to match the real
// backend's confirmed response fields (id, recommendation_id, decision,
// contenu_final, created_at added; variantes wrapped per the real dict shape).
export const MOCK_OPTIMIZATION_DATA: OptimisationResponse = {
  id: "mock-optimization-id",
  recommendation_id: "mock-rec-1",
  type_element: "slogan",
  contenu_original: "",
  contexte_entreprise: null,
  decision: null,
  contenu_final: null,
  created_at: new Date().toISOString(),
  faiblesses_corrigees: [
    "Absence totale de contenu initial",
    "Manque de clarté sur le secteur d'activité",
    "Absence de proposition de valeur",
    "Cible client non définie",
    "Positionnement inexistant",
  ],
  variantes: {
    variantes: [
      {
        angle: "orienteexpertisetechnique",
        contenu:
          "Nexalys Conseil accompagne les entreprises dans l'optimisation de leurs processus métiers grâce à l'intégration d'ERP performants.\n\nNotre expertise couvre l'ensemble du cycle d'intégration : analyse des besoins, paramétrage, déploiement et formation des équipes.\n\nNous intervenons auprès de [secteursclientsprincipaux] pour leur permettre de gagner en efficacité opérationnelle, en visibilité sur leurs données et en agilité.\n\nNotre approche sur-mesure garantit des solutions alignées avec vos enjeux business et vos contraintes techniques.",
        explication:
          "Cette variante met en avant l'expertise technique de Nexalys Conseil en détaillant les étapes clés de l'intégration ERP. Elle cible les décideurs IT et opérationnels en soulignant les bénéfices concrets (efficacité, visibilité, agilité). Les mots-clés comme 'intégration ERP', 'processus métiers' et 'déploiement' sont intégrés naturellement pour le référencement.",
      },
      {
        angle: "orientebnficesclients",
        contenu:
          "Chez Nexalys Conseil, nous transformons vos défis opérationnels en opportunités grâce à des solutions ERP adaptées.\n\nQue vous soyez une PME en croissance ou un groupe international, notre mission est de simplifier votre gestion quotidienne, d'automatiser vos processus et de vous fournir des données fiables pour prendre des décisions claires.\n\nAvec [nombredannesdexprience] années d'expérience dans l'intégration ERP, nous avons aidé [nombredeclients] entreprises :\n- Réduire leurs coûts opérationnels ;\n- Accélérer leurs délais de traitement ;\n- Améliorer la collaboration entre services.\n\nNotre engagement : des résultats mesurables, sans perturbation de votre activité.",
        explication:
          "Cette variante adopte une approche centrée sur les bénéfices clients, en listant des résultats concrets (réduction des coûts, accélération des délais). Elle utilise un ton engageant et rassurant, idéal pour les dirigeants et responsables opérationnels. Les mots-clés comme 'solutions ERP', 'automatisation' et 'décisions claires' sont intégrés pour renforcer la visibilité.",
      },
      {
        angle: "orienteconfianceet proximit",
        contenu:
          "Nexalys Conseil, c'est avant tout une équipe de passionnés dédiée à la réussite de vos projets ERP.\n\nNous croyons que la technologie doit servir vos ambitions, pas les complexifier. C'est pourquoi nous privilégions une relation de proximité, basée sur l'écoute et la transparence, pour vous proposer des solutions ERP qui s'intègrent parfaitement à votre organisation.\n\nNotre méthode :\n1. Comprendre vos enjeux spécifiques ;\n2. Co-construire une solution sur-mesure ;\n3. Vous accompagner jusqu'à l'adoption totale par vos équipes.\n\nParce que chaque entreprise est unique, nous adaptons notre expertise à vos besoins, et non l'inverse.",
        explication:
          "Cette variante mise sur la relation client et la proximité, en insistant sur l'écoute et la co-construction. Elle est particulièrement adaptée pour les entreprises recherchant un partenaire de confiance plutôt qu'un simple prestataire. Les mots-clés comme 'projets ERP', 'solutions sur-mesure' et 'accompagnement' sont utilisés pour capter l'attention des décideurs en quête de fiabilité.",
      },
    ],
  },
  marqueurs: ["[secteursclientsprincipaux]", "[nombredannesdexprience]", "[nombredeclients]"],
  ameliorations_apportees: [
    "Création d'une description structurée et professionnelle",
    "Intégration naturelle des mots-clés métier (ERP, intégration, processus métiers, etc.)",
    "Mise en avant des bénéfices clients pour chaque variante",
    "Adaptation du ton à un public B2B (professionnel, clair et orienté résultats)",
    "Respect des contraintes de longueur (moins de 2000 caractères)",
  ],
  variante_recommandee: {
    angle: "orientebnficesclients",
    raison:
      "Cette variante est la plus efficace pour capter l'attention des décideurs B2B, car elle met directement en avant les résultats concrets et les gains pour l'entreprise.",
  },
};