/**
 * Realistic 3D anatomy for each department — published 3D models embedded through Sketchfab's official viewer
 * (each author allows embedding; credit is shown under the viewer). Swap a model by changing its `id`.
 * Note: anatomy3datlas.com models are "© Catfish Animation Studio — all rights reserved", so they are not used here.
 */
export interface AnatomyModel { id: string; title: string; author: string; authorUrl: string; label: string }

const M = (id: string, label: string, title: string, author: string, handle: string): AnatomyModel => ({ id, label, title, author, authorUrl: `https://sketchfab.com/${handle}` });

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
