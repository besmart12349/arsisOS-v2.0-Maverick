
import React, { useState, useCallback, useEffect } from 'react';
import TopBar from './components/TopBar';
import Dock from './components/Dock';
import Window from './components/Window';
import DesktopIcon from './components/DesktopIcon';
import SystemOverlay from './components/SystemOverlay';
import ContextMenu from './components/ContextMenu';
import MissionControl from './components/MissionControl';
import Spotlight from './components/Spotlight';
import Launchpad from './components/Launchpad';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import ControlCenter from './components/ControlCenter';
import NotificationCenter from './components/NotificationCenter';
import NotificationToast from './components/NotificationToast';
import { MusicProvider } from './contexts/MusicContext';
import { SecurityProvider } from './contexts/SecurityContext';
import { APPS, API_CALL_LIMIT } from './constants';
import type { AppID, WindowState, AppConfig, Notification, UserProfile, UserProfileData, ArsisIdCredentials, DesktopItem } from './types';
import ApiMonitorWidget from './components/ApiMonitorWidget';

interface ContextMenuState {
  x: number;
  y: number;
  visible: boolean;
}

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1483728642387-6c351b40b7de?auto=format&fit=crop&w=1920&q=80',
];

const GUEST_PROFILE_DATA: UserProfileData = {
    desktopItems: APPS.filter(app => app.onDesktop).map((app, index) => ({
      id: app.id,
      position: { x: window.innerWidth - 120, y: 40 + index * 110 }
    })),
    pages: [{ id: 1, title: 'Welcome Page', content: '<h1>Welcome to ArsisOS!</h1><p>This is a temporary page for your guest session. Create an <b>Arsis ID</b> to save your work!</p><p>Try the new Houston AI assistant integrated into Pages to help you write.</p>' }],
    calendarEvents: {},
    photos: [],
    houstonHistory: [{ sender: 'houston', text: "Hello! I'm Houston, your AI assistant. How can I help you today?" }],
    ozarkUrl: 'https://www.wikipedia.org/',
    settings: { wallpaper: WALLPAPERS[3], theme: 'light' },
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<AppID | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [systemAction, setSystemAction] = useState<'restart' | 'shutdown' | 'sleep' | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ x: 0, y: 0, visible: false });
  const [isMissionControlActive, setMissionControlActive] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const [isSpotlightVisible, setSpotlightVisible] = useState(false);
  const [isLaunchpadVisible, setLaunchpadVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isControlCenterVisible, setControlCenterVisible] = useState(false);
  const [isNotificationCenterVisible, setNotificationCenterVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);
  const [brightness, setBrightness] = useState(100);
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const [dockApps, setDockApps] = useState<AppConfig[]>(() => APPS.filter(app => app.showInDock !== false));
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);

  // User State
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserProfileData>(GUEST_PROFILE_DATA);

  // --- API / Persistence Logic ---
  const updateUserProfile = useCallback(async (updates: Partial<UserProfileData>) => {
      const newData = { ...userData, ...updates };
      setUserData(newData);
      
      if (authToken) {
          try {
              // In a real app, you'd send this to your server
              // const response = await fetch('/api/profile', {
              //     method: 'POST',
              //     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
              //     body: JSON.stringify(newData),
              // });
              // if (!response.ok) throw new Error('Failed to save profile');
              console.log('User profile updated on server (mock).', newData);
          } catch (error) {
              console.error("Failed to update user profile on server:", error);
              // Handle error, maybe show a notification
          }
      }
  }, [userData, authToken]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id'>) => {
    const newId = Date.now();
    const appConfig = APPS.find(app => app.id === notificationData.appId);
    if (!appConfig) return;

    const newNotification: Notification = { ...notificationData, id: newId, icon: appConfig.icon };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    setToasts(prev => [...prev, newNotification]);
    setTimeout(() => {
        setToasts(currentToasts => currentToasts.filter(t => t.id !== newId));
    }, 5000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30); 
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (userData.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userData.settings.theme]);
  
  useEffect(() => {
    if (isLoggedIn) {
        setDesktopItems(userData.desktopItems || []);
    }
  }, [isLoggedIn, userData.desktopItems]);

  // FIX: Moved handleCreateUser and related auth functions before they are used in `openApp` to fix a block-scoped variable usage error.
  // --- Auth Logic ---
  const handleLogin = useCallback(async (credentials?: { username: string, password?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!credentials) { // Guest login
        setUserData(GUEST_PROFILE_DATA);
        setIsLoggedIn(true);
        setAuthToken(null);
        return { success: true };
    }
    // In a real app, this would be a fetch call
    // const response = await fetch('/api/login', { ... });
    // const data = await response.json();
    await new Promise(res => setTimeout(res, 500)); // Simulate network latency
    
    // MOCK API LOGIC
    const storedProfileStr = localStorage.getItem(`arsis-user-${credentials.username}`);
    if (storedProfileStr) {
        const userProfile: UserProfile = JSON.parse(storedProfileStr);
        const passwordMatches = atob(userProfile.credentials.hash).split('').reverse().join('') === credentials.password;
        if(passwordMatches) {
            setAuthToken(`mock-jwt-for-${userProfile.credentials.username}`);
            setUserData(userProfile.data);
            setIsLoggedIn(true);
            return { success: true };
        }
    }

    return { success: false, error: 'Invalid username or password.' };
  }, []);

  const handleCreateUser = useCallback(async (credentials: ArsisIdCredentials): Promise<{ success: boolean; error?: string }> => {
    // In a real app, this would be a fetch call
    // const response = await fetch('/api/register', { ... });
    // const data = await response.json();
    await new Promise(res => setTimeout(res, 500)); // Simulate network latency

    // MOCK API LOGIC
    if (localStorage.getItem(`arsis-user-${credentials.username}`)) {
      return { success: false, error: 'Username already exists.' };
    }
    const newUserProfile: UserProfile = { credentials, data: GUEST_PROFILE_DATA };
    localStorage.setItem(`arsis-user-${credentials.username}`, JSON.stringify(newUserProfile));
    
    return { success: true };
  }, []);

  const toggleTheme = () => {
    updateUserProfile({ settings: { ...userData.settings, theme: userData.settings.theme === 'light' ? 'dark' : 'light' } });
  };
  
  const setWallpaper = (url: string) => {
    updateUserProfile({ settings: { ...userData.settings, wallpaper: url } });
  }

  const incrementApiCallCount = useCallback(() => {
    setApiCallCount(prev => prev + 1);
  }, []);

  const handleIconPositionChange = (id: AppID, newPosition: { x: number; y: number }) => {
    const newDesktopItems = desktopItems.map(item => item.id === id ? { ...item, position: newPosition } : item);
    setDesktopItems(newDesktopItems);
    updateUserProfile({ desktopItems: newDesktopItems });
  };

  const openApp = useCallback((id: AppID, initialProps: any = {}) => {
    setLaunchpadVisible(false);
    setSpotlightVisible(false);

    setWindows(currentWindows => {
      const existingWindow = currentWindows.find(win => win.id === id);
      const appConfig = APPS.find(app => app.id === id);

      if (!appConfig || !appConfig.component) return currentWindows;

      if (existingWindow) {
        setActiveWindow(id);
        return currentWindows.map(win => 
          win.id === id ? { ...win, zIndex: nextZIndex, isMinimized: false } : win
        );
      } else {
        const AppComponent = appConfig.component;
        const appSpecificProps: any = {};
        
        if (appConfig.id === 'settings') {
          appSpecificProps.onWallpaperSelect = setWallpaper;
          appSpecificProps.wallpapers = WALLPAPERS;
          appSpecificProps.theme = userData.settings.theme;
          appSpecificProps.onThemeToggle = toggleTheme;
        } else if (['houston', 'imaginarium', 'weather', 'pages', 'defense-ios', 'ozark'].includes(appConfig.id)) {
          appSpecificProps.onApiCall = incrementApiCallCount;
          if (appConfig.id !== 'ozark') appSpecificProps.addNotification = addNotification;
        } else if (appConfig.id === 'my-docs') {
          appSpecificProps.onOpenFile = (fileHandle: FileSystemFileHandle) => openApp('pages', { initialFileHandle: fileHandle });
        } else if (appConfig.id === 'pages') {
            appSpecificProps.savedPages = userData.pages;
            appSpecificProps.onSavePages = (pages: any) => updateUserProfile({ pages });
        } else if (appConfig.id === 'houston') {
            appSpecificProps.history = userData.houstonHistory;
            appSpecificProps.onHistoryChange = (houstonHistory: any) => updateUserProfile({ houstonHistory });
        } else if (appConfig.id === 'calendar') {
            appSpecificProps.savedEvents = userData.calendarEvents;
            appSpecificProps.onSaveEvents = (calendarEvents: any) => updateUserProfile({ calendarEvents });
        } else if (appConfig.id === 'photo-booth') {
            appSpecificProps.savedPhotos = userData.photos;
            appSpecificProps.onSavePhoto = (photo: string) => updateUserProfile({ photos: [...userData.photos, photo] });
        } else if (appConfig.id === 'ozark') {
            appSpecificProps.initialUrl = userData.ozarkUrl;
            appSpecificProps.onUrlChange = (ozarkUrl: string) => updateUserProfile({ ozarkUrl });
        } else if (appConfig.id === 'arsis-id') {
            appSpecificProps.onCreateUser = handleCreateUser;
            appSpecificProps.currentUser = authToken ? 'user' : null; // simplified for now
        }
          
        const newWindow: WindowState = {
          id: appConfig.id,
          title: appConfig.title,
          Component: (props) => <AppComponent {...props} {...appSpecificProps} />,
          position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
          size: { width: appConfig.width || 640, height: appConfig.height || 480 },
          zIndex: nextZIndex,
          isMinimized: false, isMaximized: false, initialProps,
        };
        setActiveWindow(id);
        return [...currentWindows, newWindow];
      }
    });
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, incrementApiCallCount, userData, addNotification, updateUserProfile, authToken, handleCreateUser]);

  const closeApp = useCallback((id: AppID) => {
    setWindows(currentWindows => currentWindows.filter(win => win.id !== id));
    if (activeWindow === id) {
        const remainingWindows = windows.filter(win => win.id !== id);
        if (remainingWindows.length > 0) {
          const nextActive = remainingWindows.reduce((prev, curr) => curr.zIndex > prev.zIndex ? curr : prev);
          setActiveWindow(nextActive.id);
        } else {
          setActiveWindow(null);
        }
    }
  }, [activeWindow, windows]);

  const focusApp = useCallback((id: AppID) => {
    if (activeWindow === id) return;
    setActiveWindow(id);
    setWindows(currentWindows => currentWindows.map(win => win.id === id ? { ...win, zIndex: nextZIndex } : win));
    setNextZIndex(prev => prev + 1);
  }, [activeWindow, nextZIndex]);

  const minimizeApp = useCallback((id: AppID) => {
    setWindows(currentWindows => currentWindows.map(win => (win.id === id ? { ...win, isMinimized: true } : win)));
    if (activeWindow === id) setActiveWindow(null);
  }, [activeWindow]);

  const toggleMaximizeApp = useCallback((id: AppID) => {
    setWindows(currentWindows =>
      currentWindows.map(win => {
        if (win.id === id) {
          if (win.isMaximized) return { ...win, isMaximized: false, position: win.previousPosition || win.position, size: win.previousSize || win.size };
          else return { ...win, isMaximized: true, previousPosition: win.position, previousSize: win.size, position: { x: 0, y: 28 }, size: { width: window.innerWidth, height: window.innerHeight - 28 } };
        }
        return win;
      })
    );
    focusApp(id);
  }, [focusApp]);

  const getActiveAppName = () => activeWindow ? (APPS.find(app => app.id === activeWindow)?.title || "Finder") : "Finder";
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
  };
  const closeContextMenu = () => setContextMenu(prev => ({ ...prev, visible: false }));
  const handleMissionControlSelect = (id: AppID) => {
    focusApp(id);
    setMissionControlActive(false);
  };
  const closeOverlays = () => {
    setControlCenterVisible(false);
    setNotificationCenterVisible(false);
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleSleep = () => {
    setSystemAction('sleep');
    setIsLoggedIn(false);
    setAuthToken(null);
    setWindows([]);
  };
  
  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <MusicProvider>
      <SecurityProvider>
        <div 
          className="h-screen w-screen overflow-hidden bg-cover bg-center bg-no-repeat font-sans"
          style={{ backgroundImage: `url(${userData.settings.wallpaper})` }}
          onContextMenu={isLoggedIn ? handleContextMenu : (e) => e.preventDefault()}
          onClick={isLoggedIn ? closeOverlays : undefined}
        >
          {isLoggedIn ? (
            <>
              <TopBar 
                activeAppName={getActiveAppName()} 
                onAboutClick={() => openApp('about')}
                onRestart={() => setSystemAction('restart')}
                onShutdown={() => setSystemAction('shutdown')}
                onSleep={handleSleep}
                onHoustonClick={() => openApp('houston')}
                onMissionControlToggle={() => setMissionControlActive(prev => !prev)}
                onSpotlightToggle={() => setSpotlightVisible(prev => !prev)}
                onControlCenterToggle={() => setControlCenterVisible(prev => !prev)}
                onNotificationCenterToggle={() => setNotificationCenterVisible(prev => !prev)}
              />
              <main className="relative w-full h-full pt-7">
                <div className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300" style={{ opacity: (100 - brightness) / 150 }} />
                <ApiMonitorWidget apiCallCount={apiCallCount} limit={API_CALL_LIMIT} initialPosition={{ x: 20, y: 40 }} />
                {desktopItems.map(item => {
                  const appConfig = APPS.find(app => app.id === item.id);
                  if (!appConfig) return null;
                  return (
                    <DesktopIcon key={item.id} id={item.id} title={appConfig.title} IconComponent={appConfig.icon} onOpen={() => openApp(item.id)} initialPosition={item.position} onPositionChange={(newPos) => handleIconPositionChange(item.id, newPos)} />
                  );
                })}
                
                {windows.map((win) => (
                  <Window key={win.id} id={win.id} title={win.title} position={win.position} size={win.size} zIndex={win.zIndex} isActive={activeWindow === win.id} isMinimized={win.isMinimized} isMaximized={win.isMaximized} onClose={() => closeApp(win.id)} onFocus={() => focusApp(win.id)} onMinimize={() => minimizeApp(win.id)} onMaximize={() => toggleMaximizeApp(win.id)}>
                    <win.Component {...win.initialProps} />
                  </Window>
                ))}
              </main>
              <Dock apps={dockApps} setApps={setDockApps} onAppClick={openApp} onLaunchpadClick={() => setLaunchpadVisible(true)} windows={windows} />
              {systemAction && <SystemOverlay action={systemAction} onWakeUp={() => setSystemAction(null)} />}
              <ContextMenu x={contextMenu.x} y={contextMenu.y} visible={contextMenu.visible} onClose={closeContextMenu} onItemClick={() => openApp('settings')} />
              {isMissionControlActive && <MissionControl windows={windows.filter(w => !w.isMinimized)} onSelectWindow={handleMissionControlSelect} onClose={() => setMissionControlActive(false)} />}
              {isSpotlightVisible && <Spotlight onClose={() => setSpotlightVisible(false)} onAppSelect={openApp} />}
              {isLaunchpadVisible && <Launchpad onClose={() => setLaunchpadVisible(false)} onAppSelect={openApp} wallpaperUrl={userData.settings.wallpaper} />}
              <ControlCenter visible={isControlCenterVisible} onClose={() => setControlCenterVisible(false)} brightness={brightness} onBrightnessChange={setBrightness} wifiOn={wifiOn} onWifiToggle={() => setWifiOn(prev => !prev)} bluetoothOn={bluetoothOn} onBluetoothToggle={() => setBluetoothOn(prev => !prev)} />
              <NotificationCenter visible={isNotificationCenterVisible} notifications={notifications} onClear={() => setNotifications([])} />
              <div className="fixed top-9 right-4 z-[9999] space-y-2">
                {toasts.map(toast => (<NotificationToast key={toast.id} notification={toast} />))}
              </div>
            </>
          ) : (
            <LoginScreen onLogin={handleLogin} />
          )}
        </div>
      </SecurityProvider>
    </MusicProvider>
  );
};

export default App;
