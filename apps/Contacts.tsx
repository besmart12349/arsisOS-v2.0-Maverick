import React, { useState } from 'react';
import type { Notification } from '../types';

interface SiteCreatorProps {
  addNotification?: (notification: Omit<Notification, 'id' | 'icon'>) => void;
}

type SiteTheme = 'light' | 'dark';

const SiteCreator: React.FC<SiteCreatorProps> = ({ addNotification }) => {
  const [title, setTitle] = useState('My Maverick Site');
  const [description, setDescription] = useState('Welcome to my new website, created with ArsisOS!');
  const [content, setContent] = useState('This is the main content of my page. I can write anything I want here.\n\nNew paragraphs can be created by adding a new line.');
  const [theme, setTheme] = useState<SiteTheme>('light');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      const siteName = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      addNotification?.({
        appId: 'site-creator',
        title: 'Site Published!',
        message: `Your site is now live at ${siteName}.mav-pages.dev`,
      });
      setIsPublishing(false);
    }, 1500);
  };

  const previewClasses = theme === 'light'
    ? 'bg-white text-gray-800'
    : 'bg-gray-800 text-gray-200';
  
  const previewLinkClasses = theme === 'light'
    ? 'text-blue-600 hover:underline'
    : 'text-blue-400 hover:underline';

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex text-gray-800 dark:text-gray-200">
      {/* Controls Panel */}
      <div className="w-1/3 h-full border-r border-gray-300 dark:border-gray-700 p-4 flex flex-col space-y-4 overflow-y-auto">
        <h2 className="text-lg font-bold">Site Settings</h2>
        <div>
          <label htmlFor="site-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Title</label>
          <input
            id="site-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="site-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Subtitle</label>
          <textarea
            id="site-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="site-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Content</label>
          <textarea
            id="site-content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <div className="mt-2 flex space-x-4">
                <label className="flex items-center">
                    <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={() => setTheme('light')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"/>
                    <span className="ml-2">Light</span>
                </label>
                <label className="flex items-center">
                    <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"/>
                    <span className="ml-2">Dark</span>
                </label>
            </div>
        </div>
        <div className="flex-grow"></div>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-500"
        >
          {isPublishing ? 'Publishing...' : 'Publish to Maverick Pages'}
        </button>
      </div>

      {/* Preview Panel */}
      <div className="w-2/3 h-full p-4 bg-gray-200 dark:bg-gray-800">
        <div className={`w-full h-full shadow-lg rounded-md overflow-y-auto ${previewClasses}`}>
            <div className="max-w-4xl mx-auto p-8 font-sans">
                <header className="border-b pb-4 mb-6 dark:border-gray-600">
                    <h1 className="text-4xl font-bold">{title}</h1>
                    <p className="text-lg mt-2 text-gray-600 dark:text-gray-400">{description}</p>
                </header>
                <main className="text-base leading-relaxed space-y-4">
                    {content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </main>
                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400 border-t pt-4 dark:border-gray-600">
                    <p>Powered by <a href="#" className={previewLinkClasses}>Maverick Pages</a> on ArsisOS.</p>
                </footer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SiteCreator;
