/// <reference types="vite/client" />

// Image imports
declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// Module declarations for aliased paths
declare module '@/components/ui/*' {
  const component: any;
  export default component;
}

declare module '@/hooks/*' {
  const hook: any;
  export default hook;
}

declare module '@/lib/*' {
  const lib: any;
  export default lib;
}

declare module '@/components/*' {
  const component: any;
  export default component;
}

declare module '@/pages/*' {
  const page: any;
  export default page;
}

declare module '@shared/*' {
  const shared: any;
  export default shared;
} 