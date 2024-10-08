'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format, formatISO } from 'date-fns';
import * as React from 'react';
import { useState } from 'react';
import { useController } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

export function DatePicker() {
  const { field } = useController({
    name: 'eventDate',
    rules: { required: true },
  });
  const [date, setDate] = React.useState<string>(field.value);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(date)}
          onSelect={(date) => {
            const result = date ? date.toISOString() : formatISO(new Date());
            setDate(result);
            field.onChange(result);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
