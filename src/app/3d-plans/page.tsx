import dynamic from "next/dynamic";

const ThreeDPlansPageClient = dynamic(
  () => import("@/components/ThreeDPlansPageClient")
);

export default function ThreeDPlansPage() {
  return <ThreeDPlansPageClient />;
}