"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

type Site = { floors: number; floor: number; suite: string; building: string; note: string };

/** Illustrative clinic layout per city (rooms change by site). */
const ROOMS: Record<string, { id: string; t: string; d: string; x: number; y: number; w: number; h: number }[]> = {
  Calgary: [
    { id: "rec", t: "Reception", d: "Check in and update your details", x: 60, y: 40, w: 110, h: 70 },
    { id: "wait", t: "Lounge", d: "Quiet waiting area", x: 170, y: 40, w: 90, h: 70 },
    { id: "c1", t: "Consult 1", d: "Specialist consultations", x: 260, y: 40, w: 70, h: 70 },
    { id: "c2", t: "Consult 2", d: "Specialist consultations", x: 330, y: 40, w: 70, h: 70 },
    { id: "echo", t: "Echo & stress", d: "Echocardiography and exercise stress echo", x: 260, y: 150, w: 140, h: 80 },
    { id: "ecg", t: "ECG · Holter", d: "Heart rhythm tests and monitor fitting", x: 170, y: 150, w: 90, h: 80 },
    { id: "lab", t: "Lab draw", d: "Blood samples for BioAro Labs", x: 60, y: 150, w: 110, h: 80 },
  ],
  Dubai: [
    { id: "rec", t: "Reception", d: "Check in", x: 60, y: 40, w: 120, h: 70 },
    { id: "c1", t: "Longevity consult", d: "Precision internal medicine and endocrinology", x: 180, y: 40, w: 120, h: 70 },
    { id: "assess", t: "Assessment suite", d: "VO₂ max, spirometry, grip, body composition", x: 300, y: 40, w: 100, h: 190 },
    { id: "lab", t: "Lab & genomics", d: "Samples for genetic and microbiome tests", x: 60, y: 150, w: 120, h: 80 },
    { id: "aes", t: "Precision aesthetics", d: "Skin and aesthetic care", x: 180, y: 150, w: 120, h: 80 },
  ],
  Almelo: [
    { id: "rec", t: "Front desk", d: "Visitors and deliveries", x: 60, y: 40, w: 140, h: 70 },
    { id: "lab", t: "Lab operations", d: "BioAro Europe laboratory operations", x: 200, y: 40, w: 200, h: 190 },
    { id: "office", t: "Offices", d: "Science and operations team", x: 60, y: 150, w: 140, h: 80 },
  ],
};
