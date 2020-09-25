import { MediaType } from 'fileSystem/types';

export const getDefaultShape = (type: MediaType) => {
  const shapes = {
    'application/json': '{}',
    'application/xml': '<?xml version="1.0" encoding="UTF-8"?>',
    'application/csv': '',
    'text/plain': '',
  };
  return shapes[type] || "";
};

export const getDefaultDataWeaveScript = (): string => {
  return '%dw 2.0\n\nfun echo(arg: String) = arg';
};
