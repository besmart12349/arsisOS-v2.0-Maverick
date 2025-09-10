
import React from 'react';
import type { AppConfig } from './types';
import Pages from './apps/Notes';
import Terminal from './apps/Terminal';
import Weather from './apps/Weather';
import MyDocs from './apps/MyDocs';
import Calculator from './apps/Calculator';
import Ozark from './apps/Chromium';
import About from './apps/About';
import Stocks from './apps/Stocks';
import Houston from './apps/Houston';
import Settings from './apps/Settings';
import Imaginarium from './apps/Imaginarium';
import Calendar from './apps/Calendar';
import Music from './apps/Music';
import PhotoBooth from './apps/PhotoBooth';
import ArsisId from './apps/ArsisId';
import DefenseIOS from './apps/DefenseIOS';
import NetworkInfo from './apps/NetworkInfo';
import SiteCreator from './apps/Contacts';

import { 
    PagesIcon, 
    TerminalIcon, 
    WeatherIcon, 
    MyDocsIcon, 
    CalculatorIcon, 
    CompassIcon,
    AboutIcon,
    StocksIcon,
    HoustonIcon,
    SettingsIcon,
    ImaginariumIcon,
    CalendarIcon,
    MusicIcon,
    PhotoBoothIcon,
    LaunchpadIcon,
    ArsisIdIcon,
    DefenseIOSIcon,
    NetworkInfoIcon,
    SiteCreatorIcon,
} from './components/Icons';

export const APPS: AppConfig[] = [
  // User-specified order
  { id: 'my-docs', title: 'MyDocs', icon: MyDocsIcon, component: MyDocs, width: 700, height: 500, onDesktop: true },
  { id: 'site-creator', title: 'Site Creator', icon: SiteCreatorIcon, component: SiteCreator, width: 900, height: 650, onDesktop: true },
  { id: 'ozark', title: 'OZARK', icon: CompassIcon, component: Ozark, width: 1024, height: 768 },
  { id: 'houston', title: 'Houston', icon: HoustonIcon, component: Houston, width: 500, height: 700, onDesktop: true },
  { id: 'terminal', title: 'Terminal', icon: TerminalIcon, component: Terminal, width: 680, height: 420 },
  { id: 'calendar', title: 'Calendar', icon: CalendarIcon, component: Calendar, width: 700, height: 550 },
  { id: 'imaginarium', title: 'Imaginarium', icon: ImaginariumIcon, component: Imaginarium, width: 800, height: 600 },
  { id: 'weather', title: 'Weather', icon: WeatherIcon, component: Weather, width: 350, height: 500 },
  { id: 'calculator', title: 'Calculator', icon: CalculatorIcon, component: Calculator, width: 360, height: 580 },
  { id: 'stocks', title: 'Stocks', icon: StocksIcon, component: Stocks, width: 400, height: 600 },
  { id: 'pages', title: 'Pages', icon: PagesIcon, component: Pages, width: 700, height: 500 },
  { id: 'music', title: 'Music', icon: MusicIcon, component: Music, width: 600, height: 400 },
  { id: 'photo-booth', title: 'Photo Booth', icon: PhotoBoothIcon, component: PhotoBooth, width: 720, height: 600 },
  { id: 'defense-ios', title: 'DefenseIOS', icon: DefenseIOSIcon, component: DefenseIOS, width: 500, height: 750 },
  { id: 'arsis-id', title: 'Arsis ID', icon: ArsisIdIcon, component: ArsisId, width: 400, height: 500 },
  
  // Other apps in dock
  { id: 'settings', title: 'Settings', icon: SettingsIcon, component: Settings, width: 500, height: 400 },
  { id: 'network-info', title: 'Network Info', icon: NetworkInfoIcon, component: NetworkInfo, width: 400, height: 350, onDesktop: true },

  // Launchpad is last in dock
  { id: 'launchpad', title: 'Launchpad', icon: LaunchpadIcon },

  // App not in dock
  { id: 'about', title: 'About ArsisOS', icon: AboutIcon, component: About, width: 400, height: 250, showInDock: false },
];


export const API_CALL_LIMIT = 1000;