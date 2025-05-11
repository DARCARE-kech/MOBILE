
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend ReactI18NextChildren to be compatible with ReactNode
  interface ReactI18NextChildren extends ReactNode {}

  // Extend the TransProps interface
  interface TransProps {
    children?: ReactNode;
  }

  // Make sure ReactNode is properly handled in i18next
  interface TFunction {
    (key: string | string[], options?: object): string | ReactNode;
  }
}
