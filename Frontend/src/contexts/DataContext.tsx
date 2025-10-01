import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DataContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
  selectedOutlet: number | null;
  setSelectedOutlet: (outletId: number | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(1); // Default to main outlet

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value: DataContextType = {
    refreshTrigger,
    triggerRefresh,
    selectedOutlet,
    setSelectedOutlet,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};