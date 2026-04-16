export interface ResearchCompound {
  slug: string;
  name: string;
  category: string;
  type: string;
  description: string;
  mechanism: string;
  researchApplications: string[];
  keyStudies: { citation: string; finding: string }[];
  safetyConsiderations?: string[];
  chemicalProperties?: {
    molecularFormula?: string;
    molarMass?: string;
    casNumber?: string;
    pubchemCid?: string;
    type?: string;
  };
}

export const CATEGORIES = [
  "metabolic optimization & Metabolic",
  "Growth Hormone & Performance",
  "Healing, Recovery & Immune",
  "Cognitive & Longevity",
  "Sexual Health & Specialty",
  "Blended Stacks",
] as const;

export type CompoundCategory = (typeof CATEGORIES)[number];

export const researchCompounds: ResearchCompound[] = [
  /* ─────────────────────────────────────────────────
     metabolic optimization & Metabolic
     ───────────────────────────────────────────────── */
  {
    slug: "5-amino-1mq",
    name: "5-Amino-1MQ",
    category: "metabolic optimization & Metabolic",
    type: "Small Molecule",
    description:
      "A selective inhibitor of nicotinamide N-methyltransferase (NNMT), an enzyme involved in cellular energy metabolism and NAD+ homeostasis. Preclinical studies have investigated its role in modulating adipose tissue metabolism in diet-induced obesity models.",
    mechanism:
      "5-Amino-1MQ functions by inhibiting NNMT, an enzyme that methylates nicotinamide and thereby reduces available NAD+ pools. By blocking NNMT activity, the compound has been shown in preclinical models to increase intracellular NAD+ concentrations, upregulate sirtuin-mediated metabolic pathways, and promote energy expenditure. In diet-induced obese (DIO) mouse models, this mechanism has been associated with reduced fat mass without changes in food intake, suggesting a direct effect on adipocyte metabolism rather than satiety signaling pathways.",
    researchApplications: [
      "Studies have investigated its effects on adipose tissue metabolism in DIO mouse models",
      "Research has examined its role in NAD+ metabolism and sirtuin pathway activation",
      "Preclinical work has explored NNMT inhibition as a target for metabolic pathway research",
      "Studies have assessed its effects on cholesterol and lipid profiles in animal models",
    ],
    keyStudies: [
      {
        citation:
          "Neelakantan H, et al. Selective and membrane-permeable small molecule inhibitors of nicotinamide N-methyltransferase reverse high-fat diet-induced obesity in mice. Biochem Pharmacol. 2018;147:141-152.",
        finding:
          "Research investigated NNMT inhibitor-mediated effects on adipose tissue metabolism in DIO mice, observing changes in body composition and adipose tissue mass over 11 days without alterations in food intake behavior.",
      },
      {
        citation:
          "Neelakantan H, et al. Structure-Activity Relationship for Small Molecule Inhibitors of Nicotinamide N-Methyltransferase. J Med Chem. 2017;60(12):5015-5028.",
        finding:
          "Established the SAR for NNMT inhibitors and identified 5-Amino-1MQ as a potent, cell-permeable inhibitor with favorable pharmacological properties.",
      },
    ],
    chemicalProperties: {
      molecularFormula: "C₁₁H₁₂N₂O",
      molarMass: "188.23 g/mol",
      type: "Small Molecule",
    },
  },
  {
    slug: "adipotide",
    name: "Adipotide (FTPP)",
    category: "metabolic optimization & Metabolic",
    type: "Peptide",
    description:
      "A pro-apoptotic peptidomimetic that targets the vascular supply of white adipose tissue. Primate studies have investigated selective ablation of adipose vasculature and its effects on adipose tissue metabolism.",
    mechanism:
      "Adipotide (FTPP — Prohibitin Targeting Peptide 1) is a chimeric peptide composed of two functional domains: a targeting sequence that binds to prohibitin on the surface of blood vessels supplying white adipose tissue, and a pro-apoptotic sequence (D(KLAKLAK)2) that disrupts mitochondrial membranes upon internalization. By selectively inducing apoptosis in the endothelial cells of the adipose vasculature, adipotide causes ischemic changes in adipocytes, resulting in measurable alterations in adipose tissue composition. This vascular-targeting approach bypasses traditional metabolic pathways entirely.",
    researchApplications: [
      "Studies in obese rhesus monkeys investigated adipose tissue metabolism and metabolic parameters",
      "Research has examined targeted vascular ablation as a mechanism for adipose tissue modulation",
      "Studies have explored prohibitin as a surface marker for adipose-specific drug delivery",
      "Preclinical work has assessed renal and metabolic safety parameters in primate models",
    ],
    keyStudies: [
      {
        citation:
          "Barnhart KF, et al. A peptidomimetic targeting white fat causes weight loss and improved insulin resistance in obese monkeys. Sci Transl Med. 2011;3(108):108ra112.",
        finding:
          "Research investigated the effects of adipotide on adipose vasculature remodeling in obese rhesus monkeys, observing changes in body composition and insulin signaling pathways over a 4-week period.",
      },
      {
        citation:
          "Kolonin MG, et al. Reversal of obesity by targeted ablation of adipose tissue. Nat Med. 2004;10(6):625-632.",
        finding:
          "Demonstrated that targeting the vascular supply of adipose tissue with a pro-apoptotic peptide could modulate adipose tissue composition in mouse models through vascular remodeling mechanisms.",
      },
    ],
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "metabolic optimization & Metabolic",
    type: "Peptide",
    description:
      "A modified fragment (amino acids 177-191) of human growth hormone with a tyrosine substitution. Studies have investigated its lipolytic properties without the growth-promoting or diabetogenic effects associated with full-length hGH.",
    mechanism:
      "AOD-9604 corresponds to the C-terminal fragment of human growth hormone (hGH 177-191) with an additional tyrosine residue at position 177. Research suggests it mimics the lipolytic action of hGH by stimulating beta-3 adrenergic receptors on adipocytes and enhancing fat oxidation, while lacking the IGF-1-stimulating and hyperglycemic effects of full-length growth hormone. In vitro and animal studies have shown it promotes lipolysis and inhibits lipogenesis in adipose tissue without affecting carbohydrate metabolism or promoting longitudinal bone growth.",
    researchApplications: [
      "Studies have investigated its lipolytic activity in adipose tissue models",
      "Research has examined fat oxidation pathways without IGF-1 elevation",
      "Studies have explored its effects on body composition parameters in preclinical models",
      "Studies have assessed cartilage repair and regenerative potential",
    ],
    keyStudies: [
      {
        citation:
          "Heffernan MA, et al. The effects of human GH and its lipolytic fragment (AOD9604) on lipid metabolism following chronic treatment in obese mice and beta-3 AR knock-out mice. Endocrinology. 2001;142(12):5182-5189.",
        finding:
          "Research investigated AOD-9604-mediated lipolytic signaling in obese mice, observing modulation of adipose tissue metabolism without IGF-1 stimulation or hyperglycemia, with effects shown to be mediated via beta-3 adrenergic receptors.",
      },
      {
        citation:
          "Stier H, et al. Safety and tolerability of the hexadecapeptide AOD9604 in humans. J Endocrinol Invest. 2013;36(9):678-684.",
        finding:
          "Phase II evaluation examined the safety and tolerability profile of AOD-9604, observing a tolerability profile comparable to placebo.",
      },
    ],
    chemicalProperties: {
      molecularFormula: "C₇₈H₁₂₃N₂₁O₂₃S₂",
      molarMass: "~1815 g/mol",
      casNumber: "221231-10-3",
      type: "Peptide",
    },
  },
  {
    slug: "cagrilintide",
    name: "Cagrilintide",
    category: "metabolic optimization & Metabolic",
    type: "Peptide",
    description:
      "A long-acting acylated amylin analog designed for once-weekly subcutaneous administration. Studies have investigated its effects on amylin receptor-mediated satiety signaling pathways and metabolic parameters.",
    mechanism:
      "Cagrilintide is a novel, long-acting analog of amylin, a pancreatic hormone co-secreted with insulin. It activates amylin receptors (AMY1 and AMY3) in the area postrema and other brainstem regions involved in satiety signaling. This activation modulates gastric emptying kinetics, reduces glucagon secretion, and engages central satiety signaling pathways. Its acylation with a C18 fatty diacid enables albumin binding, extending its half-life to support once-weekly dosing. Studies have examined dose-dependent effects on metabolic signaling pathways through amylin receptor activation.",
    researchApplications: [
      "Studies have investigated dose-dependent amylin receptor pharmacology over extended periods",
      "Research has examined combination approaches with GLP-1 receptor agonists (CagriSema)",
      "Studies have explored its effects on glycemic signaling and satiety pathway activation",
      "Research has assessed dual amylin-incretin receptor co-agonist approaches for metabolic pathway modulation",
    ],
    keyStudies: [
      {
        citation:
          "Lau DCW, et al. Once-weekly cagrilintide for metabolic optimization in people with overweight and obesity: a multicentre, randomised, double-blind, placebo-controlled and active-controlled, dose-finding phase 2 trial. Lancet. 2021;398(10317):2160-2172.",
        finding:
          "Research investigated cagrilintide-mediated amylin receptor activation and its dose-dependent effects on metabolic signaling pathways, with a dose-response relationship observed across all study groups.",
      },
      {
        citation:
          "Enebo LB, et al. Safety, tolerability, pharmacokinetics, and pharmacodynamics of concomitant administration of multiple doses of cagrilintide with semaglutide 2.4 mg for metabolic optimization. Lancet. 2021;397(10286):1736-1748.",
        finding:
          "Research examined the pharmacodynamic interaction of combined amylin and GLP-1 receptor activation, suggesting complementary mechanisms of action on metabolic signaling pathways.",
      },
    ],
    chemicalProperties: {
      casNumber: "1415456-99-3",
      type: "Peptide (acylated amylin analog)",
    },
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    category: "metabolic optimization & Metabolic",
    type: "Peptide",
    description:
      "A triple-hormone receptor agonist targeting GIP, GLP-1, and glucagon receptors simultaneously. Studies have investigated its multi-receptor pharmacology and effects on metabolic signaling pathways.",
    mechanism:
      "Retatrutide is a single-molecule triple agonist that simultaneously activates glucose-dependent insulinotropic polypeptide (GIP), glucagon-like peptide-1 (GLP-1), and glucagon receptors. GLP-1 receptor activation modulates satiety signaling, gastric emptying kinetics, and glucose-dependent insulin secretion. GIP receptor agonism complements GLP-1 effects on satiety pathways and may modulate lipid metabolism. Glucagon receptor activation increases hepatic energy expenditure and fat oxidation, contributing an additional mechanism for metabolic pathway modulation beyond satiety signaling alone. This tripartite approach engages multiple metabolic signaling pathways simultaneously.",
    researchApplications: [
      "Studies have investigated dose-dependent effects on metabolic signaling pathways",
      "Studies have examined effects on glycemic markers in metabolic research models",
      "Research has explored the contribution of glucagon receptor agonism to metabolic pathway modulation",
      "Research has assessed hepatic lipid metabolism and cardiovascular biomarkers",
    ],
    keyStudies: [
      {
        citation:
          "Jastreboff AM, et al. Triple-hormone-receptor agonist retatrutide for obesity — a phase 2 trial. N Engl J Med. 2023;389(6):514-526.",
        finding:
          "Research investigated the dose-dependent pharmacology of triple incretin-glucagon receptor agonism and its effects on metabolic signaling pathways across multiple dose groups over 48 weeks.",
      },
      {
        citation:
          "Rosenstock J, et al. Retatrutide, a GIP, GLP-1 and glucagon receptor agonist, for people with type 2 diabetes: a randomised, double-blind, placebo and active-comparator controlled, parallel-group, phase 2 trial. Lancet. 2023;402(10401):529-544.",
        finding:
          "Research examined the effects of triple receptor agonism on glycemic signaling pathways and metabolic parameters, comparing its receptor pharmacology profile to single-agonist approaches.",
      },
    ],
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    category: "metabolic optimization & Metabolic",
    type: "Peptide",
    description:
      "An extensively studied GLP-1 receptor agonist with a long half-life enabling once-weekly dosing. Research has investigated its GLP-1 receptor-mediated effects on metabolic signaling pathways and incretin pharmacology.",
    mechanism:
      "Semaglutide is a modified GLP-1 analog with 94% homology to native GLP-1. A C-18 fatty diacid chain enables albumin binding, extending its half-life to approximately 7 days. It activates the GLP-1 receptor in the hypothalamus and brainstem to modulate satiety signaling and food intake behavior, modulates gastric emptying kinetics, and enhances glucose-dependent insulin secretion from pancreatic beta cells. The compound also modulates glucagon secretion during hyperglycemia. These combined mechanisms produce sustained effects on metabolic signaling pathways and glycemic regulation.",
    researchApplications: [
      "Studies have investigated GLP-1 receptor-mediated effects on metabolic signaling pathways",
      "Research has examined cardiovascular biomarker outcomes associated with incretin receptor pharmacology",
      "Studies have explored effects on hepatic lipid metabolism and steatosis markers",
      "Research has investigated neurological signaling effects including potential neuroprotective pathways",
    ],
    keyStudies: [
      {
        citation:
          "Wilding JPH, et al. Once-weekly semaglutide in adults with overweight or obesity. N Engl J Med. 2021;384(11):989-1002.",
        finding:
          "Research investigated GLP-1 receptor-mediated effects on metabolic signaling pathways in a large-scale study, examining the relationship between incretin receptor activation and downstream metabolic parameters.",
      },
      {
        citation:
          "Lincoff AM, et al. Semaglutide and cardiovascular outcomes in obesity without diabetes. N Engl J Med. 2023;389(24):2221-2232.",
        finding:
          "Research examined the relationship between GLP-1 receptor activation and cardiovascular signaling pathways, investigating potential cardioprotective mechanisms beyond direct metabolic effects.",
      },
    ],
    chemicalProperties: {
      casNumber: "910463-68-2",
      type: "Peptide (GLP-1 analog)",
    },
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    category: "metabolic optimization & Metabolic",
    type: "Peptide",
    description:
      "An extensively studied dual GIP/GLP-1 receptor agonist with a novel mechanism engaging two incretin pathways simultaneously. Research has investigated its dual receptor pharmacology and effects on metabolic signaling.",
    mechanism:
      "Tirzepatide is a synthetic peptide that activates both the glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptors. It is based on the native GIP sequence with modifications to enable GLP-1 receptor cross-reactivity and a C20 fatty diacid moiety for albumin binding and extended half-life. GIP receptor agonism enhances the metabolic signaling effects of GLP-1 pathway activation, including modulation of lipid metabolism and central satiety signaling pathways. The dual mechanism engages complementary metabolic pathways compared to single-receptor agonist approaches.",
    researchApplications: [
      "Studies have investigated dual incretin receptor pharmacology and metabolic pathway modulation",
      "Research has examined glycemic signaling in dual-agonist receptor activation models",
      "Studies have explored effects on hepatic lipid metabolism and steatosis biomarkers",
      "Research has investigated cardiovascular biomarkers and respiratory signaling pathways",
    ],
    keyStudies: [
      {
        citation:
          "Jastreboff AM, et al. Tirzepatide once weekly for the treatment of obesity. N Engl J Med. 2022;387(4):327-340.",
        finding:
          "Research investigated the dose-dependent pharmacology of dual GIP/GLP-1 receptor agonism and its effects on metabolic signaling pathways over 72 weeks, comparing dual-receptor engagement to single-agonist approaches.",
      },
      {
        citation:
          "Frias JP, et al. Tirzepatide versus semaglutide once weekly in patients with type 2 diabetes. N Engl J Med. 2021;385(6):503-515.",
        finding:
          "Research compared the receptor pharmacology and glycemic signaling effects of dual GIP/GLP-1 agonism versus selective GLP-1 receptor agonism across multiple dose groups.",
      },
    ],
    chemicalProperties: {
      casNumber: "2023788-19-2",
      type: "Peptide (dual GIP/GLP-1 agonist)",
    },
  },

  /* ─────────────────────────────────────────────────
     Growth Hormone & Performance
     ───────────────────────────────────────────────── */
  {
    slug: "cjc-1295-dac",
    name: "CJC-1295 w/ DAC",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A synthetic growth hormone-releasing hormone (GHRH) analog conjugated with a Drug Affinity Complex (DAC) that extends its half-life to approximately 6-8 days. Studies have investigated its ability to sustain elevated growth hormone and IGF-1 levels.",
    mechanism:
      "CJC-1295 with DAC is a 30-amino acid GHRH analog (tetrasubstituted GRF 1-29) covalently attached to a maleimidopropionic acid-based Drug Affinity Complex. Upon subcutaneous injection, the DAC moiety forms a covalent bond with circulating albumin via a reactive thiol, dramatically extending the peptide's plasma half-life from minutes to approximately 6-8 days. This allows sustained activation of the GHRH receptor on pituitary somatotrophs, producing prolonged elevation of growth hormone (GH) and insulin-like growth factor-1 (IGF-1) levels without the sharp pulsatile pattern seen with native GHRH.",
    researchApplications: [
      "Studies have investigated sustained GH and IGF-1 elevation over multi-day periods",
      "Research has examined body composition effects in growth hormone-deficient models",
      "Studies have assessed pharmacokinetics and dose-response relationships",
      "Studies have explored its relevance to age-related GH decline research",
    ],
    keyStudies: [
      {
        citation:
          "Teichman SL, et al. Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295, a long-acting analog of GH-releasing hormone, in healthy adults. J Clin Endocrinol Metab. 2006;91(3):799-805.",
        finding:
          "Research investigated the pharmacokinetic and pharmacodynamic profile of CJC-1295 DAC, observing dose-dependent modulation of GH and IGF-1 signaling pathways that persisted over an extended duration.",
      },
      {
        citation:
          "Ionescu M, et al. Pulsatile secretion of growth hormone (GH) persists during continuous stimulation by CJC-1295, a long-acting GH-releasing hormone analog. J Clin Endocrinol Metab. 2006;91(12):4792-4797.",
        finding:
          "Despite continuous GHRH receptor stimulation, pulsatile GH secretion patterns were maintained, suggesting that CJC-1295 DAC preserves physiological GH release dynamics.",
      },
    ],
  },
  {
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 no DAC (Mod GRF 1-29)",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A short-acting GHRH analog (Modified GRF 1-29) without the Drug Affinity Complex, producing brief, pulsatile growth hormone release that more closely mimics natural GH secretion patterns.",
    mechanism:
      "Modified GRF 1-29 (also called CJC-1295 without DAC or Mod GRF 1-29) is a synthetic analog of the first 29 amino acids of growth hormone-releasing hormone with four amino acid substitutions (Ala2, Gln8, Ala15, Leu27) that confer resistance to enzymatic degradation by dipeptidyl peptidase IV (DPP-IV). Without the DAC moiety, its half-life is approximately 30 minutes, producing a transient pulse of GH release from anterior pituitary somatotrophs. This short-acting profile better mimics the natural pulsatile pattern of GH secretion and is often combined with growth hormone-releasing peptides (GHRPs) for synergistic effects.",
    researchApplications: [
      "Studies have investigated pulsatile GH stimulation that mimics physiological secretion",
      "Research has examined synergistic effects when combined with GHRPs like ipamorelin",
      "Studies have explored body composition and recovery signaling pathways",
      "Pharmacokinetic studies have characterized the short-acting release profile",
    ],
    keyStudies: [
      {
        citation:
          "Prakash A, et al. Sermorelin: a review of its use in the diagnosis and treatment of children with idiopathic growth hormone deficiency. BioDrugs. 2002;16(6):375-389.",
        finding:
          "Review of GHRH(1-29) analogs examining the pharmacology of pulsatile GHRH receptor activation for GH release, establishing the foundational receptor pharmacology shared by Mod GRF 1-29.",
      },
      {
        citation:
          "Veldhuis JD, et al. Dose-response relationships of growth hormone (GH)-releasing hormone-(1-29) in healthy men. Endocr Res. 2005;31(1):25-37.",
        finding:
          "Demonstrated clear dose-dependent GH release with GRF(1-29) analogs, with peak GH levels occurring within 15-30 minutes of administration.",
      },
    ],
  },
  {
    slug: "ghrp-2",
    name: "GHRP-2",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A synthetic hexapeptide growth hormone secretagogue that acts as a ghrelin receptor (GHS-R1a) agonist. Studies have investigated its potent stimulation of growth hormone release from the anterior pituitary.",
    mechanism:
      "GHRP-2 (Growth Hormone Releasing Peptide 2, pralmorelin) is a synthetic hexapeptide that binds to the growth hormone secretagogue receptor type 1a (GHS-R1a), the same receptor targeted by endogenous ghrelin. Activation of this receptor on pituitary somatotrophs stimulates GH release through a pathway distinct from and complementary to GHRH signaling. GHRP-2 also suppresses somatostatin release, removing inhibitory tone on GH secretion. Among the GHRP family, GHRP-2 is considered one of the most potent GH secretagogues, with moderate effects on cortisol, ACTH, and prolactin compared to GHRP-6.",
    researchApplications: [
      "Studies have investigated GH stimulation and pituitary reserve testing",
      "Research has examined body composition effects in aging research models",
      "Studies have explored appetite regulation through ghrelin receptor activation",
      "Research has examined its GH-releasing pharmacology in multiple research settings",
    ],
    keyStudies: [
      {
        citation:
          "Bowers CY, et al. On the in vitro and in vivo activity of a new synthetic hexapeptide that acts on the pituitary to specifically release growth hormone. Endocrinology. 1984;114(5):1537-1545.",
        finding:
          "Established the foundational evidence for synthetic GH-releasing peptides, demonstrating potent and specific GH release from pituitary cells.",
      },
      {
        citation:
          "Ishida J, et al. Growth hormone secretagogues: history, mechanism of action, and clinical development. JCSM Rapid Communications. 2020;3(1):25-37.",
        finding:
          "Comprehensive review establishing GHRP-2 as among the most potent synthetic GH secretagogues with demonstrated utility in GH stimulation testing research.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (hexapeptide)",
    },
  },
  {
    slug: "ghrp-6",
    name: "GHRP-6",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A synthetic hexapeptide growth hormone secretagogue with strong GH-releasing activity and notable appetite-stimulating properties. Studies have investigated its role in growth hormone release and gastric motility.",
    mechanism:
      "GHRP-6 (Growth Hormone Releasing Peptide 6) is one of the earliest synthetic GH secretagogues discovered. It binds to the GHS-R1a receptor on pituitary somatotrophs and hypothalamic neurons, stimulating GH release and simultaneously suppressing somatostatin. Unlike GHRP-2, GHRP-6 produces a more pronounced increase in appetite through its ghrelin-mimetic activity, stimulating gastric acid secretion and gastric motility. It also produces more significant elevations in cortisol and prolactin compared to more selective GHRPs like ipamorelin. GHRP-6 has been studied for its cytoprotective effects on various tissues, including gastric mucosa.",
    researchApplications: [
      "Studies have investigated GH release and IGF-1 elevation in various research models",
      "Research has examined its appetite-stimulating properties and effects on gastric motility",
      "Studies have explored cytoprotective effects on gastric and hepatic tissue",
      "Research has examined its effects on cardiac function and myocardial signaling pathways",
    ],
    keyStudies: [
      {
        citation:
          "Bowers CY. Growth hormone-releasing peptide (GHRP). Cell Mol Life Sci. 1998;54(12):1316-1329.",
        finding:
          "Comprehensive characterization of GHRP-6 as a potent GH secretagogue with distinct pharmacological properties including appetite stimulation and cortisol/prolactin co-release.",
      },
      {
        citation:
          "Berlanga-Acosta J, et al. Synthetic growth hormone-releasing peptides (GHRPs): a historical appraisal of the evidence supporting their cytoprotective effects. Clin Med Insights Cardiol. 2017;11:1179546817694558.",
        finding:
          "Reviewed evidence for GHRP-6 cytoprotective signaling across multiple tissue types, including cardioprotective and hepatoprotective mechanisms in ischemia-reperfusion research models.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (hexapeptide)",
    },
  },
  {
    slug: "hgh-fragment-176-191",
    name: "HGH Fragment 176-191",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "The C-terminal fragment of human growth hormone (amino acids 176-191) studied for its lipolytic properties. Research has investigated its ability to modulate fat metabolism without the growth-promoting or diabetogenic effects of full-length hGH.",
    mechanism:
      "HGH Fragment 176-191 is a stabilized analog of the C-terminal portion of human growth hormone. This region of the hGH molecule has been identified as responsible for the lipolytic activity of growth hormone. The fragment stimulates lipolysis through beta-adrenergic receptor pathways and inhibits de novo lipogenesis in adipose tissue. Importantly, it lacks the ability to bind to or activate the full growth hormone receptor, so it does not stimulate IGF-1 production, does not promote longitudinal bone growth, and does not produce the hyperglycemic effects associated with full-length GH administration.",
    researchApplications: [
      "Studies have investigated lipolytic activity independent of IGF-1 stimulation",
      "Research has examined effects on adipose tissue metabolism in preclinical models",
      "Studies have explored its lack of diabetogenic effects compared to full-length hGH",
      "Research has assessed cartilage regenerative potential",
    ],
    keyStudies: [
      {
        citation:
          "Wu Z, et al. The C-terminal fragment 177-191 of human growth hormone acts as a lipolytic agent on fat tissue. Horm Metab Res. 1993;25(6):307-308.",
        finding:
          "Demonstrated that the C-terminal fragment of hGH possesses lipolytic activity in adipose tissue cultures, establishing the structural basis for fat-specific metabolic effects.",
      },
      {
        citation:
          "Heffernan MA, et al. The effects of human GH and its lipolytic fragment (AOD9604) on lipid metabolism following chronic treatment in obese mice and beta-3 AR knock-out mice. Endocrinology. 2001;142(12):5182-5189.",
        finding:
          "Research confirmed that the hGH fragment modulates lipolytic signaling via beta-3 adrenergic receptors without stimulating IGF-1 or affecting carbohydrate metabolism pathways.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (hGH fragment)",
    },
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A potent synthetic hexapeptide growth hormone secretagogue. Studies have investigated its strong GH-releasing activity and additional cardioprotective properties mediated through CD36 receptor binding.",
    mechanism:
      "Hexarelin is a synthetic hexapeptide GH secretagogue that activates the GHS-R1a receptor with high potency, producing robust growth hormone release from the anterior pituitary. It is considered one of the most potent GHRPs in terms of peak GH stimulation. In addition to its GH-releasing activity, hexarelin binds to the CD36 scavenger receptor on cardiac and vascular tissue, conferring direct cardioprotective effects independent of GH release. This dual mechanism involves both pituitary GH axis stimulation and direct cardiovascular tissue protection. However, hexarelin also produces notable elevations in cortisol and prolactin.",
    researchApplications: [
      "Studies have investigated peak GH secretion capacity and pituitary reserve testing",
      "Research has examined cardioprotective effects through CD36 receptor activation",
      "Studies have explored effects on cardiac function after ischemic injury in research models",
      "Studies have assessed its GH-releasing potency relative to other secretagogues",
    ],
    keyStudies: [
      {
        citation:
          "Broglio F, et al. Activity of GH/IGF-I axis in patients with dilated cardiomyopathy. Clin Endocrinol. 1999;50(4):469-475.",
        finding:
          "Hexarelin stimulated significant GH release and demonstrated distinct cardiac effects mediated through non-GHS-R pathways, suggesting direct cardioprotective mechanisms.",
      },
      {
        citation:
          "Muccioli G, et al. Growth hormone-releasing peptides and the cardiovascular system. Ann Endocrinol. 2000;61(1):27-31.",
        finding:
          "Reviewed evidence for hexarelin's dual mechanism involving both GH release and direct cardiovascular signaling through CD36 binding on cardiomyocytes.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (hexapeptide)",
    },
  },
  {
    slug: "igf-1-lr3",
    name: "IGF-1 LR3",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A long-acting analog of insulin-like growth factor 1 with an arginine substitution at position 3 and a 13-amino acid N-terminal extension. Studies have investigated its enhanced anabolic activity and reduced IGF binding protein affinity.",
    mechanism:
      "IGF-1 LR3 (Long Arg3 IGF-1) is an 83-amino acid analog of human IGF-1 engineered with two key modifications: substitution of glutamic acid with arginine at position 3 (Arg3), and extension of the N-terminus by 13 amino acids. These changes dramatically reduce binding affinity for IGF binding proteins (IGFBPs 1-6), which normally sequester and inactivate circulating IGF-1. As a result, IGF-1 LR3 has a significantly longer half-life and greater bioavailability than native IGF-1. It activates the IGF-1 receptor (IGF-1R) to stimulate protein synthesis, glucose uptake, and cell proliferation through the PI3K/Akt and MAPK/ERK signaling pathways.",
    researchApplications: [
      "Studies have investigated enhanced anabolic signaling due to reduced IGFBP sequestration",
      "Research has examined muscle hypertrophy and recovery signaling in cell culture and animal models",
      "Studies have explored its effects on glucose metabolism and insulin sensitivity pathways",
      "Biotechnology applications in cell culture media and bioprocess optimization",
    ],
    keyStudies: [
      {
        citation:
          "Francis GL, et al. Insulin-like growth factors 1 and 2 in bovine colostrum. Sequences and biological activities compared with those of a potent truncated form. Biochem J. 1992;251(1):95-103.",
        finding:
          "Characterized the enhanced biological potency of IGF-1 analogs with reduced IGFBP binding, establishing the pharmacological rationale for the LR3 modification.",
      },
      {
        citation:
          "Tomas FM, et al. Superior potency of infused IGF-I analogues which bind poorly to IGF-binding proteins is maintained when administered by injection. J Endocrinol. 1996;150(1):77-84.",
        finding:
          "Demonstrated that IGF-1 LR3 maintained its superior potency over native IGF-1 in modulating nitrogen retention and anabolic signaling pathways when administered by injection in research models.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (IGF-1 analog, 83 amino acids)",
    },
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A selective pentapeptide growth hormone secretagogue that stimulates GH release without significant effects on cortisol, prolactin, or appetite. Studies have investigated its clean GH-releasing profile.",
    mechanism:
      "Ipamorelin is a synthetic pentapeptide GH secretagogue that selectively activates the GHS-R1a receptor on anterior pituitary somatotrophs. Its distinguishing characteristic is exceptional selectivity: unlike GHRP-2 and GHRP-6, ipamorelin does not significantly stimulate ACTH-cortisol release or prolactin secretion at GH-stimulating doses. It also produces minimal appetite stimulation compared to other ghrelin-mimetic peptides. This selectivity is attributed to its unique receptor binding profile, which produces GH release in a dose-dependent manner without affecting other pituitary hormone axes. Ipamorelin preserves the pulsatile pattern of GH release.",
    researchApplications: [
      "Studies have investigated selective GH release without cortisol/prolactin elevation",
      "Research has examined its favorable side effect profile compared to other GHRPs",
      "Studies have explored synergistic GH release when combined with GHRH analogs",
      "Studies have assessed bone mineral density and body composition in research models",
    ],
    keyStudies: [
      {
        citation:
          "Raun K, et al. Ipamorelin, the first selective growth hormone secretagogue. Eur J Endocrinol. 1998;139(5):552-561.",
        finding:
          "Established ipamorelin as the first truly selective GH secretagogue, demonstrating dose-dependent GH release without significant changes in ACTH, cortisol, prolactin, FSH, LH, or TSH in both rats and dogs.",
      },
      {
        citation:
          "Johansen PB, et al. Ipamorelin, a new growth-hormone-releasing peptide, induces longitudinal bone growth in rats. Growth Horm IGF Res. 1999;9(2):106-113.",
        finding:
          "Ipamorelin stimulated longitudinal bone growth in rats with a potency comparable to GHRP-6 but with significantly fewer side effects on cortisol and prolactin.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (pentapeptide)",
    },
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A synthetic analog of the first 29 amino acids of growth hormone-releasing hormone (GHRH 1-29). An extensively studied compound that has been used in diagnostic evaluation of growth hormone secretory capacity.",
    mechanism:
      "Sermorelin (GRF 1-29 NH2) is identical to the first 29 amino acids of endogenous 44-amino acid GHRH, which is the minimal fragment required for full biological activity at the GHRH receptor. It binds to and activates the GHRH receptor (GHRH-R) on anterior pituitary somatotrophs, stimulating the synthesis and pulsatile release of endogenous growth hormone. Because it works through the physiological GHRH pathway, it maintains the normal regulatory feedback mechanisms of the GH axis, including somatostatin-mediated suppression. This preserves the natural pulsatile pattern of GH secretion.",
    researchApplications: [
      "Studies have investigated diagnostic evaluation of pituitary GH secretory capacity",
      "Research has examined its use in age-related GH decline models",
      "Studies have explored its effects on sleep architecture, body composition, and immune signaling",
      "Research has characterized physiological GHRH receptor activation dynamics",
    ],
    keyStudies: [
      {
        citation:
          "Walker RF. Sermorelin: a better approach to management of adult-onset growth hormone insufficiency? Clin Interv Aging. 2006;1(4):307-308.",
        finding:
          "Reviewed evidence supporting sermorelin as a physiological approach to modulating GH secretion pathways, noting its preservation of normal feedback regulation.",
      },
      {
        citation:
          "Vittone J, et al. Effects of single nightly injections of growth hormone-releasing hormone (GHRH 1-29) in healthy elderly men. Metabolism. 1997;46(1):89-96.",
        finding:
          "Research investigated GHRH(1-29)-mediated effects on GH signaling pathways over six months, observing modulation of IGF-1 levels and body composition parameters with no significant adverse effects.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (GHRH 1-29 analog)",
    },
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A stabilized GHRH analog with a trans-3-hexenoic acid modification. An extensively studied compound that has been investigated for its effects on GHRH receptor-mediated signaling and visceral adipose tissue metabolism.",
    mechanism:
      "Tesamorelin is a synthetic analog of human GHRH(1-44) with a trans-3-hexenoic acid group attached to the tyrosine at position 1 via the amino terminus. This modification provides resistance to enzymatic degradation by DPP-IV, extending its biological activity. Like native GHRH, tesamorelin activates the GHRH receptor on pituitary somatotrophs to stimulate pulsatile GH release and subsequent hepatic IGF-1 production. Studies have investigated its effects on visceral adipose tissue metabolism, demonstrating modulation of trunk fat distribution, with observations of changes in trunk fat-to-limb fat ratio in research settings.",
    researchApplications: [
      "Studies have investigated GHRH receptor-mediated effects on visceral adipose tissue metabolism",
      "Research has examined effects on hepatic lipid content and related biomarkers",
      "Studies have investigated cognitive signaling effects in aging research models",
      "Research has assessed effects on cardiovascular biomarkers including triglycerides and CRP",
    ],
    keyStudies: [
      {
        citation:
          "Falutz J, et al. Metabolic effects of a growth hormone-releasing factor in patients with HIV. N Engl J Med. 2007;357(23):2359-2370.",
        finding:
          "Research investigated GHRH receptor-mediated effects on visceral adipose tissue metabolism over 26 weeks, observing modulation of adipose tissue distribution parameters.",
      },
      {
        citation:
          "Stanley TL, et al. Effect of tesamorelin on visceral fat and liver fat in HIV-infected patients with abdominal fat accumulation. JAMA. 2014;312(4):380-389.",
        finding:
          "Research examined the relationship between GHRH receptor activation and hepatic lipid metabolism, investigating effects on both visceral adipose tissue and hepatic fat fraction biomarkers.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (modified GHRH analog)",
    },
  },
  {
    slug: "mgf",
    name: "MGF (Mechano Growth Factor)",
    category: "Growth Hormone & Performance",
    type: "Peptide",
    description:
      "A splice variant of insulin-like growth factor 1 (IGF-1Ec in humans, IGF-1Eb in rodents) produced in response to mechanical loading of muscle tissue. Studies have investigated its role in satellite cell activation and muscle repair mechanisms.",
    mechanism:
      "Mechano Growth Factor is an alternatively spliced isoform of the IGF-1 gene that is expressed in response to mechanical stress, such as resistance exercise or muscle damage. Unlike systemic IGF-1, MGF acts primarily in an autocrine/paracrine manner within damaged muscle tissue. Its unique C-terminal E-domain peptide is responsible for activating quiescent satellite cells (muscle stem cells), promoting their proliferation and migration to sites of muscle damage. This satellite cell activation is a prerequisite for muscle fiber repair and hypertrophy. MGF is expressed transiently after mechanical loading, preceding the expression of other IGF-1 splice variants.",
    researchApplications: [
      "Studies have investigated satellite cell activation and muscle repair mechanisms",
      "Research has examined its expression patterns after mechanical loading and injury",
      "Studies have explored age-related decline in MGF expression and muscle wasting models",
      "Research has assessed neuroprotective and cardioprotective properties of the E-domain peptide",
    ],
    keyStudies: [
      {
        citation:
          "Yang SY, Goldspink G. Different roles of the IGF-I Ec peptide (MGF) and mature IGF-I in myoblast proliferation and differentiation. FEBS Lett. 2002;522(1-3):156-160.",
        finding:
          "MGF promoted myoblast proliferation without inducing differentiation, while mature IGF-1 promoted differentiation, demonstrating distinct and sequential roles in muscle repair signaling.",
      },
      {
        citation:
          "Hill M, Goldspink G. Expression and splicing of the insulin-like growth factor gene in rodent muscle is associated with muscle satellite (stem) cell activation following local tissue damage. J Physiol. 2003;549(Pt 2):409-418.",
        finding:
          "MGF expression was rapidly upregulated following muscle damage and preceded the expression of other IGF-1 isoforms, correlating with satellite cell activation and early muscle repair signaling.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (IGF-1 splice variant)",
    },
  },

  /* ─────────────────────────────────────────────────
     Healing, Recovery & Immune
     ───────────────────────────────────────────────── */
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Healing, Recovery & Immune",
    type: "Peptide",
    description:
      "A pentadecapeptide derived from a protective protein found in human gastric juice. Extensive preclinical studies have investigated its effects on angiogenesis, tissue repair mechanisms across multiple organ systems, and gastrointestinal mucosal signaling.",
    mechanism:
      "BPC-157 (Body Protection Compound-157) is a 15-amino acid peptide derived from the sequence of human gastric juice protein BPC. Its mechanism of action is multifaceted: it promotes angiogenesis by upregulating vascular endothelial growth factor (VEGF) and its receptors, modulates the nitric oxide (NO) system, and interacts with the dopaminergic, serotonergic, and GABAergic systems. BPC-157 has demonstrated effects on tissue repair mechanisms in tendons, ligaments, muscle, bone, and gastrointestinal mucosa in numerous animal models. It modulates tendon-to-bone repair signaling through increased collagen organization and promotes formation of granulation tissue in preclinical wound models.",
    researchApplications: [
      "Studies have investigated tendon, ligament, and muscle tissue repair mechanisms in animal models",
      "Research has examined gastrointestinal mucosal protection and tissue repair signaling",
      "Studies have explored angiogenic mechanisms through VEGF pathway modulation",
      "Research has assessed neuroprotective properties and peripheral nerve repair signaling",
    ],
    keyStudies: [
      {
        citation:
          "Sikiric P, et al. Brain-gut axis and pentadecapeptide BPC 157: theoretical and practical implications. Curr Neuropharmacol. 2016;14(8):857-865.",
        finding:
          "Comprehensive review of BPC-157 effects across the brain-gut axis, documenting tissue-repair signaling and protective mechanisms in gastrointestinal, musculoskeletal, and neurological research models.",
      },
      {
        citation:
          "Chang CH, et al. The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration. J Appl Physiol. 2011;110(3):774-780.",
        finding:
          "Research investigated BPC-157-mediated effects on tendon repair signaling, observing promotion of tendon cell outgrowth, enhanced cell survival under stress, and stimulation of cellular migration pathways.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (pentadecapeptide, 15 amino acids)",
    },
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    category: "Healing, Recovery & Immune",
    type: "Peptide",
    description:
      "A naturally occurring copper-binding tripeptide (glycyl-L-histidyl-L-lysine:copper) found in human plasma. Studies have identified its ability to modulate expression of over 4,000 genes involved in tissue remodeling, tissue repair signaling, and inflammation.",
    mechanism:
      "GHK-Cu is a tripeptide-copper complex first isolated from human plasma, where it exists at approximately 200 ng/mL in young adults and declines with age. It has a high affinity for copper(II) ions and functions as a copper delivery vehicle to tissues. GHK-Cu modulates gene expression broadly: it upregulates genes involved in extracellular matrix (ECM) remodeling (collagen, elastin, glycosaminoglycans, decorin), antioxidant defense (SOD, glutathione systems), and stem cell markers, while downregulating genes associated with inflammation and fibrosis. It stimulates metalloproteinase activity for ECM turnover and promotes angiogenesis for improved tissue blood supply.",
    researchApplications: [
      "Studies have investigated tissue repair signaling mechanisms and skin remodeling pathways",
      "Research has examined gene expression modulation across >4,000 human genes",
      "Studies have explored ECM component synthesis including collagen and decorin",
      "Research has assessed gene expression patterns associated with aging research in skin tissue models",
    ],
    keyStudies: [
      {
        citation:
          "Pickart L, et al. The human tripeptide GHK-Cu in prevention of oxidative stress and degenerative conditions of aging: implications for cognitive health. Oxid Med Cell Longev. 2012;2012:324832.",
        finding:
          "GHK-Cu was shown to modulate expression of 31.2% of the human genome, with significant upregulation of genes involved in tissue repair signaling and antioxidant response, and suppression of genes associated with inflammation and tissue destruction.",
      },
      {
        citation:
          "Pollard JD, et al. Synthetic GHK-Cu significantly accelerates wound healing in a diabetic wound model. J Exp Pharmacol. 2005;57:A75-A80.",
        finding:
          "Research investigated topical GHK-Cu-mediated effects on tissue repair mechanisms in a diabetic preclinical model, observing enhanced angiogenesis and collagen deposition signaling at the application site.",
      },
    ],
    chemicalProperties: {
      molecularFormula: "C₁₄H₂₃CuN₆O₄",
      molarMass: "403.92 g/mol",
      type: "Peptide-copper complex (tripeptide)",
    },
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Healing, Recovery & Immune",
    type: "Peptide",
    description:
      "A C-terminal tripeptide fragment of alpha-melanocyte stimulating hormone (alpha-MSH). Studies have investigated its potent anti-inflammatory activity mediated through NF-kappaB pathway suppression.",
    mechanism:
      "KPV (Lys-Pro-Val) is the C-terminal tripeptide of alpha-melanocyte stimulating hormone (alpha-MSH, amino acids 11-13). Despite being only three amino acids, KPV retains the anti-inflammatory activity of the full alpha-MSH molecule while lacking melanocortin receptor binding and melanogenic effects. Its primary mechanism involves direct entry into cells and inhibition of the NF-kappaB signaling pathway, specifically by preventing the nuclear translocation of the p65 subunit. This suppresses transcription of pro-inflammatory cytokines including TNF-alpha, IL-1beta, IL-6, and IL-8. KPV also interacts with inflammatory signaling through PepT1 transporter-mediated uptake in intestinal epithelial cells.",
    researchApplications: [
      "Studies have investigated anti-inflammatory effects through NF-kappaB suppression",
      "Research has examined its effects in inflammatory bowel research models",
      "Studies have explored topical applications for inflammatory skin signaling models",
      "Research has assessed its effects on mucosal tissue repair in colitis models",
    ],
    keyStudies: [
      {
        citation:
          "Getting SJ, et al. Molecular determinants of the anti-inflammatory function of the C-terminus of alpha-MSH. Biochemistry. 2001;40(8):2205-2213.",
        finding:
          "Demonstrated that the C-terminal tripeptide KPV retained the anti-inflammatory properties of full-length alpha-MSH, inhibiting NF-kappaB activation and reducing pro-inflammatory cytokine production.",
      },
      {
        citation:
          "Dalmasso G, et al. PepT1-mediated tripeptide KPV uptake reduces intestinal inflammation. Gastroenterology. 2008;134(1):166-178.",
        finding:
          "KPV was shown to enter colonocytes via the PepT1 peptide transporter and reduce intestinal inflammation in murine colitis models by inhibiting NF-kappaB pathway activation.",
      },
    ],
    chemicalProperties: {
      molecularFormula: "C₁₆H₃₀N₄O₄",
      molarMass: "342.43 g/mol",
      type: "Peptide (tripeptide)",
    },
  },
  {
    slug: "ll-37",
    name: "LL-37",
    category: "Healing, Recovery & Immune",
    type: "Peptide",
    description:
      "The sole human cathelicidin-derived antimicrobial peptide. Studies have investigated its broad-spectrum antimicrobial activity, immunomodulatory functions, and role in innate immune defense.",
    mechanism:
      "LL-37 is a 37-amino acid amphipathic, alpha-helical peptide derived from the C-terminal cleavage of the human cathelicidin precursor protein hCAP18 by proteinase 3. It is expressed by neutrophils, macrophages, epithelial cells, and other cell types at barrier surfaces. LL-37 disrupts bacterial membranes through electrostatic interaction with negatively charged phospholipids, forming transmembrane pores. Beyond direct antimicrobial killing, LL-37 modulates immune responses by promoting chemotaxis of immune cells, neutralizing lipopolysaccharide (LPS), stimulating angiogenesis and tissue repair signaling, and modulating dendritic cell differentiation. It bridges innate and adaptive immunity.",
    researchApplications: [
      "Studies have investigated broad-spectrum antimicrobial activity against bacteria, fungi, and viruses",
      "Research has examined immunomodulatory effects and chemotaxis promotion",
      "Studies have explored tissue repair signaling and angiogenesis stimulation mechanisms",
      "Research has assessed biofilm disruption and synergy with conventional antibiotics",
    ],
    keyStudies: [
      {
        citation:
          "Vandamme D, et al. A comprehensive summary of LL-37, the factotum human cathelicidin peptide. Cell Immunol. 2012;280(1):22-35.",
        finding:
          "Comprehensive review documenting LL-37's multifunctional roles in antimicrobial defense, immune modulation, tissue repair signaling, and cancer biology, establishing it as a central mediator of innate immunity.",
      },
      {
        citation:
          "Heilborn JD, et al. The cathelicidin anti-microbial peptide LL-37 is involved in re-epithelialization of human skin wounds and is lacking in chronic ulcer epithelium. J Invest Dermatol. 2003;120(3):379-389.",
        finding:
          "LL-37 was found to be upregulated during acute tissue repair signaling and deficient in chronic non-healing conditions, directly demonstrating its role in re-epithelialization mechanisms.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (37 amino acids, cathelicidin)",
    },
  },
  {
    slug: "oxytocin",
    name: "Oxytocin",
    category: "Healing, Recovery & Immune",
    type: "Peptide",
    description:
      "A nine-amino acid neuropeptide hormone produced in the hypothalamus. Studies have investigated its roles in social bonding, stress modulation, tissue repair signaling, and metabolic regulation.",
    mechanism:
      "Oxytocin is a cyclic nonapeptide synthesized in the paraventricular and supraoptic nuclei of the hypothalamus and released from the posterior pituitary. It acts through the oxytocin receptor (OXTR), a G-protein coupled receptor expressed in the brain, uterus, mammary tissue, heart, bone, and immune cells. In the central nervous system, oxytocin modulates social behavior, anxiety, stress responses, and pain perception. Peripherally, it stimulates uterine contractions and lactation, but also promotes tissue repair signaling by promoting cell migration and proliferation, modulates inflammatory responses, and has been shown to affect cardiomyocyte differentiation and bone formation in research models.",
    researchApplications: [
      "Studies have investigated oxytocin receptor-mediated effects on social cognition signaling pathways",
      "Research has examined neuropeptide receptor mechanisms in various behavioral research models",
      "Research has examined tissue repair signaling through cell migration promotion",
      "Studies have explored anxiolytic effects and stress response modulation pathways",
    ],
    keyStudies: [
      {
        citation:
          "Viero C, et al. REVIEW: Oxytocin: Crossing the bridge between basic science and pharmacotherapy. CNS Neurosci Ther. 2010;16(5):e138-e156.",
        finding:
          "Comprehensive review of oxytocin's diverse physiological roles and research applications across social behavior signaling, stress pathways, metabolism, and tissue repair mechanisms.",
      },
      {
        citation:
          "Deing V, et al. Oxytocin modulates proliferation and stress responses of human skin cells: implications for atopic dermatitis. Exp Dermatol. 2013;22(6):399-405.",
        finding:
          "Oxytocin promoted skin cell proliferation and reduced oxidative stress markers in dermal fibroblasts, suggesting tissue repair and skin protective signaling functions.",
      },
    ],
    chemicalProperties: {
      molecularFormula: "C₄₃H₆₆N₁₂O₁₂S₂",
      molarMass: "1007.19 g/mol",
      type: "Peptide (cyclic nonapeptide)",
    },
  },
  {
    slug: "tb-500",
    name: "TB-500",
    category: "Healing, Recovery & Immune",
    type: "Peptide",
    description:
      "A synthetic peptide representing the active region of thymosin beta-4 (TB4). Studies have investigated its effects on actin regulation, cell migration, angiogenesis, and tissue repair mechanisms across multiple tissue types.",
    mechanism:
      "TB-500 is a synthetic version of the active region (amino acids 17-23, Ac-SDKP related sequence) of thymosin beta-4, a 43-amino acid protein that is the primary intracellular G-actin sequestering peptide. By binding to and sequestering monomeric G-actin, TB-500 regulates actin polymerization, which is essential for cell migration, cytokinesis, and cytoskeletal organization. This actin regulation promotes the migration of endothelial cells, keratinocytes, and stem/progenitor cells to sites of injury. TB-500 also promotes angiogenesis by upregulating VEGF expression and stimulates the production of extracellular matrix proteins. Additionally, it possesses anti-inflammatory properties through downregulation of inflammatory cytokines.",
    researchApplications: [
      "Studies have investigated tissue repair mechanisms through cell migration promotion",
      "Research has examined cardiac repair signaling and cardiomyocyte survival after ischemic injury in research models",
      "Studies have explored corneal tissue repair signaling and anti-inflammatory effects",
      "Research has assessed hair follicle stem cell migration and hair regrowth signaling pathways",
    ],
    keyStudies: [
      {
        citation:
          "Malinda KM, et al. Thymosin beta 4 accelerates wound healing. J Invest Dermatol. 1999;113(3):364-368.",
        finding:
          "Research investigated thymosin beta-4-mediated tissue repair mechanisms in rats, observing enhanced keratinocyte migration, collagen deposition signaling, and angiogenesis at the application site.",
      },
      {
        citation:
          "Smart N, et al. Thymosin beta 4 and angiogenesis: modes of action and therapeutic potential. Angiogenesis. 2007;10(4):229-241.",
        finding:
          "Reviewed thymosin beta-4's pro-angiogenic mechanisms, demonstrating its role in endothelial cell migration, survival, and tubule formation, with particular relevance to cardiac repair signaling after ischemia in research models.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (synthetic thymosin beta-4 fragment)",
    },
  },

  /* ─────────────────────────────────────────────────
     Cognitive & Longevity
     ───────────────────────────────────────────────── */
  {
    slug: "dihexa",
    name: "Dihexa",
    category: "Cognitive & Longevity",
    type: "Peptide",
    description:
      "A synthetic hexapeptide analog of angiotensin IV with potent nootropic properties. Preclinical studies have investigated cognitive signaling pathways through hepatocyte growth factor (HGF) pathway activation.",
    mechanism:
      "Dihexa (N-hexanoic-Tyr-Ile-(6) aminohexanoic amide) is a modified angiotensin IV analog that acts as a potent agonist of the hepatocyte growth factor (HGF)/c-Met receptor system. Unlike angiotensin IV, which binds to the AT4 receptor (IRAP), dihexa primarily augments HGF signaling by stabilizing the HGF dimer and promoting its binding to the c-Met receptor on neurons. This activation stimulates synaptogenesis, dendritic spine formation, and neurotrophic signaling through PI3K and MAPK pathways. In animal studies, dihexa has demonstrated modulation of cognitive signaling pathways at picomolar concentrations, approximately seven orders of magnitude more potent than BDNF in promoting spinogenesis.",
    researchApplications: [
      "Studies have investigated cognitive signaling pathways in scopolamine-impaired rat models",
      "Research has examined synaptogenesis and dendritic spine formation in vitro",
      "Studies have explored HGF/c-Met pathway activation as a nootropic mechanism",
      "Research has assessed potential applications in neurodegenerative disease research models",
    ],
    keyStudies: [
      {
        citation:
          "McCoy AT, et al. Evaluation of metabolically stabilized angiotensin IV analogs as procognitive/antidementia agents. J Pharmacol Exp Ther. 2013;344(1):141-154.",
        finding:
          "Research investigated dihexa-mediated HGF/c-Met receptor activation and its effects on cognitive signaling pathways in rat models, observing modulation of synaptic connectivity at concentrations approximately 10 million-fold lower than BDNF.",
      },
      {
        citation:
          "Benoist CC, et al. Facilitating neurocognitive function through HGF/Met system activation: evidence from the dihexa compound. Pharmacol Ther. 2014;158(2):172-180.",
        finding:
          "Demonstrated that dihexa augments HGF/c-Met signaling to drive spinogenesis and new synapse formation, establishing a novel procognitive mechanism independent of classical neurotransmitter systems.",
      },
    ],
  },
  {
    slug: "epitalon",
    name: "Epitalon (Epithalon)",
    category: "Cognitive & Longevity",
    type: "Peptide",
    description:
      "A synthetic tetrapeptide (Ala-Glu-Asp-Gly) based on the natural epithalamin peptide from the pineal gland. Studies have investigated its ability to activate telomerase and its effects on cellular lifespan signaling pathways.",
    mechanism:
      "Epitalon is a synthetic tetrapeptide designed to mimic the biological activity of epithalamin, a peptide extract from the pineal gland studied extensively by Vladimir Khavinson and colleagues. Its primary investigated mechanism is the activation of telomerase, the enzyme responsible for maintaining telomere length at chromosomal ends. By upregulating the catalytic subunit of telomerase (hTERT), epitalon may counteract the progressive telomere shortening that occurs with each cell division and contributes to cellular senescence. Additional reported effects include normalization of melatonin secretion patterns, modulation of antioxidant enzyme expression, and regulation of neuroendocrine function.",
    researchApplications: [
      "Studies have investigated telomerase activation and telomere elongation in cell cultures",
      "Research has examined effects on lifespan signaling pathways in animal models",
      "Studies have explored melatonin secretion normalization in aging research models",
      "Research has assessed antioxidant enzyme expression and oxidative stress reduction mechanisms",
    ],
    keyStudies: [
      {
        citation:
          "Khavinson VKh, et al. Peptide epitalon activates chromatin at the old age. Neuro Endocrinol Lett. 2003;24(5):329-333.",
        finding:
          "Epitalon treatment reactivated heterochromatin in aged tissue samples, suggesting modulation of gene expression patterns associated with aging research.",
      },
      {
        citation:
          "Anisimov VN, et al. Effect of Epitalon on biomarkers of aging, life span and spontaneous tumor incidence in female Swiss-derived SHR mice. Biogerontology. 2003;4(4):193-202.",
        finding:
          "Research investigated epitalon-mediated effects on aging biomarkers and lifespan signaling pathways in mice, observing modulation of age-related parameters without increased spontaneous tumor incidence.",
      },
    ],
    chemicalProperties: {
      molecularFormula: "C₁₄H₂₂N₄O₉",
      molarMass: "390.35 g/mol",
      type: "Peptide (tetrapeptide)",
    },
  },
  {
    slug: "humanin",
    name: "Humanin",
    category: "Cognitive & Longevity",
    type: "Peptide",
    description:
      "A 24-amino acid mitochondrial-derived peptide (MDP) encoded within the 16S ribosomal RNA region of mitochondrial DNA. Studies have investigated its cytoprotective, neuroprotective, and metabolic regulatory properties.",
    mechanism:
      "Humanin is the first identified mitochondrial-derived peptide, encoded by a short open reading frame within the MT-RNR2 gene of mitochondrial DNA. It acts through multiple pathways: binding to the FPRL1 receptor and the CNTFR/WSX-1/gp130 trimeric receptor complex to activate STAT3 signaling, direct interaction with IGFBP-3 and Bax to inhibit apoptosis, and modulation of mitochondrial function. Humanin protects cells against amyloid-beta toxicity, oxidative stress, and serum deprivation-induced apoptosis. It also modulates insulin sensitivity and glucose metabolism through central and peripheral mechanisms. Circulating humanin levels decline with age in humans.",
    researchApplications: [
      "Studies have investigated neuroprotection against amyloid-beta-induced cell death",
      "Research has examined cytoprotective effects against oxidative stress and apoptosis",
      "Studies have explored metabolic signaling effects including insulin sensitization pathways",
      "Research has assessed age-related decline in circulating humanin levels",
    ],
    keyStudies: [
      {
        citation:
          "Hashimoto Y, et al. A rescue factor abolishing neuronal cell death by a wide spectrum of familial Alzheimer's disease genes and Abeta. Proc Natl Acad Sci USA. 2001;98(11):6336-6341.",
        finding:
          "Identified humanin as an endogenous neuroprotective factor that rescues neurons from death induced by multiple familial Alzheimer's disease genes and amyloid-beta peptide in research models.",
      },
      {
        citation:
          "Lee C, et al. The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and reduces obesity and insulin resistance. Cell Metab. 2015;21(3):443-454.",
        finding:
          "Established the broader paradigm of mitochondrial-derived peptides as metabolic regulators, with humanin and MOTS-c demonstrating complementary protective functions in metabolic signaling pathway research.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (24 amino acids, mitochondrial-derived)",
    },
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    category: "Cognitive & Longevity",
    type: "Small Molecule",
    description:
      "Nicotinamide adenine dinucleotide, a coenzyme central to cellular energy metabolism and over 500 enzymatic reactions. Studies have investigated its role in sirtuin activation, DNA repair, and age-related metabolic signaling pathways.",
    mechanism:
      "NAD+ (nicotinamide adenine dinucleotide) is an essential coenzyme present in every living cell, functioning as a critical electron carrier in mitochondrial oxidative phosphorylation and glycolysis. Beyond its redox role, NAD+ serves as a substrate for three classes of enzymes central to cellular homeostasis: sirtuins (SIRT1-7), which regulate gene expression, DNA repair, and metabolic function; poly(ADP-ribose) polymerases (PARPs), which mediate DNA damage repair; and CD38/CD157 ectoenzymes, which regulate calcium signaling and immune function. NAD+ levels decline significantly with aging, potentially contributing to mitochondrial dysfunction, impaired DNA repair, and metabolic dysregulation associated with age-related research models.",
    researchApplications: [
      "Studies have investigated NAD+ precursor supplementation (NMN, NR) for age-related NAD+ decline research",
      "Research has examined sirtuin-mediated effects on lifespan and healthspan signaling in model organisms",
      "Studies have explored NAD+ repletion for mitochondrial function restoration in research models",
      "Research has assessed direct NAD+ infusion for metabolic and neurological signaling pathways",
    ],
    keyStudies: [
      {
        citation:
          "Yoshino J, et al. NAD+ intermediates: the biology and therapeutic potential of NMN and NR. Cell Metab. 2018;27(3):513-528.",
        finding:
          "Comprehensive review establishing that NAD+ decline is a hallmark of aging and that NAD+ precursor supplementation can restore tissue NAD+ levels and modulate metabolic signaling in aged animal models.",
      },
      {
        citation:
          "Imai S, Guarente L. NAD+ and sirtuins in aging and disease. Trends Cell Biol. 2014;24(8):464-471.",
        finding:
          "Demonstrated the central role of NAD+-sirtuin signaling axis in aging research, establishing that maintenance of NAD+ levels preserves sirtuin activity and modulates age-related metabolic signaling pathways.",
      },
    ],
    chemicalProperties: {
      molecularFormula: "C₂₁H₂₇N₇O₁₄P₂",
      molarMass: "663.43 g/mol",
      type: "Coenzyme (dinucleotide)",
    },
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Cognitive & Longevity",
    type: "Peptide",
    description:
      "A synthetic heptapeptide analog of the immunomodulatory peptide tuftsin with an additional Pro-Gly-Pro sequence. Studies have investigated its anxiolytic, nootropic, and immunomodulatory properties.",
    mechanism:
      "Selank (Thr-Lys-Pro-Arg-Pro-Gly-Pro) is a synthetic peptide combining the tuftsin sequence (Thr-Lys-Pro-Arg) with a glyproline motif (Pro-Gly-Pro) that confers enzymatic stability. Its anxiolytic mechanism involves modulation of brain-derived neurotrophic factor (BDNF) expression, enhancement of serotonergic and GABAergic neurotransmission, and inhibition of enkephalin-degrading enzymes. Selank increases BDNF mRNA expression in the hippocampus, modulates the balance of T-helper cell cytokines, and influences the expression of over 50 genes related to the immune response. It does not produce sedation, dependence, or amnesia at anxiolytic doses.",
    researchApplications: [
      "Studies have investigated anxiolytic effects without sedation or cognitive impairment",
      "Research has examined BDNF modulation and cognitive signaling pathways",
      "Studies have explored immunomodulatory effects through cytokine regulation",
      "Research has assessed its anxiolytic receptor pharmacology in multiple study settings",
    ],
    keyStudies: [
      {
        citation:
          "Semenova TP, et al. Selank (TPKRPGP) and the analogue (HLPGP) modulate the content of monoamines and their metabolites in the brain. Eksp Klin Farmakol. 2009;72(3):34-37.",
        finding:
          "Selank modulated serotonin metabolism and norepinephrine turnover in the brain, providing a mechanistic basis for its anxiolytic effects without affecting dopamine systems.",
      },
      {
        citation:
          "Kozlovskii II, Danchev ND. The optimizing action of the synthetic peptide Selank on a conditioned active avoidance reflex in rats. Neurosci Behav Physiol. 2003;33(7):639-643.",
        finding:
          "Selank enhanced learning and memory signaling in conditioned avoidance tasks without producing sedation or motor impairment, distinguishing it from benzodiazepine anxiolytics.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (heptapeptide)",
    },
  },
  {
    slug: "semax",
    name: "Semax",
    category: "Cognitive & Longevity",
    type: "Peptide",
    description:
      "A synthetic heptapeptide analog of the ACTH(4-7) fragment with a Pro-Gly-Pro C-terminal extension. Studies have investigated its neuroprotective, nootropic, and neurotrophic properties.",
    mechanism:
      "Semax (Met-Glu-His-Phe-Pro-Gly-Pro) is a synthetic analog of the ACTH(4-10) fragment, specifically the ACTH(4-7) sequence with a Pro-Gly-Pro stabilizing extension. Unlike ACTH, semax does not stimulate adrenal cortisol production. Its primary mechanisms include upregulation of BDNF and its receptor TrkB, modulation of serotonergic systems, enhancement of neuronal survival through the MAPK/ERK signaling cascade, and modulation of cerebral blood flow. Semax has demonstrated neuroprotective effects in stroke models by reducing infarct volume, promoting neuroplasticity, and modulating the expression of neurotrophins and their receptors in the central nervous system.",
    researchApplications: [
      "Studies have investigated its neuroprotective signaling in cerebral ischemia research models",
      "Studies have examined BDNF upregulation and cognitive signaling pathways",
      "Research has explored neuroprotective mechanisms in cerebral ischemia models",
      "Studies have assessed effects on attention, memory, and learning signaling in research subjects",
    ],
    keyStudies: [
      {
        citation:
          "Dolotov OV, et al. Semax, an analog of ACTH(4-10) with cognitive effects, regulates BDNF and trkB expression in the rat hippocampus. Brain Res. 2006;1117(1):54-60.",
        finding:
          "Semax increased BDNF mRNA expression and TrkB receptor levels in the rat hippocampus, establishing a neurotrophic mechanism for its cognitive-modulating effects.",
      },
      {
        citation:
          "Gusev EI, et al. Semax in prevention of disease progress and development of exacerbations in patients with cerebrovascular insufficiency. Zh Nevrol Psikhiatr Im S S Korsakova. 2005;105(2):35-40.",
        finding:
          "Research examined semax-mediated neuroprotective signaling pathways in a cerebrovascular insufficiency model, observing modulation of neurological signaling parameters and cognitive function markers.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (heptapeptide, ACTH analog)",
    },
  },
  {
    slug: "slu-pp-332",
    name: "SLU-PP-332",
    category: "Cognitive & Longevity",
    type: "Small Molecule",
    description:
      "A selective agonist of estrogen-related receptor gamma (ERRgamma), an orphan nuclear receptor involved in oxidative metabolism. Preclinical studies have investigated its potential as an exercise mimetic.",
    mechanism:
      "SLU-PP-332 is a synthetic small molecule that selectively activates estrogen-related receptor gamma (ERRgamma), an orphan nuclear receptor highly expressed in metabolically active tissues including skeletal muscle, heart, and brown adipose tissue. ERRgamma regulates the transcription of genes involved in oxidative phosphorylation, fatty acid oxidation, and mitochondrial biogenesis. By activating ERRgamma, SLU-PP-332 has been shown in preclinical models to shift skeletal muscle fiber composition toward oxidative type I fibers, increase mitochondrial content, enhance exercise endurance, and modulate metabolic parameters — effects that partially mimic the adaptations produced by aerobic exercise training.",
    researchApplications: [
      "Studies have investigated exercise-mimetic effects on skeletal muscle fiber type composition",
      "Research has examined mitochondrial biogenesis and oxidative metabolism enhancement",
      "Studies have explored endurance performance effects in sedentary animal models",
      "Research has assessed metabolic pathway modulation including fat oxidation and glucose handling",
    ],
    keyStudies: [
      {
        citation:
          "Kim SH, et al. ERRgamma agonist SLU-PP-332 ameliorates metabolic dysfunction through enhanced exercise capacity. J Clin Invest. 2023;133(10):e162326.",
        finding:
          "Research investigated SLU-PP-332-mediated ERRgamma activation and its effects on skeletal muscle metabolism, observing promotion of oxidative muscle fiber formation and modulation of metabolic signaling pathways without exercise training.",
      },
      {
        citation:
          "Willy PJ, et al. Regulation of PPARgamma coactivator 1alpha (PGC-1alpha) signaling by an estrogen-related receptor alpha (ERRalpha) ligand. Proc Natl Acad Sci USA. 2004;101(24):8912-8917.",
        finding:
          "Foundational work establishing the ERR family as regulators of mitochondrial metabolism and PGC-1alpha signaling, providing the biological basis for ERRgamma-targeted exercise mimetics.",
      },
    ],
  },
  {
    slug: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "Cognitive & Longevity",
    type: "Peptide",
    description:
      "A mitochondria-targeted tetrapeptide that selectively binds to cardiolipin in the inner mitochondrial membrane. Studies have investigated its effects on mitochondrial function in research models of heart failure and mitochondrial myopathy.",
    mechanism:
      "SS-31 (D-Arg-dimethylTyr-Lys-Phe-NH2, also known as elamipretide or MTP-131) is a cell-permeable, mitochondria-targeted peptide that concentrates >1000-fold in mitochondria. It selectively binds to cardiolipin, a phospholipid unique to the inner mitochondrial membrane that is essential for the organization of electron transport chain complexes. By stabilizing cardiolipin-dependent interactions of cytochrome c with the inner membrane, SS-31 optimizes electron transfer, reduces electron leak and reactive oxygen species (ROS) production, and improves ATP generation efficiency. In aged and diseased mitochondria where cardiolipin oxidation is prevalent, SS-31 restores bioenergetic function.",
    researchApplications: [
      "Studies have investigated mitochondrial function in primary mitochondrial myopathy research models (Barth syndrome)",
      "Studies have examined cardiac function signaling in heart failure research models",
      "Research has explored renal protective effects in ischemia-reperfusion injury models",
      "Studies have assessed age-related mitochondrial dysfunction and skeletal muscle function signaling",
    ],
    keyStudies: [
      {
        citation:
          "Birk AV, et al. The mitochondrial-targeted compound SS-31 re-energizes ischemic mitochondria by interacting with cardiolipin. J Am Soc Nephrol. 2013;24(8):1250-1261.",
        finding:
          "Demonstrated that SS-31 binds specifically to cardiolipin, restores electron transport chain function in ischemic mitochondria, and reduces ROS production while improving ATP synthesis.",
      },
      {
        citation:
          "Szeto HH. First-in-class cardiolipin-protective compound as a therapeutic agent to restore mitochondrial bioenergetics. Br J Pharmacol. 2014;171(8):2029-2050.",
        finding:
          "Review establishing SS-31 as the first compound specifically designed to target and protect cardiolipin, with demonstrated efficacy in research models of heart failure, renal injury, and neurodegeneration.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (tetrapeptide, mitochondria-targeted)",
    },
  },

  /* ─────────────────────────────────────────────────
     Sexual Health & Specialty
     ───────────────────────────────────────────────── */
  {
    slug: "dsip",
    name: "DSIP (Delta Sleep-Inducing Peptide)",
    category: "Sexual Health & Specialty",
    type: "Peptide",
    description:
      "A nonapeptide originally isolated from rabbit cerebral venous blood during induced sleep. Studies have investigated its effects on sleep architecture, stress modulation, and neuroendocrine regulation.",
    mechanism:
      "Delta Sleep-Inducing Peptide (Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu) is a naturally occurring nonapeptide identified by Schoenenberger and Monnier in 1977. Despite its name, its effects on sleep are more nuanced than simple sleep induction. DSIP modulates sleep architecture by promoting delta wave (slow-wave) sleep patterns and normalizing disturbed sleep-wake cycles. Its mechanisms include modulation of GABA-ergic and glutamatergic signaling, reduction of corticotropin release during stress, and interaction with opioid systems. DSIP also influences LH release, somatostatin levels, and has been shown to have analgesic and antioxidant properties. It readily crosses the blood-brain barrier.",
    researchApplications: [
      "Studies have investigated sleep architecture normalization in insomnia research models",
      "Research has examined stress response modulation and cortisol regulation pathways",
      "Studies have explored analgesic properties and opioid system interactions",
      "Research has assessed neuroendocrine effects on LH and somatostatin signaling",
    ],
    keyStudies: [
      {
        citation:
          "Graf MV, Kastin AJ. Delta-sleep-inducing peptide (DSIP): a review. Neurosci Biobehav Rev. 1984;8(1):83-93.",
        finding:
          "Comprehensive review of DSIP pharmacology establishing its effects on sleep architecture, stress responses, and neuroendocrine function, while noting that its sleep-promoting effects are modulatory rather than hypnotic.",
      },
      {
        citation:
          "Prudchenko IA, et al. Structure-function studies of DSIP. Ann N Y Acad Sci. 1990;897:53-60.",
        finding:
          "Structure-activity analysis identified the minimal functional sequences within DSIP responsible for its neuromodulatory effects and established key residues for receptor binding.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (nonapeptide)",
    },
  },
  {
    slug: "kisspeptin",
    name: "Kisspeptin",
    category: "Sexual Health & Specialty",
    type: "Peptide",
    description:
      "A neuropeptide encoded by the KISS1 gene that acts as the master upstream regulator of the reproductive hormone axis. Studies have investigated its role in stimulating GnRH release and modulating reproductive signaling pathways.",
    mechanism:
      "Kisspeptin is a family of peptides (kisspeptin-54, -14, -13, -10) derived from proteolytic cleavage of the KISS1 gene product. All forms share a common C-terminal decapeptide sequence that binds to and activates the kisspeptin receptor (KISS1R/GPR54) on GnRH neurons in the hypothalamus. This activation is the primary physiological trigger for pulsatile GnRH secretion, which in turn drives the pituitary release of luteinizing hormone (LH) and follicle-stimulating hormone (FSH). Kisspeptin integrates metabolic, stress, and photoperiod signals to coordinate reproductive function. Loss-of-function mutations in KISS1 or KISS1R cause hypogonadotropic hypogonadism.",
    researchApplications: [
      "Studies have investigated kisspeptin as a diagnostic tool for reproductive signaling pathway research",
      "Research has examined its effects on hypothalamic GnRH signaling in amenorrhea research models",
      "Studies have explored kisspeptin-mediated LH release mechanisms in reproductive research",
      "Research has assessed its role in puberty onset and reproductive endocrinology signaling",
    ],
    keyStudies: [
      {
        citation:
          "Dhillo WS, et al. Kisspeptin-54 stimulates the hypothalamic-pituitary gonadal axis in human males. J Clin Endocrinol Metab. 2005;90(12):6609-6615.",
        finding:
          "Research investigated kisspeptin-54-mediated activation of the hypothalamic-pituitary-gonadal signaling axis, observing potent and dose-dependent modulation of LH and FSH release pathways.",
      },
      {
        citation:
          "Abbara A, et al. Efficacy of kisspeptin-54 to trigger oocyte maturation in women at high risk of ovarian hyperstimulation syndrome (OHSS) during in vitro fertilization (IVF) therapy. J Clin Endocrinol Metab. 2015;100(9):3322-3331.",
        finding:
          "Research examined kisspeptin-54-mediated oocyte maturation signaling in IVF research subjects, with observations of a more favorable ovarian hyperstimulation risk profile compared to hCG-based approaches.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (neuropeptide, 10-54 amino acids)",
    },
  },
  {
    slug: "melanotan-2",
    name: "Melanotan 2",
    category: "Sexual Health & Specialty",
    type: "Peptide",
    description:
      "A synthetic cyclic heptapeptide analog of alpha-melanocyte stimulating hormone (alpha-MSH). Studies have investigated its activation of melanocortin receptors, producing effects on melanogenesis and melanocortin receptor-mediated signaling pathways.",
    mechanism:
      "Melanotan 2 (MT-II) is a cyclic lactam analog of alpha-MSH that non-selectively activates melanocortin receptors MC1R through MC5R. MC1R activation on melanocytes stimulates eumelanin production via the cAMP/PKA pathway, producing skin darkening (tanning) independent of UV exposure. MC3R and MC4R activation in the hypothalamus modulates satiety signaling pathways and other neuroendocrine functions. MC4R activation in the paraventricular nucleus has been particularly associated with vascular smooth muscle signaling, mediated by oxytocin neuron activation and downstream effects on vascular tissue. The cyclic structure provides enhanced receptor binding and metabolic stability.",
    researchApplications: [
      "Studies have investigated UV-independent melanogenesis for potential photoprotection research",
      "Research has examined melanocortin receptor binding mechanisms and MC4R signaling pathways",
      "Studies have explored satiety signaling pathway activation and metabolic effects",
      "Research has assessed vascular smooth muscle signaling through melanocortin receptor pathways",
    ],
    keyStudies: [
      {
        citation:
          "Dorr RT, et al. Effects of a superpotent melanotropic peptide in combination with solar UV radiation on tanning of the skin in human volunteers. Arch Dermatol. 1996;132(3):272-278.",
        finding:
          "Research investigated melanotan II-mediated MC1R activation and melanogenesis signaling, observing enhanced melanin production with effects synergistic to UV exposure and persisting after treatment cessation.",
      },
      {
        citation:
          "Wessells H, et al. Synthetic melanotropic peptide initiates erections in men with psychogenic erectile dysfunction: double-blind, placebo controlled crossover study. J Urol. 1998;160(2):389-393.",
        finding:
          "Research examined MC4R-mediated vascular smooth muscle signaling in a double-blind, placebo-controlled study, establishing the melanocortin receptor pathway mechanism for vascular tissue effects.",
      },
    ],
    chemicalProperties: {
      type: "Peptide (cyclic heptapeptide)",
    },
  },

  /* ─────────────────────────────────────────────────
     Blended Stacks
     ───────────────────────────────────────────────── */
  {
    slug: "glow-stack",
    name: "GLOW Stack",
    category: "Blended Stacks",
    type: "Peptide Blend",
    description:
      "A regenerative peptide blend combining GHK-Cu (50mg), BPC-157 (10mg), and TB-500 (10mg) totaling 70mg. This formulation combines three compounds studied for their roles in ECM remodeling, angiogenesis, and cell migration.",
    mechanism:
      "The GLOW Stack combines three peptides with complementary tissue-repair mechanisms. GHK-Cu (50mg) serves as the foundation, driving extracellular matrix remodeling through upregulation of collagen, elastin, and glycosaminoglycan synthesis, while modulating over 4,000 genes involved in tissue repair signaling and antioxidant defense. BPC-157 (10mg) promotes angiogenesis via VEGF pathway upregulation and supports tissue repair mechanisms across gastrointestinal, musculoskeletal, and neurological tissues through its interaction with the NO system. TB-500 (10mg) regulates actin polymerization to enhance cell migration, supporting the movement of endothelial cells, keratinocytes, and progenitor cells to sites of tissue damage. Together, these three mechanisms — ECM remodeling, new blood vessel formation, and directed cell migration — represent a multi-pathway approach to tissue regeneration research.",
    researchApplications: [
      "Component studies have individually investigated tissue repair signaling mechanisms",
      "Research on GHK-Cu has examined ECM remodeling and gene expression modulation",
      "BPC-157 studies have explored angiogenic and cytoprotective mechanisms",
      "TB-500 research has assessed actin-mediated cell migration in preclinical wound models",
    ],
    keyStudies: [
      {
        citation:
          "Pickart L, et al. The human tripeptide GHK-Cu in prevention of oxidative stress and degenerative conditions of aging. Oxid Med Cell Longev. 2012;2012:324832.",
        finding:
          "GHK-Cu was shown to modulate expression of 31.2% of the human genome with significant tissue-remodeling and antioxidant gene upregulation.",
      },
      {
        citation:
          "Chang CH, et al. The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration. J Appl Physiol. 2011;110(3):774-780.",
        finding:
          "BPC-157 promoted tendon repair signaling through enhanced cell outgrowth, survival, and migration mechanisms.",
      },
      {
        citation:
          "Malinda KM, et al. Thymosin beta 4 accelerates wound healing. J Invest Dermatol. 1999;113(3):364-368.",
        finding:
          "Thymosin beta-4 (TB-500 parent compound) promoted tissue repair signaling through enhanced keratinocyte migration, collagen deposition, and angiogenesis mechanisms.",
      },
    ],
    chemicalProperties: {
      type: "Peptide Blend (3 components, 70mg total)",
    },
  },
  {
    slug: "klow-stack",
    name: "KLOW Stack",
    category: "Blended Stacks",
    type: "Peptide Blend",
    description:
      "An enhanced regenerative peptide blend combining GHK-Cu (50mg), BPC-157 (10mg), TB-500 (10mg), and KPV (10mg) totaling 80mg. This formulation adds anti-inflammatory NF-kappaB suppression to the GLOW Stack's tissue-repair mechanisms, designed for research into sensitive or inflamed tissue conditions.",
    mechanism:
      "The KLOW Stack builds upon the GLOW Stack formulation by adding KPV (10mg), the anti-inflammatory tripeptide derived from alpha-MSH. While GHK-Cu drives ECM remodeling, BPC-157 promotes angiogenesis, and TB-500 facilitates cell migration, KPV contributes targeted anti-inflammatory activity through direct inhibition of NF-kappaB nuclear translocation. This suppresses the production of pro-inflammatory cytokines (TNF-alpha, IL-1beta, IL-6) that can impair tissue repair signaling. The addition of KPV addresses the inflammatory component of tissue damage, particularly relevant in research models characterized by excessive or chronic inflammation such as post-procedural inflammation and autoimmune-mediated tissue damage models.",
    researchApplications: [
      "Component studies have investigated combined tissue repair and anti-inflammatory signaling approaches",
      "KPV research has examined NF-kappaB suppression in inflammatory skin and GI research models",
      "Studies on individual components have explored tissue repair signaling in inflamed tissue environments",
      "Research has assessed multi-peptide approaches for post-procedural recovery research models",
    ],
    keyStudies: [
      {
        citation:
          "Getting SJ, et al. Molecular determinants of the anti-inflammatory function of the C-terminus of alpha-MSH. Biochemistry. 2001;40(8):2205-2213.",
        finding:
          "KPV retained full anti-inflammatory activity of alpha-MSH, demonstrating potent NF-kappaB inhibition and cytokine suppression.",
      },
      {
        citation:
          "Pickart L, et al. The human tripeptide GHK-Cu in prevention of oxidative stress and degenerative conditions of aging. Oxid Med Cell Longev. 2012;2012:324832.",
        finding:
          "GHK-Cu demonstrated broad gene expression modulation with tissue-protective and antioxidant properties.",
      },
      {
        citation:
          "Sikiric P, et al. Brain-gut axis and pentadecapeptide BPC 157: theoretical and practical implications. Curr Neuropharmacol. 2016;14(8):857-865.",
        finding:
          "BPC-157 demonstrated multi-system tissue-protective signaling mechanisms with favorable preclinical safety.",
      },
    ],
    chemicalProperties: {
      type: "Peptide Blend (4 components, 80mg total)",
    },
  },
  {
    slug: "super-human-blend",
    name: "Super Human Blend (SHB)",
    category: "Blended Stacks",
    type: "Amino Acid Blend",
    description:
      "A comprehensive amino acid formulation containing L-Arginine (110mg), L-Citrulline (120mg), L-Glutamine (40mg), L-Taurine (60mg), L-Ornithine (110mg), L-Lysine (70mg), L-Proline (60mg), L-Carnitine (220mg), and NAC (75mg). Studies on individual components have investigated nitric oxide production, mitochondrial energy metabolism, and recovery signaling pathways.",
    mechanism:
      "The Super Human Blend combines amino acids and amino acid derivatives with complementary metabolic functions. L-Arginine and L-Citrulline serve as substrates and recycling partners for nitric oxide synthase (NOS), sustaining nitric oxide production for vasodilation and blood flow. L-Ornithine participates in the urea cycle to support ammonia clearance during metabolic stress. L-Carnitine (220mg, the largest component) facilitates mitochondrial fatty acid transport via the carnitine shuttle, supporting energy production from fat oxidation. L-Glutamine supports immune cell function and intestinal barrier integrity. L-Taurine acts as an osmolyte and antioxidant with membrane-stabilizing properties. L-Lysine supports collagen synthesis and calcium absorption. L-Proline is a direct collagen precursor. NAC (N-acetylcysteine) replenishes intracellular glutathione, the master antioxidant.",
    researchApplications: [
      "Studies on arginine/citrulline have investigated nitric oxide production and vascular function signaling",
      "L-Carnitine research has examined mitochondrial fatty acid oxidation and energy metabolism pathways",
      "Glutamine studies have explored immune function and gut barrier integrity signaling",
      "NAC research has assessed glutathione repletion and antioxidant defense mechanisms",
    ],
    keyStudies: [
      {
        citation:
          "Schwedhelm E, et al. Pharmacokinetic and pharmacodynamic properties of oral L-citrulline and L-arginine: impact on nitric oxide metabolism. Br J Clin Pharmacol. 2008;65(1):51-59.",
        finding:
          "Oral L-citrulline was more effective than L-arginine at increasing plasma arginine levels and NO-dependent biomarkers, supporting the rationale for combined arginine/citrulline supplementation research.",
      },
      {
        citation:
          "Fielding R, et al. L-Carnitine supplementation in recovery after exercise. Nutrients. 2018;10(3):349.",
        finding:
          "Systematic review established that L-carnitine supplementation modulated markers of metabolic stress and muscle damage signaling in exercise research models.",
      },
      {
        citation:
          "Samuni Y, et al. The chemistry and biological activities of N-acetylcysteine. Biochim Biophys Acta. 2013;1830(8):4117-4129.",
        finding:
          "Comprehensive review of NAC's mechanisms as a glutathione precursor, direct antioxidant, and mucolytic agent, with broad research applications.",
      },
    ],
    chemicalProperties: {
      type: "Amino Acid Blend (9 components, 865mg total)",
    },
  },
];

export function getCompoundBySlug(slug: string): ResearchCompound | undefined {
  return researchCompounds.find((c) => c.slug === slug);
}

export function getCompoundsByCategory(category: string): ResearchCompound[] {
  if (!category || category === "All") return researchCompounds;
  return researchCompounds.filter((c) => c.category === category);
}
