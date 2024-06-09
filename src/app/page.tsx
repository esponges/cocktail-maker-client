'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mixers, spirits, moment } from '@/lib/form-options';
import MultipleSelector from '@/components/ui/multiple-selector';

const FormSchema = z.object({
  mixers: z.array(z.object({ value: z.string(), label: z.string() })),
  spirits: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .optional(),
  moment: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .optional(),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-2/3 space-y-6'
        >
          <FormField
            control={form.control}
            name='mixers'
            render={({ field: { onChange } }) => (
              <>
                <FormItem>
                  <FormLabel>Mixers *</FormLabel>
                  <MultipleSelector
                    maxSelected={3}
                    onMaxSelected={(maxLimit) => {
                      console.log(`You have reached max selected: ${maxLimit}`);
                    }}
                    onChange={(value) => {
                      console.log(value);
                      onChange(value);
                    }}
                    defaultOptions={mixers}
                    placeholder='Select at least one...'
                    emptyIndicator={
                      <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                        no results found.
                      </p>
                    }
                  />
                  <FormDescription>
                    You can select up to 3 mixers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Spirits</FormLabel>
                  <MultipleSelector
                    maxSelected={3}
                    onChange={(value) => {
                      console.log(value);
                    }}
                    defaultOptions={spirits}
                    placeholder='Select at least one...'
                    emptyIndicator={
                      <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                        no results found.
                      </p>
                    }
                  />
                  <FormDescription>
                    Optional - You can select up to 3 spirits
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                <FormItem>
                  <FormLabel>Moment</FormLabel>
                  <MultipleSelector
                    onChange={(value) => {
                      console.log(value);
                    }}
                    defaultOptions={[]}
                    placeholder='Select at least one...'
                    emptyIndicator={
                      <p className='text-center text-lg leading-10 text-gray-600 dark:text-gray-400'>
                        no results found.
                      </p>
                    }
                  />
                  <FormDescription>
                    Optional - You can select up to 3 moments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
                <FormField
                  control={form.control}
                  name='moment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Optional - Select a moment' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {moment.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The moment or time of the cocktail
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          />
          <Button type='submit'>Create Cocktail 🍸</Button>
        </form>
      </Form>
    </main>
  );
}
