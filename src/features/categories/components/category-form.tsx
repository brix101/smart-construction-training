import { XIcon } from 'lucide-react'
import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { UploadButton } from '@/lib/uploadthing'

interface CategoryFormProps<T extends FieldValues> extends Omit<
  React.ComponentPropsWithRef<'form'>,
  'onSubmit'
> {
  children: React.ReactNode
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
}

export function CategoryForm<T extends FieldValues>({
  children,
  form,
  onSubmit,
}: CategoryFormProps<T>) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 px-4"
      >
        <FormField
          control={form.control}
          name={'imgSrc' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Card className="mx-auto size-44 items-center justify-center overflow-hidden border-dashed">
                  {field.value ? (
                    <AspectRatio ratio={4 / 4}>
                      <img
                        src={field.value}
                        alt="Image"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <Button
                        className="absolute top-2 right-2"
                        size="icon-sm"
                        variant="destructive"
                        onClick={() => field.onChange('')}
                      >
                        <XIcon />
                      </Button>
                    </AspectRatio>
                  ) : (
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl)
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(error.message)
                      }}
                    />
                  )}
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'name' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type category name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'description' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type category description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  )
}
