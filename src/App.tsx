import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#667eea',
          colorSuccess: '#00b894',
          colorWarning: '#fdcb6e',
          colorError: '#d63031',
          borderRadius: 12,
          fontSize: 14,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Layout: {
            siderBg: 'rgba(255, 255, 255, 0.95)',
            headerBg: 'rgba(255, 255, 255, 0.95)',
          },
          Card: {
            borderRadiusLG: 16,
          },
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            paddingInline: 24,
          },
          Input: {
            borderRadius: 8,
            paddingInline: 12,
            controlHeight: 40,
          },
          Select: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Tabs: {
            itemActiveColor: '#fff',
            itemSelectedColor: '#fff',
            inkBarColor: '#667eea',
          },
          Modal: {
            borderRadiusLG: 16,
          },
          Table: {
            borderRadiusLG: 12,
          },
          Progress: {
            borderRadiusLG: 8,
          },
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<GeneratePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/image-generator" element={<ImageGeneratorPage />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
