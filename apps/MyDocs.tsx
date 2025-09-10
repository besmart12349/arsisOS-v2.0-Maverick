import React, { useState } from 'react';

const FileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;

interface MyDocsProps {
    onOpenFile?: (fileHandle: FileSystemFileHandle) => void;
}

const MyDocs: React.FC<MyDocsProps> = ({ onOpenFile }) => {
  const [items, setItems] = useState<(FileSystemFileHandle | FileSystemDirectoryHandle)[]>([]);
  const [currentDirName, setCurrentDirName] = useState<string>('');

  const openDirectory = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      setCurrentDirName(dirHandle.name);
      const newItems = [];
      for await (const entry of dirHandle.values()) {
        newItems.push(entry);
      }
      // Sort folders first, then alphabetically
      newItems.sort((a, b) => {
        if (a.kind === b.kind) {
          return a.name.localeCompare(b.name);
        }
        return a.kind === 'directory' ? -1 : 1;
      });
      setItems(newItems);
    } catch (e) {
      console.error("User cancelled or failed to open directory", e);
    }
  };

  const handleItemDoubleClick = (item: FileSystemFileHandle | FileSystemDirectoryHandle) => {
    if (item.kind === 'file' && onOpenFile) {
        if (item.name.endsWith('.txt') || item.name.endsWith('.md')) {
            onOpenFile(item as FileSystemFileHandle);
        } else {
            alert('This file type is not supported for opening.');
        }
    }
    // Could add directory navigation logic here
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col dark:bg-gray-800 dark:text-white">
      <header className="flex-shrink-0 p-2 border-b bg-gray-100 flex items-center space-x-2 dark:bg-gray-900 dark:border-gray-700">
        <button onClick={openDirectory} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
          Open Directory
        </button>
        {currentDirName && <span className="text-sm text-gray-700 dark:text-gray-300">Current: <strong>{currentDirName}</strong></span>}
      </header>

      {items.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <FolderIcon />
          <p className="mt-2">No directory selected.</p>
          <p className="text-xs">Click "Open Directory" to browse local files.</p>
        </div>
      ) : (
        <div className="flex-grow overflow-auto p-2">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-2 rounded-tl-lg">Name</th>
                <th className="p-2 rounded-tr-lg">Type</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr 
                  key={item.name} 
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/50 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <td className="p-2 flex items-center space-x-3">
                    {item.kind === 'directory' ? <FolderIcon /> : <FileIcon />}
                    <span>{item.name}</span>
                  </td>
                  <td className="p-2 capitalize text-gray-600 dark:text-gray-400">{item.kind}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDocs;