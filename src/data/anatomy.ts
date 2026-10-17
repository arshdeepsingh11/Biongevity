/**
 * Realistic 3D anatomy for each department — published 3D models embedded through Sketchfab's official viewer
 * (each author allows embedding; credit is shown under the viewer). Swap a model by changing its `id`.
 * Note: anatomy3datlas.com models are "© Catfish Animation Studio — all rights reserved", so they are not used here.
 */
export interface AnatomyModel { id: string; title: string; author: string; authorUrl: string; label: string }

const M = (id: string, label: string, title: string, author: string, handle: string): AnatomyModel => ({ id, label, title, author, authorUrl: `https://sketchfab.com/${handle}` });

const HEART_EXT = M("10472481071e4375b8233289c277d411", "Outside the heart", "External Human Heart Anatomy", "University of Dundee, CAHID", "anatomy_dundee");
