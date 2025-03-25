/// <reference types="vite/client" />

// Howler type declarations
declare module 'howler' {
  export class Howl {
    constructor(options: {
      src: string[];
      volume?: number;
      preload?: boolean;
      loop?: boolean;
    });
    play(): number;
    pause(): this;
    stop(): this;
    volume(vol?: number): number | this;
    rate(rate?: number): number | this;
  }
}
