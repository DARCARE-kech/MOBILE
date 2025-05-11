
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend TransProps interface
  export interface TransProps {
    children?: ReactNode;
  }

  // Ensure ReactI18NextChildren is compatible with ReactNode
  export type ReactI18NextChildren = ReactNode;
}
