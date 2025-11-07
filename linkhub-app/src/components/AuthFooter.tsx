import { Link } from 'react-router-dom';

type AuthFooterProps = {
  question: string;
  linkText: string;
  linkTo: string;
};

export function AuthFooter({ question, linkText, linkTo }: AuthFooterProps) {
  return (
    <p className="text-center text-sm text-text mt-6">
      {question}{' '}
      <Link to={linkTo} className="text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}

export default AuthFooter;
