/**
 * Realistic 3D anatomy for each department — published 3D models embedded through Sketchfab's official viewer
 * (each author allows embedding; credit is shown under the viewer). Swap a model by changing its `id`.
 * Note: anatomy3datlas.com models are "© Catfish Animation Studio — all rights reserved", so they are not used here.
 */
export interface AnatomyModel { id: string; title: string; author: string; authorUrl: string; label: string; thumb: string }

/** Each model's published Sketchfab preview image — shown instantly while the 3D viewer loads. */
const THUMBS: Record<string, string> = {
  "10472481071e4375b8233289c277d411": "68e5635cb31544c59384e4e01b00934b/6ebc7ab1ad6442579aa397a643e611a1",
  "1e947b39c2e545128dad5d66b391b4d8": "0d47c55d05c0408aa5838b904464ce82/8d970b19740245ffb5a80c2c277abd8f",
  "2c902649de1843e9b2e004a99a9ab923": "5e080f902f944814b49cbb0bdbf0763c/655015c9b0ef4298b50ce20ceffc2c57",
  "2d3771dd6b8940ffa2312bd97aca6fc3": "c55dfe01b0ab40db968628cd61e6a9bc/969fd1e1d1f748588a123b682effa071",
  "362a402b367e4b16bd9682b3e6541df4": "a7aa1ffc316046f9875850c79a0e3f80/ec260d54b00740f59d5b64ed52b1591b",
  "37ca10b0c9df4484b017826d4b48362b": "f4d04cd478dd4e868ce5914f89d0c418/3bc66ef769e3493398c8903747775ace",
  "50216e5e7716436c8153ad05a732fecb": "a6317d5b94f54721a88955141e37cbf1/5a88b0313ded486c903831edd2d3ed76",
  "5e15cc97ef674446bf9f3e527c38d646": "3809785e4d1144c19c4c9ec20cb35d05/90616f3689b144e99a0a5805912151d6",
  "825a5e22137648bea50c700be7ba34bc": "fb030b4d73a3433aad6d14ae0d1a4d3a/f711da114904456a8a0b396d3546ab28",
  "9cc281349c314cc4859e26af238f9cd5": "e02ef8fdd8c449149b48b7d92bf750a0/b385fcef5178452283c4c9318dfa3585",
  "9d16d219525846d29734ed1d09ffd945": "08684a9fe5924dd5a2a79afdfa4b1b0c/5dcdce811cd845a0a970ab1a3d3d333d",
  "9f48eaa481cc4a43baeb9e1f03882cff": "6dd99e5c825e4975a6ec8bafdc865b96/291f009315504c9694b0462cc7b16e68",
  "acab057d3f5b4d86be475a2be0c8d0c7": "1442c2fa34274ff29326b8db901c894c/5953759675e84306b6330984e9871ad0",
  "b2aac93ee4c440ed911f5765158edc9f": "93307d4755b14e679ca987c1a5a38ed5/57cdf102304d4c52873e18cb252bcda4",
};
const thumbUrl = (id: string) => `https://media.sketchfab.com/models/${id}/thumbnails/${THUMBS[id]}.jpeg`;

const M = (id: string, label: string, title: string, author: string, handle: string): AnatomyModel => ({ id, label, title, author, authorUrl: `https://sketchfab.com/${handle}`, thumb: thumbUrl(id) });

const HEART_EXT = M("10472481071e4375b8233289c277d411", "Outside the heart", "External Human Heart Anatomy", "University of Dundee, CAHID", "anatomy_dundee");
const HEART_INT = M("9f48eaa481cc4a43baeb9e1f03882cff", "Inside the heart", "Internal Human Heart Anatomy", "University of Dundee, CAHID", "anatomy_dundee");
const LUNGS = M("825a5e22137648bea50c700be7ba34bc", "Lungs & pleura", "The Lungs and Pleura", "theanatomycode", "theanatomycode");
const BREATH = M("50216e5e7716436c8153ad05a732fecb", "Breathing in motion", "Human Respiratory System Breathing Animation", "Brave.Pixel", "Brave.Pixel");
const SKIN = M("2c902649de1843e9b2e004a99a9ab923", "Skin layers", "Human skin – integumentary system", "Ebers", "Ebers");
const BRAIN = M("b2aac93ee4c440ed911f5765158edc9f", "Regions of the brain", "Regions of the brain", "University of Dundee, CAHID", "anatomy_dundee");
const GUT = M("2d3771dd6b8940ffa2312bd97aca6fc3", "Digestive system", "Digestive system", "bioilustra", "bioilustra");
const LIVER = M("362a402b367e4b16bd9682b3e6541df4", "Liver & gallbladder", "Anatomy – Human Liver and Gallbladder", "FrancescoMilanese", "FrancescoMilanese");
const THYROID = M("37ca10b0c9df4484b017826d4b48362b", "Thyroid gland", "Thyroid Gland", "Tecdes SA", "tecdessa");
const KIDNEYS = M("acab057d3f5b4d86be475a2be0c8d0c7", "Kidneys", "Human kidneys for Medical Education", "parvin8borhan", "parvin8borhan");
const TOOTH = M("9cc281349c314cc4859e26af238f9cd5", "Tooth cross-section", "Tooth cross-section", "Ebers", "Ebers");
const KNEE = M("1e947b39c2e545128dad5d66b391b4d8", "Knee: bones & cartilage", "Knee anatomy: bones and cartilage", "University of Dundee, CAHID", "anatomy_dundee");
const FEMALE = M("5e15cc97ef674446bf9f3e527c38d646", "Female reproductive organs", "Female Reproductive Organs", "Stanford Medicine EdTech", "stanfordedtech");
const PROSTATE = M("9d16d219525846d29734ed1d09ffd945", "Bladder & prostate", "Bladder And Prostate Anatomy", "Nima", "h3ydari96");

export const ANATOMY: Record<string, AnatomyModel[]> = {
  cardiology: [HEART_EXT, HEART_INT],
  "heart-failure": [HEART_INT, HEART_EXT],
  "respiratory-medicine": [LUNGS, BREATH],
  "skin-health": [SKIN],
  "geriatric-medicine": [BRAIN, KNEE],
  "mental-health": [BRAIN],
  "gut-health": [GUT, LIVER],
  nutrition: [GUT, LIVER],
  endocrinology: [THYROID, KIDNEYS],
  "internal-medicine": [KIDNEYS, LIVER, HEART_EXT],
  dental: [TOOTH],
  "pediatric-rheumatology": [KNEE],
  "womens-health": [FEMALE],
  "mens-health": [PROSTATE],
};

export const sketchfabEmbed = (id: string) =>
  `https://sketchfab.com/models/${id}/embed?autostart=1&preload=1&transparent=1&ui_theme=dark&ui_infos=0&ui_watermark_link=0&ui_help=0&ui_settings=0&ui_vr=0&ui_ar=0&ui_inspector=0&ui_annotations=1&dnt=1&autospin=0.12`;
