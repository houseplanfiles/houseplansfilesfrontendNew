import Link from "next/link";
import { motion } from "@/components/MotionWrapper";

import { Star, Heart, Share2 } from "lucide-react";
import DisplayPrice from "./DisplayPrice";

interface PlanCardProps {
  plan: {
    image: string;
    title: string;
    rating: number | string;
    specs: string;
    price: number;
    reviews: number | string;
    id?: string;
  };
}

const PlanCard = ({ plan }: PlanCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={plan.image}
          alt={plan.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-red-100">
            <Heart size={18} className="text-red-500" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-100">
            <Share2 size={18} className="text-blue-500" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span>{plan.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-dark mb-1">{plan.title}</h3>
        <p className="text-sm text-dark-light mb-4">{plan.specs}</p>
        <div className="flex justify-between items-center mb-4">
          <p className="text-2xl font-bold text-primary">
            <DisplayPrice inrPrice={plan.price} />
          </p>
          <p className="text-xs text-gray-500">{plan.reviews} reviews</p>
        </div>
        <Link
          href={`/plan/${plan.id || "/house-plans"}`}
          className="block w-full text-center bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default PlanCard;