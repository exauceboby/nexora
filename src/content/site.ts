import type { Lang } from "@/i18n/config";

export const SITE = {
  domain: "https://nexora.cd",
  brand: "NEXORA TECHNOLOGIES & NETWORKS",
  contacts: {
    phones: ["+243822888909", "+2438624464993", "+25670228225"],
    email: "exauceboby69@gmail.com",
    locationByLang: {
        fr: "Isiro, RDC (interventions sur demande)",
  en: "Isiro, DRC (on-demand interventions)",
    } satisfies Record<Lang, string>,
  },
  servicesByLang: {
    fr: [
      { title: "Installation & maintenance", desc: "PC, serveurs, imprimantes, diagnostics et maintenance." },
      { title: "Réseaux & Wi-Fi", desc: "Conception LAN/WAN, Wi-Fi pro, optimisation et supervision." },
      { title: "Sécurité", desc: "Bonnes pratiques, segmentation, durcissement, accès et sauvegardes." },
      { title: "Support", desc: "Assistance rapide sur site ou à distance, suivi clair." },
    ],
    en: [
      { title: "Installation & maintenance", desc: "PCs, servers, printers, diagnostics and maintenance." },
      { title: "Networks & Wi-Fi", desc: "LAN/WAN design, pro Wi-Fi, optimization and monitoring." },
      { title: "Security", desc: "Best practices, segmentation, hardening, access and backups." },
      { title: "Support", desc: "Fast on-site or remote assistance with clear follow-up." },
    ],
  } satisfies Record<Lang, Array<{ title: string; desc: string }>>,
  networksByLang: {
    fr: [
      { title: "Étude & architecture", desc: "Plan réseau, adressage, VLAN, QoS, plan de câblage." },
      { title: "Déploiement", desc: "Switching, routing, APs, liens, tests et documentation." },
      { title: "Optimisation", desc: "Débit, latence, stabilité, monitoring et alerting." },
      { title: "Sécurisation", desc: "Firewall, segmentation, règles d’accès, durcissement." },
    ],
    en: [
      { title: "Assessment & architecture", desc: "Network plan, IP scheme, VLAN, QoS, cabling plan." },
      { title: "Deployment", desc: "Switching, routing, APs, links, testing and documentation." },
      { title: "Optimization", desc: "Throughput, latency, stability, monitoring and alerts." },
      { title: "Security hardening", desc: "Firewall, segmentation, access rules, hardening." },
    ],
  } satisfies Record<Lang, Array<{ title: string; desc: string }>>,
  shopByLang: {
    fr: [
      { title: "Ordinateurs & accessoires", desc: "PC, laptops, souris, claviers, sacs, etc." },
      { title: "Réseau", desc: "Routeurs, switchs, câbles, connectique, AP Wi-Fi." },
      { title: "Stockage & sauvegarde", desc: "SSD/HDD, NAS, solutions de backup." },
      { title: "Alimentation", desc: "Onduleurs, multiprises, adaptateurs." },
    ],
    en: [
      { title: "Computers & accessories", desc: "PCs, laptops, mice, keyboards, bags, etc." },
      { title: "Networking", desc: "Routers, switches, cables, connectors, Wi-Fi APs." },
      { title: "Storage & backup", desc: "SSD/HDD, NAS, backup solutions." },
      { title: "Power", desc: "UPS, power strips, adapters." },
    ],
  } satisfies Record<Lang, Array<{ title: string; desc: string }>>,
} as const;
