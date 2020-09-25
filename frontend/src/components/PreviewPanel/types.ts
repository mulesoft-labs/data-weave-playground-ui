import { PreviewStatus } from 'dataweave/types';
import { MediaType, Format } from 'fileSystem/types';

export interface IProps {
  content?: string;
  status?: PreviewStatus;
  format?: Format;
  mediaType?: MediaType;
  onMediaTypeChange?: (mediaType: MediaType) => void;
}
