import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAspectRatio(width: number, height: number) {
  let timesBigger = width > height ? width / height : height / width;
  if (width > height && timesBigger >= 1.33) {
    return { w: 2, h: 1 };
  } else if (width < height && timesBigger >= 1.33) {
    return { w: 1, h: 2 };
  } else if (width < 1000 && timesBigger < 1.33) {
    return { w: 1, h: 1 };
  } else {
    return { w: 2, h: 2 };
  }
}
