import React, { useState } from 'react';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Month,
  Inject,
  Resize,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import { L10n } from '@syncfusion/ej2-base';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ApiUrl } from '../utilities/constants';

// eslint-disable-next-line react/destructuring-assignment
const PropertyPane = (props) => <div className='mt-5'>{props.children}</div>;

L10n.load({
  'en-US': {
    schedule: {
      addTitle: 'Mark Attendance',
    },
  },
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Scheduler = ({ schedule }) => {
  const [scheduleObj, setScheduleObj] = useState();
  const [scheduleData, setScheduleData] = useState(schedule);

  const change = (args) => {
    scheduleObj.selectedDate = args.value;
    scheduleObj.dataBind();
  };

  const onDragStart = (arg) => {
    // eslint-disable-next-line no-param-reassign
    arg.navigation.enable = true;
  };

  const handlePopUp = (args) => {
    if (args.type === 'QuickInfo') {
      args.element.querySelector('.e-subject').disabled = true;
    } else {
      args.cancel = true;
    }
  };

  const markAttendance = async (slot) => {
    const response = await fetch(ApiUrl('/attendance/create/'), {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getCookie('userToken')}`,
      },
      body: JSON.stringify(slot),
    });

    const data = await response.json();

    let dataToSet = data.map((item) => {
      return { ...item, Id: item.uuid };
    });
    setScheduleData(dataToSet);
  };

  const updateAttendance = async (slot) => {
    const response = await fetch(ApiUrl('/attendance/update/'), {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getCookie('userToken')}`,
      },
      body: JSON.stringify(slot),
    });

    const data = await response.json();

    let dataToSet = data.map((item) => {
      return { ...item, Id: item.uuid };
    });
    setScheduleData(dataToSet);
  };

  // handle submit
  const submitHandler = async (e, status) => {
    let eventData = {};

    const getSlotData = () => {
      const cellDetails = scheduleObj.getCellDetails(
        scheduleObj.getSelectedElements()
      );
      const eventData = scheduleObj.eventWindow.getObjectFromFormData(
        'e-quick-popup-wrapper'
      );
      const addObj = {};
      addObj.Id = scheduleObj.getEventMaxID();
      addObj.Subject = status;
      addObj.StartTime = new Date(+cellDetails.startTime);
      addObj.EndTime = new Date(+cellDetails.endTime);
      addObj.Location = eventData.Location;
      return addObj;
    };

    let availableSlot = getSlotData();

    let checkData = scheduleData.find(
      (i) => Date.parse(availableSlot.StartTime) === Date.parse(i.StartTime)
    );

    if (
      scheduleObj.isSlotAvailable(
        availableSlot.StartTime,
        availableSlot.EndTime
      ) &&
      !checkData
    ) {
      await markAttendance(availableSlot);
    } else {
      let previousEvent = scheduleData.find(
        (item) =>
          Date.parse(item.StartTime) === Date.parse(availableSlot.StartTime)
      );
      let slot = { ...availableSlot, Id: previousEvent.Id };

      await updateAttendance(slot);
    }

    scheduleObj.closeQuickInfoPopup();
  };

  // customizing quick Pop up footer
  const Footer = (props) => (
    <div className='e-cell-footer flex justify-between px-2'>
      <div className='left-button'>
        <button
          id='absent'
          onClick={(e) => submitHandler(e, 'Absent')}
          className='e-event-create text-[#EE4B2B] text-xl rounded-full p-3 hover:bg-light border border-gray-400'
        >
          {' '}
          <FaTimes />{' '}
        </button>
      </div>
      <div className='right-button'>
        <button
          id='present'
          onClick={(e) => submitHandler(e, 'Present')}
          className='e-event-create text-[#3c67ff] text-xl rounded-full p-3 hover:bg-light border border-gray-400'
        >
          {' '}
          <FaCheck />{' '}
        </button>
      </div>
    </div>
  );

  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <ScheduleComponent
        height='650px'
        ref={(schedule) => setScheduleObj(schedule)}
        selectedDate={new Date()}
        eventSettings={{
          dataSource: scheduleData,
        }}
        quickInfoTemplates={{ footer: Footer }}
        dragStart={onDragStart}
        popupOpen={handlePopUp}
        allowMultiCellSelection={false}
      >
        <ViewsDirective>
          {['Month'].map((item) => (
            <ViewDirective key={item} option={item} />
          ))}
        </ViewsDirective>
        <Inject services={[Month, Resize, DragAndDrop]} />
      </ScheduleComponent>
      <PropertyPane>
        <table style={{ width: '100%', background: 'white' }}>
          <tbody>
            <tr style={{ height: '50px' }}>
              <td style={{ width: '100%' }}>
                <DatePickerComponent
                  value={new Date()}
                  showClearButton={false}
                  placeholder='Current Date'
                  floatLabelType='Always'
                  change={change}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
  );
};

export default Scheduler;
