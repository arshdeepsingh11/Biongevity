"use client";
import {
  ArrowRight, ArrowUpRight, CaretDown, CaretLeft, CaretRight, Sparkle, MagnifyingGlass, User, List, X, ArrowUp, Heartbeat, Pulse,
  Brain, Stethoscope, Dna, Flask, Pill, CalendarBlank, FileText, Leaf, Moon, Barbell, Tooth, Scan, UsersThree, ShieldCheck, Check,
  Info, Clock, DeviceMobile, BookOpen, EnvelopeSimple, Phone, MapPin, ForkKnife, Hourglass, Drop, Stack, SquaresFour, Plus, Minus,
  ArrowSquareOut, Package, Path, ChatCircle, Lock, House, Briefcase, Airplane, GlobeHemisphereWest, Target, Play, Lightning,
  ChartLine, Cpu, Eye, VideoCamera, ShoppingCart, ShoppingBag, Star, Trash, Microscope, Bone, Baby, Waves, Wind, Gauge, Thermometer,
  Syringe, Robot, Medal, TrendUp, ChartBar, ChartPie, Fingerprint, Atom, Planet, Buildings, WifiHigh, CircleDashed, Sun, AppleLogo,
  Scales, Smiley, FlowerLotus, PersonSimple, BowlFood, HandHeart, Footprints, Ruler, Calculator, Timer, Bed, Grains, CigaretteSlash,
  Wine, Flame, Plant, Crown, Diamond, MagnifyingGlassPlus, MagnifyingGlassMinus, ArrowCounterClockwise, ArrowsOutCardinal, Laptop,
  Siren, ClipboardText, ListChecks, TestTube, Crosshair, Alarm, Heart, PersonSimpleWalk, FaceMask, Waveform, HeartHalf, Graph,
  Hospital, Wheelchair, Virus, FirstAidKit, Ear, CirclesThreePlus, Microphone, StopCircle, Command, CursorText, type Icon as PhosphorIcon, type IconWeight,
} from "@phosphor-icons/react";

/** Icon set — Phosphor (clean, consistent 1.5px strokes). Names are stable across the codebase. */
const MAP: Record<string, PhosphorIcon> = {
  "arrow-right": ArrowRight, "arrow-up-right": ArrowUpRight, "chevron-down": CaretDown, "chevron-left": CaretLeft, "chevron-right": CaretRight,
  sparkle: Sparkle, search: MagnifyingGlass, user: User, menu: List, x: X, "arrow-up": ArrowUp, heart: Heartbeat, activity: Pulse, brain: Brain,
  stethoscope: Stethoscope, dna: Dna, flask: Flask, pill: Pill, calendar: CalendarBlank, file: FileText, leaf: Leaf, moon: Moon,
  dumbbell: Barbell, tooth: Tooth, scan: Scan, users: UsersThree, shield: ShieldCheck, check: Check, info: Info, clock: Clock, phone: DeviceMobile,
  book: BookOpen, mail: EnvelopeSimple, call: Phone, pin: MapPin, utensils: ForkKnife, hourglass: Hourglass, droplet: Drop, layers: Stack, grid: SquaresFour,
  plus: Plus, minus: Minus, external: ArrowSquareOut, box: Package, route: Path, message: ChatCircle, lock: Lock, home: House, briefcase: Briefcase,
  plane: Airplane, globe: GlobeHemisphereWest, target: Target, play: Play, bolt: Lightning, chart: ChartLine, cpu: Cpu, eye: Eye, video: VideoCamera, cart: ShoppingCart,
  bag: ShoppingBag, star: Star, trash: Trash, microscope: Microscope, bone: Bone, baby: Baby, gut: Waves, wind: Wind, gauge: Gauge,
  thermometer: Thermometer, syringe: Syringe, bot: Robot, radar: Crosshair, award: Medal, trend: TrendUp, bars: ChartBar, pie: ChartPie,
  fingerprint: Fingerprint, atom: Atom, orbit: Planet, building: Buildings, wifi: WifiHigh, dot: CircleDashed, sun: Sun, apple: AppleLogo,
  venus: FlowerLotus, mars: PersonSimple, scale: Scales, face: Smiley, flower: FlowerLotus, person: PersonSimple, salad: BowlFood,
  care: HandHeart, steps: Footprints, ruler: Ruler, calculator: Calculator, timer: Timer, bed: Bed, wheat: Grains,
  "no-smoking": CigaretteSlash, wine: Wine, flame: Flame, sprout: Plant, crown: Crown, gem: Diamond, "zoom-in": MagnifyingGlassPlus, "zoom-out": MagnifyingGlassMinus,
  reset: ArrowCounterClockwise, move: ArrowsOutCardinal, laptop: Laptop, siren: Siren, clipboard: ClipboardText, checklist: ListChecks, tablets: Pill,
  "test-tube": TestTube, "test-tubes": Flask, crosshair: Crosshair, alarm: Alarm, "heart-plain": Heart, walk: PersonSimpleWalk, lungs: Wind,
  mask: FaceMask, wave: Waveform, "heart-half": HeartHalf, graph: Graph, hospital: Hospital, wheelchair: Wheelchair, virus: Virus,
  firstaid: FirstAidKit, ear: Ear, network: CirclesThreePlus,
  mic: Microphone, stop: StopCircle, command: Command, "text-select": CursorText,
};

export type IconName = keyof typeof MAP | string;

/** `weight`: "light" for UI, "duotone" for feature tiles. Size in px. */
export function Icon({ name, size = 18, className, weight = "regular", strokeWidth }: { name: IconName; size?: number; className?: string; weight?: IconWeight; strokeWidth?: number }) {
  const C = MAP[name] ?? Sparkle;
  void strokeWidth;
  return <C size={size} weight={weight} className={className} aria-hidden="true" />;
}
