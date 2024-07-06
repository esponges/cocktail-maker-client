import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { moment, complexity, spirits, tools, mixers } from "@/lib/form-options";
import { Spinner } from "@/components/ui/custom/spinner";

import type { Control } from "react-hook-form";

type FormValues = {
  mixers: { value: string; label: string }[];
  suggestMixers?: boolean;
  spirits?: { value: string; label: string }[];
  moment?: string;
  cost?: number;
  complexity?: string;
  tools?: { value: string; label: string }[];
  hasShaker?: boolean;
};

type Props = {
  control: Control<FormValues>;
  isLoading: boolean;
};

export function CreateCocktailForm({
  control,
  isLoading,
}: Props) {
  return (
    <fieldset disabled={isLoading}>
      <FormField
        control={control}
        name="spirits"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Spirits</FormLabel>
            <MultipleSelector
              maxSelected={3}
              onChange={(value) => {
                field.onChange(value);
              }}
              disabled={isLoading}
              defaultOptions={spirits}
              placeholder="Select at least one..."
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
            <FormDescription>Optional - Select up to 3 spirits</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="mixers"
        render={({ field: { onChange } }) => (
          <>
            <FormItem className="mt-4">
              <FormLabel>Mixers *</FormLabel>
              <MultipleSelector
                maxSelected={3}
                onMaxSelected={(maxLimit) => {
                  console.log(`You have reached max selected: ${maxLimit}`);
                }}
                disabled={isLoading}
                onChange={(value) => {
                  onChange(value);
                }}
                defaultOptions={mixers}
                placeholder="Select at least one..."
                emptyIndicator={
                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                    no results found.
                  </p>
                }
              />
              <FormDescription>You can select up to 3 mixers</FormDescription>
              <FormMessage />
            </FormItem>
          </>
        )}
      />
      <FormField
        control={control}
        name="suggestMixers"
        render={({ field }) => (
          <FormItem className="mt-4">
            <div className="items-top flex space-x-2 mt-4">
              <Checkbox
                id="suggestMixers"
                defaultChecked
                onCheckedChange={field.onChange}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="suggestMixers"
                  className={`text-sm font-medium leading-none 
                peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                >
                  Suggest extra mixers?
                </label>
                <p className="text-sm text-muted-foreground">
                  Some cocktails might require extra mixers for the perfect
                  recipe. However, if you only want to use the mixers you have
                  selected, you can disable this and we will find the best
                  recipe for you.
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="moment"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Moment</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a moment" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {moment.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Optional - The moment or time of the cocktail
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="cost"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Cost</FormLabel>
            <Input
              type="number"
              placeholder="Cost of the cocktail"
              {...field}
            />
            <FormDescription>
              Optional - The cost of the cocktail (in USD)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="complexity"
        defaultValue={complexity[1].value}
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Complexity</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={complexity[1].value} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {complexity.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Optional - The complexity of the cocktail
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tools"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Tools</FormLabel>
            <MultipleSelector
              maxSelected={5}
              onChange={(value) => {
                field.onChange(value);
              }}
              defaultOptions={tools}
              placeholder="Select tools..."
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                  no results found.
                </p>
              }
            />
            <FormDescription>
              Optional - Select up to 5 tools that you want to use
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hasShaker"
        render={({ field }) => (
          <FormItem className="mt-4">
            <div className="items-top flex space-x-2 mt-4">
              <Checkbox
                id="hasShaker"
                defaultChecked
                onCheckedChange={field.onChange}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="hasShaker"
                  className={`text-sm font-medium leading-none 
                peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                >
                  Do you have a shaker?
                </label>
                <p className="text-sm text-muted-foreground">
                  The Shaker is probably the most important tool to craft a
                  cocktail. However, if you do not have one we can still create
                  a great cocktail for you!
                </p>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="text-center mt-4">
        {!isLoading ? (
          <Button type="submit">Create Cocktail 🍸</Button>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>We are crafting your cocktail...</span>
            <Spinner show />
          </div>
        )}
      </div>
    </fieldset>
  );
}
