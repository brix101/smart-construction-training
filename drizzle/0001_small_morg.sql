CREATE INDEX "categories_search_idx" ON "categories" USING gin ((
      setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
      setweight(to_tsvector('english', coalesce("description", '')), 'B')
    ));--> statement-breakpoint
CREATE INDEX "courses_search_idx" ON "courses" USING gin ((
      setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
      setweight(to_tsvector('english', coalesce("description", '')), 'B')
    ));--> statement-breakpoint
CREATE INDEX "topics_search_idx" ON "topics" USING gin ((
    setweight(to_tsvector('english', coalesce("name", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("description", '')), 'B')
  ));