import React from 'react';

type CardProps = {
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
};

export function Card({ as: Component = 'div', className = '', children }: CardProps) {
  return (
    <Component className={`card ${className}`}>
      {children}
    </Component>
  );
}

export default Card;
