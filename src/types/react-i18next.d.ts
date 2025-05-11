
import 'react-i18next';
import { ReactNode } from 'react';

declare module 'react-i18next' {
  // Extend TransProps interface
  export interface TransProps {
    children?: ReactNode;
  }

  // Define ReactI18NextChildren as directly extending ReactNode
  export type ReactI18NextChildren = ReactNode;
}
