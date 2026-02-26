// src/types/travel.ts

export type TravelTag =
  | "cold"
  | "nature"
  | "hiking"
  | "history"
  | "culture"
  | "walking"
  | "animals"
  | "adventure"
  | "photography"
  | "beach"
  | "surfing"
  | "young-vibe"
  | "climbing"
  | "view";

export interface TravelPackage {
  id: number;
  title: string;
  location: string;
  price: number; 
  tags: TravelTag[];
}