import { Format } from 'fileSystem/types';

export const getFileDetailsFromGistName = (
  path: string
): {
  name: string;
  type: 'inputs' | 'scripts';
  format: Format;
} => {
  let parsedIdentifier = path.match(/^__(scripts|inputs)__(.*)\.(.*)$/);

  if (!parsedIdentifier) {
    // probably dwl-project.json or some other file
    // we create an empty capture group so we can match the same array indexes for both results
    // javascript does not support named capture groups
    parsedIdentifier = path.match(/^()(.*)\.(.*)$/);
  }

  const type = (parsedIdentifier[1] || null) as 'inputs' | 'scripts';
  const name = parsedIdentifier[2];
  const format = parsedIdentifier[3] as Format;

  return {
    name,
    type,
    format
  };
};

export const getGithubToken = () => {
  let token;

  try {
    token = JSON.parse(localStorage.getItem('ghToken'))['access_token'];
  } catch (e) {
    token = null;
  }

  return token;
};
