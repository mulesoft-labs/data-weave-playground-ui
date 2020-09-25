import { IFile } from 'fileSystem/types';
import { SideBarView } from 'ui/types';

export interface IProps {
  selectedView?: SideBarView;
  onCreateScript?: (path: string, content: string) => void;
  onCreateInput?: (path: string, content: string) => void;
}

export interface IState {
  dropZoneActive: boolean;
}
