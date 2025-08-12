export const userKeys = {
  all: ['users'] as const,
  me: () => ['users', 'me'] as const
}

export const studyKeys = {
  all: ['studies'] as const,
  sidebar: (userId: number) => ['studies', 'sidebar', userId] as const,
  allMine: () => ['studies', 'all'] as const,
  detail: (hashId: string) => ['studies', 'detail', hashId] as const,
  members: (studyId: string) => ['studies', 'members', studyId] as const,
  joinRequests: (studyId: number) => ['studies', 'joinRequests', studyId] as const,
}

export const orgKeys = {
  all: ['org'] as const,
  requests: (studyId: number) => ['org', 'requests', studyId] as const
}

export const refKeys = {
  all: ['ref'] as const,
  list: (studyId: number) => ['ref', 'list', studyId] as const,
  categories: (studyId: number) => ['ref', 'categories', studyId] as const,
}

export const aiKeys = {
  all: ['ai'] as const,
  list: (userId: number) => ['ai', 'list', userId] as const,
  sidebar: (userId: number) => ['ai', 'sidebar', userId] as const,
  detail: (id: number) => ['ai', 'detail', id] as const
}

export const scheduleKeys = {
  all: ['schedule'] as const,
  byStudyMonth: (studyId: number, y: number, m: number) => ['schedule', 'byStudyMonth', { studyId, y, m }] as const,
  myMonthly: (userId: number, y: number, m: number) => ['schedule', 'myMonthly', { userId, y, m }] as const,
}
