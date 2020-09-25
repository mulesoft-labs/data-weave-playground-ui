export interface IGistState {
  gistId: string;
}

export interface IGetGistResponse {
  'url': string;
  'forks_url': string;
  'commits_url': string;
  'id': string;
  'description': string;
  'public': true;
  'owner': {
    'login': string;
    'id': number;
    'avatar_url': string;
    'gravatar_id': string;
    'url': string;
    'html_url': string;
    'followers_url': string;
    'following_url': string;
    'gists_url': string;
    'starred_url': string;
    'subscriptions_url': string;
    'organizations_url': string;
    'repos_url': string;
    'events_url': string;
    'received_events_url': string;
    'type': string;
    'site_admin': false;
  };
  'user': null; // no idea
  'files': {
    'ring.erl': {
      'size': number;
      'raw_url': string;
      'type': 'text/plain';
      'language': string;
      'truncated': false;
      'content': string;
    };
  };
  'truncated': false;
  'comments': number;
  'comments_url': string;
  'html_url': string;
  'git_pull_url': string;
  'git_push_url': string;
  'created_at': string;
  'updated_at': string;
  'forks': [
    {
      'user': {
        'login': string;
        'id': number;
        'avatar_url': string;
        'gravatar_id': string;
        'url': string;
        'html_url': string;
        'followers_url': string;
        'following_url': string;
        'gists_url': string;
        'starred_url': string;
        'subscriptions_url': string;
        'organizations_url': string;
        'repos_url': string;
        'events_url': string;
        'received_events_url': string;
        'type': string;
        'site_admin': false;
      };
      'url': string;
      'id': string;
      'created_at': string;
      'updated_at': string;
    }
  ];
  'history': [
    {
      'url': string;
      'version': string;
      'user': {
        'login': string;
        'id': number;
        'avatar_url': string;
        'gravatar_id': string;
        'url': string;
        'html_url': string;
        'followers_url': string;
        'following_url': string;
        'gists_url': string;
        'starred_url': string;
        'subscriptions_url': string;
        'organizations_url': string;
        'repos_url': string;
        'events_url': string;
        'received_events_url': string;
        'type': string;
        'site_admin': false;
      };
      'change_status': {
        'deletions': number;
        'additions': number;
        'total': number;
      };
      'committed_at': string;
    }
  ];
}
