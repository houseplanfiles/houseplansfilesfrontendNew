import dynamic from "next/dynamic";

const ThreeDPlansPageClient = dynamic(
  () => import("@/components/ThreeDPlansPageClient"),
  { ssr: false }
);

export default function ThreeDPlansPage() {
  return <ThreeDPlansPageClient />;
}