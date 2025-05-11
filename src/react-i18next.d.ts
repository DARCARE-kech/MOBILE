
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend the TransProps interface to match specific requirements
  interface TransProps {
    children?: ReactNode;
  }

  // Make sure ReactNode is properly handled in i18next
  interface TFunction {
    (key: string | string[], options?: object): string | ReactNode;
  }
}
