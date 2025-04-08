import { Typography } from '@mui/material';
import clsx from 'clsx';
import { createElement, isValidElement } from 'react';

export const TextWithLabel = ({ children, icon, title, childrenClasses, titleClasses, className, ...props }) => {
  return (
    <div {...props} className={clsx('mb-16', className)}>
      <Typography
        className={clsx('text-slate-300 text-base font-light', titleClasses)}
        gutterBottom
      >
        {icon && isValidElement(icon) && createElement(icon.type, { ...icon.props })}
        <span className="mr-4">{title}</span>
      </Typography>
      <Typography className={clsx('text-slate-300 text-xl', childrenClasses)} gutterBottom>
        {children}
      </Typography>
    </div>
  );
};
