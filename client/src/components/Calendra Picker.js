// DatePickerComponent.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DatePickerComponent({ serviceid }) {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleBooking = () => {
        const formatDate = (date) => moment(date).format('DD-MM-YYYY');
        navigate(`/book/${serviceid}/${formatDate(startDate)}/${formatDate(endDate)}`);
    };

    return (
        <div className="date-picker-container">
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="From Date"
            />
            <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="To Date"
            />
            <button onClick={handleBooking} disabled={!startDate || !endDate}>
                Proceed to Booking
            </button>
        </div>
    );
}