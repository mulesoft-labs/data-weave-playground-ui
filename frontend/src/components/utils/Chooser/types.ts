import { IDictionary } from 'common/types';

export interface IProps {
  className: string;
  active: number | string;
  choices: IDictionary<JSX.Element> | JSX.Element[];
}
