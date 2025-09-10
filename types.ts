import React from 'react';

// FIX: Add type definitions for the File System Access API to fix TS errors.
// These are not exhaustive but cover the usage in this application.
declare global {
  interface FileSystemWritableFileStream {
    write(data: string): Promise<void>;
    close(): Promise<void>;
  }

  interface FileSystemFileHandle {
    // FIX: Add readonly modifier to 'kind' to match built-in TS types.
    readonly kind: 'file';
    name: string;
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
  }

  interface FileSystemDirectoryHandle {
    // FIX: Add readonly modifier to 'kind' to match built-in TS types.
    readonly kind: 'directory';
    name: string;
    values(): AsyncIterableIterator<FileSystemFileHandle | FileSystemDirectoryHandle>;
  }

  interface Window {
    showOpenFilePicker(options?: any): Promise<FileSystemFileHandle[]>;
    showSaveFilePicker(options?: any): Promise<FileSystemFileHandle>;
    showDirectoryPicker(options?: any): Promise<FileSystemDirectoryHandle>;
  }
}

export type AppID = 'pages' | 'terminal' | 'weather' | 'my-docs' | 'calculator' | 'ozark' | 'about' | 'stocks' | 'houston' | 'settings' | 'imaginarium' | 'calendar' | 'music' | 'photo-booth' | 'launchpad' | 'arsis-id' | 'defense-ios' | 'network-info';

export interface DesktopItem {
  id: AppID;
  position: { x: number; y: number };
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component?: React.ComponentType<any>;
  width?: number;
  height?: number;
  showInDock?: boolean;
  onDesktop?: boolean;
  initialProps?: any;
}

export interface WindowState {
  id: AppID;
  title:string;
  Component: React.ComponentType<any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  previousPosition?: { x: number; y: number };
  previousSize?: { width: number; height: number };
  initialProps?: any;
}

export interface Notification {
  id: number;
  appId: AppID;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
}

export interface MusicTrack {
  title: string;
  artist: string;
  duration: number;
  src: string;
}

export interface MusicContextType {
  isPlaying: boolean;
  progress: number;
  currentTrack: MusicTrack;
  currentTime: number;
  togglePlayPause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  seek: (value: number) => void;
}

export interface ProxyConfig {
  name: string;
  url: string;
}

// Data persistence types
export interface ArsisIdCredentials {
    username: string;
    hash: string; // A simple salted hash or similar
}

export interface Page {
    id: number;
    title: string;
    content: string;
}

export interface CalendarEvent {
    id: number;
    text: string;
}

export interface HoustonMessage {
    sender: 'user' | 'houston';
    text: string;
}

export interface UserProfileData {
    desktopItems: DesktopItem[];
    pages: Page[];
    calendarEvents: Record<string, CalendarEvent[]>;
    photos: string[]; // array of data URLs
    houstonHistory: HoustonMessage[];
    ozarkUrl: string;
    settings: {
        wallpaper: string;
        theme: 'light' | 'dark';
    }
}

export interface UserProfile {
    credentials: ArsisIdCredentials;
    data: UserProfileData;
}