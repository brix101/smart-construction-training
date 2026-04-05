import type { Course, Topic } from '@/server/db/schema'

export interface TopicGroup {
  courseId: Course['id']
  course: Course['name']
  topics: Array<Pick<Topic, 'id' | 'name'>>
}
