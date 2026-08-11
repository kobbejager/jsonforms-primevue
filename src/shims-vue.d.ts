declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
    export const entry: any;
}

declare module '*.md?raw' {
    const content: string;
    export default content;
}

declare module '*?raw' {
    const content: string;
    export default content;
}

declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;


