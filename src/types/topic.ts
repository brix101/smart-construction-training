import { Course, Topic } from '@/server/db/schema'

export interface TopicGroup {
  courseId: Course['id']
  course: Course['name']
  topics: Pick<Topic, 'id' | 'name'>[]
}
