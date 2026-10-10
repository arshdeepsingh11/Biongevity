import {
  Activity, ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Sparkles, Search, User, Menu, X, ArrowUp,
  HeartPulse, Brain, Stethoscope, Dna, FlaskConical, Pill, CalendarDays, FileText, Leaf, Moon, Dumbbell, Smile, ScanLine,
  Users, ShieldCheck, Check, Info, Clock, Smartphone, BookOpen, Mail, Phone, MapPin, Utensils, Hourglass, Droplets, Layers,
  LayoutGrid, Plus, Minus, ExternalLink, Package, Route, MessageCircle, Lock, House, Briefcase, Plane, Globe2, Target, Play,
  Zap, LineChart, Cpu, Eye, Video, ShoppingCart, ShoppingBag, Star, Trash2, Microscope, Bone, Baby, Waves, Wind, Gauge,
  Thermometer, Syringe, Bot, Radar, Award, TrendingUp, BarChart3, PieChart, Fingerprint, Atom, Orbit, Building2, Wifi,
  CircleDot, Sun, Apple, Scale, ScanFace, Flower2, PersonStanding, Salad, HeartHandshake, Footprints, Ruler, Calculator, Timer,
  BedDouble, Wheat, CigaretteOff, Wine, Flame, Sprout, Crown, Gem, ZoomIn, ZoomOut, RotateCcw, Move, Laptop, Siren, ClipboardList,
  ListChecks, Tablets, TestTube, TestTubes, Crosshair, AlarmClock, type LucideIcon,
} from "lucide-react";

/** Icon set — Lucide (consistent 24px stroke icons). Names kept stable across the codebase. */
const MAP: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight, "chevron-down": ChevronDown, "chevron-left": ChevronLeft, "chevron-right": ChevronRight,
  sparkle: Sparkles, search: Search, user: User, menu: Menu, x: X, "arrow-up": ArrowUp, heart: HeartPulse, activity: Activity, brain: Brain,
  stethoscope: Stethoscope, dna: Dna, flask: FlaskConical, pill: Pill, calendar: CalendarDays, file: FileText, leaf: Leaf, moon: Moon,
  dumbbell: Dumbbell, tooth: Smile, scan: ScanLine, users: Users, shield: ShieldCheck, check: Check, info: Info, clock: Clock, phone: Smartphone,
  book: BookOpen, mail: Mail, call: Phone, pin: MapPin, utensils: Utensils, hourglass: Hourglass, droplet: Droplets, layers: Layers, grid: LayoutGrid,
  plus: Plus, minus: Minus, external: ExternalLink, box: Package, route: Route, message: MessageCircle, lock: Lock, home: House, briefcase: Briefcase,
  plane: Plane, globe: Globe2, target: Target, play: Play, bolt: Zap, chart: LineChart, cpu: Cpu, eye: Eye, video: Video, cart: ShoppingCart,
  bag: ShoppingBag, star: Star, trash: Trash2, microscope: Microscope, bone: Bone, baby: Baby, gut: Waves, wind: Wind, gauge: Gauge,
  thermometer: Thermometer, syringe: Syringe, bot: Bot, radar: Radar, award: Award, trend: TrendingUp, bars: BarChart3, pie: PieChart,
  fingerprint: Fingerprint, atom: Atom, orbit: Orbit, building: Building2, wifi: Wifi, dot: CircleDot, sun: Sun, apple: Apple,
  venus: Flower2, mars: PersonStanding, scale: Scale, face: ScanFace, flower: Flower2, person: PersonStanding, salad: Salad,
  care: HeartHandshake, steps: Footprints, ruler: Ruler, calculator: Calculator, timer: Timer, bed: BedDouble, wheat: Wheat,
  "no-smoking": CigaretteOff, wine: Wine, flame: Flame, sprout: Sprout, crown: Crown, gem: Gem, "zoom-in": ZoomIn, "zoom-out": ZoomOut,
  reset: RotateCcw, move: Move, laptop: Laptop, siren: Siren, clipboard: ClipboardList, checklist: ListChecks, tablets: Tablets,
  "test-tube": TestTube, "test-tubes": TestTubes, crosshair: Crosshair, alarm: AlarmClock,
};

export type IconName = keyof typeof MAP | string;

export function Icon({ name, size = 18, strokeWidth = 1.75, className }: { name: IconName; size?: number; strokeWidth?: number; className?: string }) {
  const C = MAP[name] ?? Sparkles;
  return <C size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
