export {};

declare global {
  interface Window {
    fcWidgetMessengerConfig?: any;
    fcSettings?: any;
    fcWidget?: {
      hide: () => void;
      destroy: () => void;
      [key: string]: any;
    };
  }
}
