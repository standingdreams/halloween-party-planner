'use client';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';

import { Loader } from '@/components/Loader';

import { fontdinerSwanky } from '@/app/fonts';

import { api } from '../../../../convex/_generated/api';
import { type Id } from '../../../../convex/_generated/dataModel';

export default function EventView({ params }: { params: { id: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvitee, setSelectedInvitee] = useState<Id<'invitees'>>();
  const eventData = useQuery(api.events.getEvent, {
    id: params.id as Id<'events'>,
  });
  const inviteeData = useQuery(api.invitees.getInvitees, {
    eventId: params.id as Id<'events'>,
  });
  const deleteInvitee = useMutation(api.invitees.deleteInvitee);

  if (!eventData || !inviteeData) {
    return <Loader loading={!eventData || !inviteeData} />;
  }

  async function handleDeleteInvitee() {
    await deleteInvitee({ attendeeId: selectedInvitee as Id<'invitees'> });
    setIsOpen(false);
  }

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <h1 className={`${fontdinerSwanky.className} text-center text-5xl`}>
        {eventData.eventName}
      </h1>
      <div className="flex flex-col gap-y-2">
        <h3>Event Description: {eventData.eventDescription}</h3>
        <h3>Event Date: {eventData.eventDate}</h3>
        <h3>Country: {eventData.country}</h3>
        <h3>Street Address: {eventData.streetAddress}</h3>
        <h3>City: {eventData.city}</h3>
        <h3>Region: {eventData.region}</h3>
        <h3>Postal Code: {eventData.postalCode}</h3>
        {inviteeData?.length > 0 && (
          <>
            <h3 className="font-bold">Invitees</h3>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                        >
                          # of Guests
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {inviteeData.map((person) => (
                        <tr key={person.email}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                            {person.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                            {person.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                            {person.count}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              type="button"
                              onClick={() => {
                                setSelectedInvitee(person._id);
                                setIsOpen(true);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 bg-[#8B6BB9] p-12">
            <DialogTitle className="font-bold">Deactivate account</DialogTitle>
            <Description>
              This will permanently deactivate this invitee
            </Description>
            <p>
              Are you sure you want to deactivate your account? All of your data
              will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-[#45355C] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={handleDeleteInvitee}
              >
                Delete Invitee
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
