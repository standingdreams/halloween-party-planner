'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useMutation } from 'convex/react';
import { formatISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider, type SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import { EventReview } from '@/components/EventReview';
import { Loader } from '@/components/Loader';
import { ProgressBar } from '@/components/ProgressBar';
import { DatePicker } from '@/components/ui/DatePicker';

import { fontdinerSwanky } from '@/app/fonts';
import { generateTitle } from '@/lib/generateTitle';
import { cn } from '@/lib/utils';

import { api } from '../../../../convex/_generated/api';

enum StepStatus {
  Complete = 'complete',
  Current = 'current',
  Upcoming = 'upcoming',
}

export interface Step {
  id: number;
  name: string;
  href: string;
  status: StepStatus;
}

export interface EventFormData {
  eventName: string;
  eventDescription: string;
  eventDate: string;
  country: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
}

const steps = [
  { id: 0, name: 'Event Name', href: '#', status: StepStatus.Complete },
  { id: 1, name: 'Address', href: '#', status: StepStatus.Upcoming },
  // { id: 2, name: 'Event Art', href: '#', status: StepStatus.Current },
  { id: 2, name: 'Invitees', href: '#', status: StepStatus.Upcoming },
  { id: 3, name: 'Review', href: '#', status: StepStatus.Upcoming },
];

export default function NewEvent() {
  const methods = useForm<EventFormData>({
    defaultValues: {
      eventName: '',
      eventDescription: '',
      eventDate: formatISO(new Date()),
      country: '',
      streetAddress: '',
      city: '',
      region: '',
      postalCode: '',
    },
  });
  const {
    handleSubmit: handleSubmitInvitee,
    register: registerInvitee,
    reset: resetInvitee,
  } = useForm<{ invitee: string }>();

  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [halloweenTitles, setHalloweenTitles] = useState<{ title: string }[]>(
    [],
  );
  const generateUploadUrl = useMutation(api.events.generateUploadUrl);
  const [inviteesEmail, setInviteesEmail] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTitles, setIsLoadingTitles] = useState(false);
  const [openTitleModal, setOpenTitleModal] = useState(false);
  const createEvent = useMutation(api.events.createEvent);
  const addInvitees = useMutation(api.invitees.addInvitees);

  const loaderProps = {
    loading: isLoadingTitles,
    size: 135,
    duration: 1,
    colors: ['#5e22f0', '#f6b93b'],
  };

  async function titleBtnHandler() {
    setIsLoadingTitles(true);
    setOpenTitleModal(true);
    const titles = await generateTitle();
    setHalloweenTitles(titles);
    setIsLoadingTitles(false);
  }

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    const postUrl = await generateUploadUrl();
    setIsLoading(true);
    const eventId = await createEvent(data);
    await addInvitees({
      emails: inviteesEmail,
      eventId,
    });
    router.push(`/event/${eventId}`);
  };

  const addInvitee: SubmitHandler<{ invitee: string }> = ({ invitee }) => {
    setInviteesEmail((prev) => [...prev, invitee]);
    resetInvitee();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  function handleTitleClick(selectedTitle: string) {
    methods.setValue('eventName', selectedTitle);
  }

  return (
    <>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
        <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
          <h1 className={`${fontdinerSwanky.className} text-center text-5xl`}>
            Create your event
          </h1>

          <div className="flex w-full flex-col items-center gap-4">
            <FormProvider {...methods}>
              <form
                id="newEventForm"
                className="w-full"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                {currentStep === 0 && (
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                      <label
                        htmlFor="eventName"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Event Name
                      </label>
                      <div className="mt-2 flex flex-col gap-y-2">
                        <input
                          id="eventName"
                          type="text"
                          className="block w-3/4 rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          {...methods.register('eventName')}
                        />
                        <button
                          className="w-52 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          type="button"
                          onClick={titleBtnHandler}
                        >
                          Generate Ideas
                        </button>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="eventDate"
                        className="mb-2 block text-sm font-medium leading-6 text-white"
                      >
                        Event date
                      </label>
                      <DatePicker />
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="eventDescription"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        About
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="eventDescription"
                          rows={3}
                          className="block h-60 w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          {...methods.register('eventDescription')}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-400">
                        Write a few sentences about your event.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Country
                      </label>
                      <div className="mt-2">
                        <Controller
                          name="country"
                          control={methods.control}
                          render={({ field }) => {
                            return (
                              <select
                                id="country"
                                autoComplete="country-name"
                                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                                {...field}
                              >
                                <option>United States</option>
                                <option>Canada</option>
                                <option>Mexico</option>
                              </select>
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Street address
                      </label>
                      <div className="mt-2">
                        <input
                          id="street-address"
                          type="text"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          {...methods.register('streetAddress')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 sm:col-start-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        City
                      </label>
                      <div className="mt-2">
                        <input
                          id="city"
                          type="text"
                          autoComplete="address-level2"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          {...methods.register('city')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        State / Province
                      </label>
                      <div className="mt-2">
                        <input
                          id="region"
                          type="text"
                          autoComplete="address-level1"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          {...methods.register('region')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-2">
                        <input
                          id="postal-code"
                          type="text"
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          {...methods.register('postalCode')}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* {currentStep === 2 && (
                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                      <div className="text-center">
                        <PhotoIcon
                          aria-hidden="true"
                          className="mx-auto h-12 w-12 text-gray-500"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                          <label
                            htmlFor="eventCoverPhoto"
                            className="relative cursor-pointer rounded-md bg-background font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-background hover:text-[#ee5622]"
                          >
                            <span>Upload a file</span>
                            <input
                              id="eventCoverPhoto"
                              type="file"
                              className="sr-only"
                              {...methods.register('eventCoverPhoto')}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                )} */}
              </form>

              {currentStep === 2 && (
                <form onSubmit={handleSubmitInvitee(addInvitee)}>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-full">
                      <label
                        htmlFor="invitee"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Invitees
                      </label>
                      <div className="mt-2 flex gap-x-2">
                        <input
                          id="invitee"
                          type="email"
                          className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          {...registerInvitee('invitee', {
                            required: 'Invitee email is required',
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: 'Please enter a valid email address',
                            },
                          })}
                        />
                        <button
                          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          type="submit"
                        >
                          Add
                        </button>
                      </div>
                      {inviteesEmail.length > 0 && (
                        <div className="mt-6 flex gap-2">
                          {inviteesEmail.map((member, index) => (
                            <span
                              key={`member-${index}`}
                              className="inline-flex items-center gap-x-0.5 rounded-md bg-gray-50 px-4 py-2 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                            >
                              {member}
                              <button
                                type="button"
                                className="group relative ml-2 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
                                onClick={() => {
                                  setInviteesEmail((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  );
                                }}
                              >
                                <span className="sr-only">Remove</span>
                                <svg
                                  viewBox="0 0 14 14"
                                  className="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
                                >
                                  <path d="M4 4l6 6m0-6l-6 6" />
                                </svg>
                                <span className="absolute -inset-1" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {currentStep === 3 && (
                <EventReview
                  control={methods.control}
                  inviteesEmail={inviteesEmail}
                  isSubmitting={isLoading}
                />
              )}
            </FormProvider>
          </div>
        </main>
        <footer className="row-start-3 flex flex-wrap items-center justify-center gap-6">
          <EventBtn
            title="Prev"
            disabled={currentStep === 0}
            onClick={prevStep}
          />
          {currentStep < steps.length - 1 ? (
            <EventBtn
              title="Next"
              disabled={currentStep === steps.length - 1}
              onClick={nextStep}
            />
          ) : (
            <button
              className="mx-auto flex h-10 items-center justify-center rounded-full border border-solid border-white/[.145] bg-secondary px-4 text-sm transition-colors enabled:hover:border-transparent enabled:hover:bg-[#A47FDB] enabled:hover:text-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
              type="submit"
              form="newEventForm"
            >
              Submit
            </button>
          )}
        </footer>
      </div>
      <Dialog
        open={openTitleModal}
        onClose={() => setOpenTitleModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-[65%] space-y-4 bg-[#3E3053] p-12">
            <DialogTitle className="font-bold">Choose a title</DialogTitle>
            {isLoadingTitles ? (
              <Loader loading={isLoadingTitles} />
            ) : (
              <ul className="grid grid-cols-2 gap-4 p-4">
                {halloweenTitles?.map((title) => (
                  <li key={title.title}>
                    <button
                      className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => {
                        handleTitleClick(title.title);
                        setOpenTitleModal(false);
                      }}
                    >
                      {title.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* <Description>
              This will permanently deactivate your account
            </Description> */}
            {/* <div className="flex gap-4">
              <button onClick={() => setOpenTitleModal(false)}>Cancel</button>
              <button onClick={() => setOpenTitleModal(false)}>
                Deactivate
              </button>
            </div> */}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

function EventBtn({
  title,
  disabled,
  onClick,
  isSubmit,
}: {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
  isSubmit?: boolean;
}) {
  return (
    <button
      className={cn(
        'mx-auto flex h-10 items-center justify-center rounded-full border border-solid border-white/[.145] bg-secondary px-4 text-sm transition-colors enabled:hover:border-transparent enabled:hover:bg-[#8B6BB9] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base',
        {
          'opacity-5': disabled,
        },
      )}
      type="button"
      onClick={onClick ?? undefined}
      disabled={!isSubmit && disabled}
    >
      {title}
    </button>
  );
}
