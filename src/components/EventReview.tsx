import { type Control, useWatch } from 'react-hook-form';

import { type EventFormData } from '@/app/event/new/page';

import { Loader } from './Loader';

export function EventReview({
  control,
  inviteesEmail,
  isSubmitting,
}: {
  control: Control<EventFormData>;
  inviteesEmail: string[];
  isSubmitting: boolean;
}) {
  const formData = useWatch({ control });

  if (isSubmitting) {
    return <Loader loading={isSubmitting} />;
  }

  return (
    <div>
      <h2>Event Review</h2>
      <h3>Event Name: {formData.eventName}</h3>
      <h3>Event Description: {formData.eventDescription}</h3>
      <h3>Event Date: {formData.eventDate}</h3>
      <h3>Country: {formData.country}</h3>
      <h3>Street Address: {formData.streetAddress}</h3>
      <h3>City: {formData.city}</h3>
      <h3>Region: {formData.region}</h3>
      <h3>Postal Code: {formData.postalCode}</h3>
      <p className="font-bold">Invitees</p>
      <ul>
        {inviteesEmail.map((invitee) => (
          <li key={invitee}>{invitee}</li>
        ))}
      </ul>
    </div>
  );
}
