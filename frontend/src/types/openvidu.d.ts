declare module 'openvidu-browser' {
  export class OpenVidu {
    constructor();
    initSession(): Session;
    initPublisherAsync(targetElement?: string | HTMLElement, properties?: any): Promise<Publisher>;
  }

  export class Session {
    connect(token: string, metadata?: any): Promise<void>;
    disconnect(): void;
    publish(publisher: Publisher): Promise<void>;
    subscribe(stream: any, targetElement?: string | HTMLElement): Subscriber;
    signal(data: any): void;
    on(event: string, callback: (event: any) => void): void;
    off(event: string): void;
  }

  export class Publisher {
    publishAudio(enable: boolean): void;
    publishVideo(enable: boolean): void;
    addVideoElement(element: HTMLElement): void;
    getMediaStream(): MediaStream;
    on(event: string, callback: (event: any) => void): void;
    off(event: string): void;
  }

  export class Subscriber {
    subscribeToAudio(enable: boolean): void;
    subscribeToVideo(enable: boolean): void;
    addVideoElement(element: HTMLElement): void;
    stream: {
      streamId: string;
    };
    getMediaStream(): MediaStream;
    on(event: string, callback: (event: any) => void): void;
    off(event: string): void;
  }

  export interface StreamEvent {
    stream: {
      streamId: string;
      connection: {
        connectionId: string;
      };
    };
  }

  export interface PublisherEvent {
    publisher: Publisher;
  }

  export interface SubscriberEvent {
    subscriber: Subscriber;
  }
} 