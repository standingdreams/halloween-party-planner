'use client';

import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Radio,
  RadioGroup,
} from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

import { Loader } from '@/components/Loader';

import { fontdinerSwanky } from '@/app/fonts';
import { cn } from '@/lib/utils';

import { api } from '../../../../convex/_generated/api';
import { type Id } from '../../../../convex/_generated/dataModel';

enum AttendeeStatus {
  GOING,
  MAYBE,
  NOT_GOING,
}

interface AttendeeData {
  attendeeName: string;
  attendeeEmailAddress: string;
  attendeeCount: number;
  attendeeComment: string;
  attendeeStatus: string;
}

const inviteeStatus = [
  {
    id: AttendeeStatus.GOING,
    title: 'Going',
    description: 'Last message sent an hour ago',
    users: '621 users',
  },
  {
    id: AttendeeStatus.MAYBE,
    title: 'Maybe',
    description: 'Last message sent 2 weeks ago',
    users: '1200 users',
  },
  {
    id: AttendeeStatus.NOT_GOING,
    title: 'Not Going',
    description: 'Last message sent 4 days ago',
    users: '2740 users',
  },
];

export default function PublicEventView({
  params,
}: {
  params: { id: string };
}) {
  const { control, register, handleSubmit } = useForm<AttendeeData>({
    defaultValues: {
      attendeeName: '',
      attendeeEmailAddress: '',
      attendeeCount: 1,
      attendeeComment: '',
      attendeeStatus: '',
    },
  });
  const eventData = useQuery(api.events.getEvent, {
    id: params.id as Id<'events'>,
  });
  const [isOpen, setIsOpen] = useState(false);
  const createRsvp = useMutation(api.invitees.updateInvitee);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const submitRsvp: SubmitHandler<AttendeeData> = async (data) => {
    await createRsvp({
      eventId: eventData._id,
      ...data,
    });
    setIsOpen(false);
  };

  if (!eventData) return <Loader loading={!eventData} />;

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className={`${fontdinerSwanky.className} text-center text-5xl`}>
        View event
      </h1>
      <div>
        <h2>Event Review</h2>
        <h3>Event Name: {eventData.eventName}</h3>
        <h3>Event Description: {eventData.eventDescription}</h3>
        <h3>Event Date: {eventData.eventDate}</h3>
        <h3>Country: {eventData.country}</h3>
        <h3>Street Address: {eventData.streetAddress}</h3>
        <h3>City: {eventData.city}</h3>
        <h3>Region: {eventData.region}</h3>
        <h3>Postal Code: {eventData.postalCode}</h3>
      </div>
      <button
        className="mx-auto flex h-10 items-center justify-center rounded-full border border-solid border-white/[.145] px-4 text-sm transition-colors enabled:hover:border-transparent enabled:hover:bg-[#f2f2f2] enabled:hover:text-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
        onClick={open}
      >
        RSVP to event
      </button>
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-3xl rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h2"
                className={cn(
                  'text-2xl font-medium text-white',
                  fontdinerSwanky.className,
                )}
              >
                Are you going to the event?
              </DialogTitle>
              <form onClick={handleSubmit(submitRsvp)}>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="attendeeName"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Your Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="attendeeName"
                        type="text"
                        className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        {...register('attendeeName')}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="attendeeEmailAddress"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Your Email Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="attendeeEmailAddress"
                        type="text"
                        className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        {...register('attendeeEmailAddress')}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="attendeeCount"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Number of Guests
                    </label>
                    <div className="mt-2">
                      <input
                        id="attendeeCount"
                        type="number"
                        className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        {...register('attendeeCount')}
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="attendeeComment"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Comment
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="attendeeComment"
                        rows={3}
                        className="block h-60 w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                        {...register('attendeeComment')}
                      />
                    </div>
                  </div>
                </div>
                <fieldset>
                  <Controller
                    control={control}
                    name="attendeeStatus"
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onChange={(value) => {
                          // setSelectedMailingLists();
                          field.onChange(value);
                        }}
                        className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
                      >
                        {inviteeStatus.map((status) => (
                          <Radio
                            key={status.id}
                            value={status.title}
                            aria-label={status.title}
                            className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[focus]:border-indigo-600 data-[focus]:ring-2 data-[focus]:ring-indigo-600"
                          >
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <span className="block text-base font-bold text-gray-900">
                                  {status.title}
                                </span>
                              </span>
                            </span>
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-indigo-600 [.group:not([data-checked])_&]:invisible"
                            />
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-600"
                            />
                          </Radio>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </fieldset>
                <div className="mt-4">
                  <Button
                    type="submit"
                    className="mx-auto flex h-10 items-center justify-center rounded-full border border-solid border-white/[.145] px-4 text-sm transition-colors enabled:hover:border-transparent enabled:hover:bg-[#f2f2f2] enabled:hover:text-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
                  >
                    RSVP
                  </Button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
