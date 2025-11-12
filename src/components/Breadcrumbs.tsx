import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const AppBreadcrumbs: React.FC<AppBreadcrumbsProps> = ({ items }) => {
  return (
    <Breadcrumb className="mb-3">
      {items.map((item, index) => (
        <Breadcrumb.Item 
          key={index}
          linkAs={Link}
          linkProps={{ to: item.path || '#' }}
          active={index === items.length - 1}
        >
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default AppBreadcrumbs;