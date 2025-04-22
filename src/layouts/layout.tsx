import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Space, Button } from 'antd';
const layout = () => {
  return (
    <div>
      <Space>
        <Button type="link" href="#/">
          Home
        </Button>
        <Button type="link" href="#/demo">
          Demo
        </Button>
        <Button type="link" href="#/projects">
          Projects
        </Button>
        <Button type="link" href="#/demo">
          Demo
        </Button>
      </Space>
      <Outlet />
    </div>
  );
};

export default layout;
