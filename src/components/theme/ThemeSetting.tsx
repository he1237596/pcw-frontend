import React from 'react'
import { Button } from 'antd';
import { useThemeContext } from '@context/ThemeContext'; // 路径按实际改

function ThemeSetting() {
  const { toggleTheme, themeMode } = useThemeContext();
  return (
    <div onClick={toggleTheme}>
      切换主题
      {/* ({themeMode === 'dark' ? '亮色' : '暗色'}) */}
    </div>
  )
}

export default ThemeSetting
