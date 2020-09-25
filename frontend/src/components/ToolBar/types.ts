import { ToolBarTab } from 'ui/types';

export interface IProps {
  isToolBarOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onSelectTab?: (tab: ToolBarTab) => void;
  selectedTab?: ToolBarTab;
}
