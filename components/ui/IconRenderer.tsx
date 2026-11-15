import React from "react";
import {
  Compass,
  Home,
  Building2,
  Landmark,
  Sparkles,
  UtensilsCrossed,
  BedDouble,
  Sofa,
  Briefcase,
  Lightbulb,
  KeyRound,
  Trees,
  FileCheck2,
  ShieldCheck,
  HardHat,
  Scale,
  Clock,
  CheckCircle2,
  Award,
  Layers,
  Ruler,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass,
  Home,
  Building2,
  Landmark,
  Sparkles,
  UtensilsCrossed,
  BedDouble,
  Sofa,
  Briefcase,
  Lightbulb,
  KeyRound,
  Trees,
  FileCheck2,
  ShieldCheck,
  HardHat,
  Scale,
  Clock,
  CheckCircle2,
  Award,
  Layers,
  Ruler,
};

export function IconRenderer({
  name,
  className = "w-6 h-6",
}: {
  name?: string;
  className?: string;
}) {
  const IconComp = (name && ICON_MAP[name]) || Compass;
  return <IconComp className={className} />;
}
