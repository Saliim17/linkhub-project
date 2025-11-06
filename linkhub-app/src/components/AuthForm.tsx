import React from 'react';
import { Card } from './Card';

type AuthFormProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthForm({ title, children, footer }: AuthFormProps) {
  return (
    <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <h2 className="text-3xl font-bold text-center text-text mb-6">{title}</h2>

          {children}

          {footer && <div className="mt-6">{footer}</div>}
        </Card>
      </div>
    </div>
  );
}

export default AuthForm;
