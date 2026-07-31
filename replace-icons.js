const fs = require('fs');

const files = ['src/components/Services.tsx', 'src/components/ConstructionPartnersSection.tsx'];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // Replace lucide-react import
  code = code.replace(/import \{[^}]+\} from ["']lucide-react["'];/, 'import { MapPin, Building, Phone, X, Send, Loader2, Star, Briefcase, CheckCircle2, UserPlus, Search, Filter, HardHat, Paintbrush, MessageCircle, Home, Compass, Zap, Droplet, Grid, Waves, Building2, Layers, Bug, Leaf, Users, ChefHat, ArrowUpDown, Boxes, ClipboardCheck, Sun, Wind, Hammer, Wrench, Shield, Settings, Flame, PencilRuler, Sofa, LayoutGrid, PaintRoller, AppWindow, Factory, PackageOpen, Cuboid, Truck, Fan, Cpu, Umbrella, TreePine, Utensils } from "lucide-react";');

  const homeServices = `const HOME_SERVICES = [
  { id: 1, label: "Architects & engineers", link: "/home-designing-services?profession=Architect", icon: PencilRuler, color: "bg-blue-500/10 text-blue-600 hover:border-blue-500" },
  { id: 2, label: "Interior designer", link: "/home-designing-services?profession=Architect", icon: Sofa, color: "bg-indigo-500/10 text-indigo-600 hover:border-indigo-500" },
  { id: 3, label: "Contractors Buildind & Interior", link: "/home-designing-services?profession=Building", icon: HardHat, color: "bg-amber-500/10 text-amber-600 hover:border-amber-500" },
  { id: 4, label: "Electrical Contractor", link: "/home-designing-services?profession=Electrical", icon: Zap, color: "bg-yellow-500/10 text-yellow-600 hover:border-yellow-500" },
  { id: 5, label: "Plumbing Contractor", link: "/home-designing-services?profession=Plumbing", icon: Droplet, color: "bg-sky-500/10 text-sky-600 hover:border-sky-500" },
  { id: 6, label: "Tiles & Stone Contractor", link: "/home-designing-services?profession=Tile & granite", icon: LayoutGrid, color: "bg-teal-500/10 text-teal-600 hover:border-teal-500" },
  { id: 7, label: "Painting Contractor", link: "/home-designing-services?profession=Painting", icon: PaintRoller, color: "bg-rose-500/10 text-rose-600 hover:border-rose-500" },
  { id: 9, label: "Carpenter Services", link: "/home-designing-services?profession=Interior", icon: Hammer, color: "bg-orange-500/10 text-orange-600 hover:border-orange-500" },
  { id: 16, label: "False Ceiling Contractor", link: "/home-designing-services?profession=Interior", icon: AppWindow, color: "bg-fuchsia-500/10 text-fuchsia-600 hover:border-fuchsia-500" },
  { id: 21, label: "Building material", link: "/marketplace?category=Building Material", icon: Cuboid, color: "bg-emerald-500/10 text-emerald-600 hover:border-emerald-500" },
];`;

  const industrialServices = `const INDUSTRIAL_SERVICES = [
  { id: 1, label: "Pre Engineering Buildings", link: "/industrial-services?profession=Building", icon: Factory, color: "bg-emerald-500/10 text-emerald-600 hover:border-emerald-500" },
  { id: 2, label: "Pre Fabricated Buildings", link: "/industrial-services?profession=Building", icon: PackageOpen, color: "bg-violet-500/10 text-violet-600 hover:border-violet-500" },
  { id: 3, label: "Pre Cast Concrete Material", link: "/marketplace?category=Building Material", icon: Cuboid, color: "bg-stone-500/10 text-stone-600 hover:border-stone-500" },
  { id: 4, label: "Machinery Services", link: "/industrial-services?profession=Building", icon: Settings, color: "bg-gray-500/10 text-gray-600 hover:border-gray-500" },
  { id: 5, label: "Manpower Supply", link: "/industrial-services?profession=Building", icon: Users, color: "bg-fuchsia-500/10 text-fuchsia-600 hover:border-fuchsia-500" },
  { id: 6, label: "Building Inspection Services", link: "/industrial-services?profession=Building", icon: ClipboardCheck, color: "bg-slate-500/10 text-slate-600 hover:border-slate-500" },
  { id: 7, label: "Bulk Building Material Services", link: "/marketplace?category=Building Material", icon: Truck, color: "bg-orange-600/10 text-orange-700 hover:border-orange-600" },
];`;

  const otherServices = `const OTHER_SERVICES = [
  { id: 14, label: "Pest Control Service", link: "/other-services?profession=Building", icon: Bug, color: "bg-red-500/10 text-red-600 hover:border-red-500" },
  { id: 10, label: "HVAC System Installation", link: "/other-services?profession=Electrical", icon: Fan, color: "bg-blue-600/10 text-blue-700 hover:border-blue-600" },
  { id: 11, label: "Lift Installation Services", link: "/other-services?profession=Building", icon: ArrowUpDown, color: "bg-purple-500/10 text-purple-600 hover:border-purple-500" },
  { id: 13, label: "Solar Panel Installation", link: "/other-services?profession=Electrical", icon: Sun, color: "bg-amber-600/10 text-amber-700 hover:border-amber-600" },
  { id: 18, label: "Home Automation", link: "/other-services?profession=Electrical", icon: Cpu, color: "bg-yellow-600/10 text-yellow-700 hover:border-yellow-600" },
  { id: 15, label: "Water Proofing Installation", link: "/other-services?profession=Building", icon: Umbrella, color: "bg-sky-600/10 text-sky-700 hover:border-sky-600" },
  { id: 8, label: "Garden & Landscaping Contractor", link: "/other-services?profession=Interior", icon: TreePine, color: "bg-green-500/10 text-green-600 hover:border-green-500" },
  { id: 17, label: "Modular Kitchen Services", link: "/other-services?profession=Interior", icon: Utensils, color: "bg-orange-500/10 text-orange-600 hover:border-orange-500" },
  { id: 12, label: "Swimming Pool Contractor", link: "/other-services?profession=Building", icon: Waves, color: "bg-cyan-500/10 text-cyan-600 hover:border-cyan-500" },
  { id: 22, label: "Fire safety services", link: "/other-services?profession=Building", icon: Flame, color: "bg-red-500/10 text-red-600 hover:border-red-500" },
  { id: 23, label: "Fabricator", link: "/other-services?profession=Fabricator", icon: Wrench, color: "bg-gray-500/10 text-gray-600 hover:border-gray-500" },
];`;

  code = code.replace(/const HOME_SERVICES = \[[\s\S]*?\];/g, homeServices);
  code = code.replace(/const INDUSTRIAL_SERVICES = \[[\s\S]*?\];/g, industrialServices);
  code = code.replace(/const OTHER_SERVICES = \[[\s\S]*?\];/g, otherServices);

  fs.writeFileSync(file, code);
});

console.log('Icons updated successfully!');
