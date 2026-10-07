"use client";
import Image from "next/image";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Vaibhav Maheshwari",
      role: "Homeowner",
      image:
        "https://img.freepik.com/free-photo/fun-3d-cartoon-illustration-indian-businessman_183364-114500.jpg",
      rating: 5,
      comment:
        "Houseplanfiles helped us design our dream house perfectly. The team was professional and the process was seamless. Highly recommended!",
    },
    {
      id: 2,
      name: "Kamesh",
      role: "Real Estate Developer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj3uMCPn30XWtrLYElm5i0Btin70LWn4YfNA&s",
      rating: 5,
      comment:
        "Outstanding architectural designs and excellent customer service. We have used their services for multiple projects and are always satisfied.",
    },
    {
      id: 3,
      name: "Shubham Sharma",
      role: "Interior Designer",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtSHGuklgrqMI7ggWLm-621h29bXUGy4qMHA&s",
      rating: 5,
      comment:
        "The 3D visualizations are incredible! It really helped my clients understand the final outcome. Great attention to detail.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const activeTestimonial = testimonials[currentTestimonial];

  return (
    <section className="py-12 md:py-16 bg-[#FAF9F6]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="mt-3 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Trusted by thousands of satisfied customers worldwide who brought
            their dream homes to life with us.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto pt-10">
          <Card className="rounded-3xl shadow-lg hover:shadow-xl overflow-visible border border-slate-100 transition-all relative bg-white mx-4 sm:mx-12 md:mx-0">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-sm bg-white">
              <Image
                src={activeTestimonial.image}
                alt={activeTestimonial.name}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            </div>

            <div className="px-6 pb-8 md:px-10 md:pb-10 relative text-center">
              <div className="pt-12 md:pt-14">
                <Quote className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-10 md:h-10 text-orange-100/80" />

                <div className="flex items-center justify-center mb-4">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <blockquote className="text-base md:text-lg text-slate-700 mb-6 font-medium leading-relaxed italic">
                  "{activeTestimonial.comment}"
                </blockquote>

                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {activeTestimonial.name}
                  </h4>
                  <p className="text-sm text-slate-500 mt-0.5 font-medium">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md border-slate-100 hover:bg-slate-50 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md border-slate-100 hover:bg-slate-50 hover:text-orange-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation & Dots */}
        <div className="flex items-center justify-center mt-8 gap-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="md:hidden w-10 h-10 rounded-full bg-white shadow-sm border-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentTestimonial === index
                    ? "w-6 bg-orange-500"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="md:hidden w-10 h-10 rounded-full bg-white shadow-sm border-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
