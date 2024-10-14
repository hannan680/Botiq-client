"use client"; 
import React, { useState, useEffect } from 'react';
import { useGetCalendars } from '../hooks/useGetCalenders';
import { useUserContext } from '../providers/userContext'; 
import ConsentModal from './ConsentModal'; 
import { useCreateOrUpdateCustomValue } from '../hooks/useCreateOrUpdateCustomValue'; 

const CalendarSelector: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('Select Calendar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarToSelect, setCalendarToSelect] = useState<{ name: string; id: string } | null>(null);

  // Access user data from context
  const { userData ,ssoKey} = useUserContext();
  const activeLocation = userData?.activeLocation;

  // Use the custom hook to fetch calendars based on activeLocation
  const { data, error, isLoading } = useGetCalendars(activeLocation!);
  const { mutate: createOrUpdateCustomValue } = useCreateOrUpdateCustomValue();

  // Update the selected calendar based on the fetched data
  useEffect(() => {
    if (data?.selectedCalendar) {
      setSelectedCalendar(data.selectedCalendar.name);
    }
  }, [data]);

  const handleCalendarClick = (calendar: { name: string; id: string }) => {
    // Check if the selected calendar is the same as the currently selected one
    if (calendar.name === selectedCalendar) {
      setShowDropdown(false);
      return; // Do not show the modal if the calendar is already selected
    }

    setCalendarToSelect(calendar);
    setIsModalOpen(true);
    setShowDropdown(false);
  };

  const handleConfirmSelection = () => {
    if (calendarToSelect) {
      setSelectedCalendar(calendarToSelect.name);

      // Call the createOrUpdateCustomValue function with the necessary parameters
      createOrUpdateCustomValue({
        locationId: userData?.activeLocation!, // Adjust this if necessary
        name: "Calendar ID",
        value: calendarToSelect.id,
        ssoKey:ssoKey!
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex space-x-4 items-center">
      {/* Select Calendar Button */}
      <h4 className='font-bold '>Select Calendar</h4>
      <div className="relative">
      <button
  onClick={() => setShowDropdown(!showDropdown)}
  className="bg-gray-800 text-white px-6 py-2 rounded-full flex items-center justify-between space-x-2 w-[300px] overflow-hidden "
>
  <span className="whitespace-nowrap overflow-x-auto no-scrollbar">
    {selectedCalendar}
  </span>
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    ></path>
  </svg>
</button>


        {/* Dropdown List */}
        {showDropdown && (
          <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-10">
            <ul className="py-2">
              {isLoading && <li className="px-4 py-2 text-gray-700">Loading...</li>}
              {error && <li className="px-4 py-2 text-red-600">Error fetching calendars</li>}
              {data?.calendars.length===0 && <li className="px-4 py-2 text-red-600">No Calenders Found</li>}
              {data?.calendars.map((calendar) => (
                <li
                  key={calendar.id}
                  onClick={() => handleCalendarClick({ name: calendar.name, id: calendar.id })}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {calendar.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Consent Modal */}
      <ConsentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSelection}
        calendarName={calendarToSelect?.name || ""}
      />
    </div>
  );
};

export default CalendarSelector;
