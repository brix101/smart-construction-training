import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { CircleIcon, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'
import { useTRPC } from '@/integrations/trpc/react'
import { cn, isMacOs } from '@/lib/utils'

export function TopicCommandMenu() {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query, 500)

  const { mutate, data, isPending } = useMutation(
    trpc.topics.getTopics.mutationOptions(),
  )

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      return
    }

    mutate({ query: debouncedQuery })
  }, [debouncedQuery])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false)
    callback()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="relative w-9 p-0 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Start typing...</span>
        <span className="sr-only">Start typing</span>
        <KbdGroup
          title={isMacOs() ? 'Command' : 'Control'}
          className="pointer-events-none absolute top-1 right-1 hidden xl:block"
        >
          <Kbd>{isMacOs() ? '⌘' : 'Ctrl'} K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open)
          if (!open) {
            setQuery('')
          }
        }}
      >
        <SheetTitle className="sr-only">x</SheetTitle>
        <CommandInput
          placeholder="Start typing..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty
            className={cn(isPending ? 'hidden' : 'py-6 text-center text-sm')}
          >
            No Item found.
          </CommandEmpty>
          {isPending ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
              <Skeleton className="h-4 w-10 rounded" />
              <Skeleton className="h-8 rounded-sm" />
              <Skeleton className="h-8 rounded-sm" />
            </div>
          ) : (
            data?.map((group) => (
              <CommandGroup
                key={group.course}
                className="capitalize"
                heading={group.course}
              >
                {group.topics.map((item) => {
                  return (
                    <CommandItem
                      key={item.id}
                      className="h-9"
                      value={item.name}
                      onSelect={() => console.log('Selected topic:', item.id)}
                    >
                      <CircleIcon
                        className="text-muted-foreground mr-2.5 size-3"
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
