import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', className = '', children, disabled, ...rest }: ButtonProps) {
  // Mapea la prop 'variant' a la clase CSS correspondiente.
  const variantClasses = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
  };
  const base = variantClasses[variant] || variantClasses.primary;
  // ensure aria-disabled reflects disabled state for assistive tech
  return (
    <button
      className={`${base} ${className}`} // La clase base ya contiene todos los estilos necesarios.
      disabled={disabled}
      aria-disabled={disabled ? 'true' : 'false'}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
