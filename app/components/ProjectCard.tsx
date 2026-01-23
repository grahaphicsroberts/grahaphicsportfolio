"use client";

import React from "react";

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  image: string;
}

export default function ProjectCard({
  title,
  category,
  year,
  image,
}: ProjectCardProps) {
  return (
    <div className="aspect-[4/3] bg-neutral-800 relative group overflow-hidden cursor-pointer">
      <div className="absolute inset-0">
        {/* Switched back to standard <img> to avoid domain config errors */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 w-full z-10">
        <div className="flex justify-between items-end">
          <div>
            <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-1">
              {category}
            </span>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
          <span className="font-mono text-sm text-neutral-400">{year}</span>
        </div>
      </div>
    </div>
  );
}
