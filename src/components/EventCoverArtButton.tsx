import { PhotoIcon } from '@heroicons/react/24/solid';
import { Controller } from 'react-hook-form';

export function EventCoverArtButton() {
  return (
    <Controller
      name="eventCoverPhoto"
      render={({ field }) => {
        return (
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
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.files[0]);
                      }}
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
        );
      }}
    />
  );
}
