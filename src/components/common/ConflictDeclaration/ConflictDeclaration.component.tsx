import { useForm, Controller } from 'react-hook-form';
import { Button, Row, Col } from 'react-bootstrap';
import { ConflictDeclarationService } from '@/api/services/ConflictDeclarations.service';
import { toast } from 'react-toastify';
import { useState } from 'react';
import ConflictHistoryModal from './ConflictHistoryModal';
import { useLanguage } from "@/context/languageContext";
import DatePickerController from '../DatePickerController/DatePickerController';
import SvgCalendaricon from '@/components/icons/calendar-icon';
import TextEditor from '../TextEditor/TextEditor.component';

interface ConflictDeclarationFormData {
  descriptionText: string;
  recurrence: number;
  recurrenceStartDate: Date;
  notificationMessage: string;
}

const ConflictDeclaration = () => {
  const { register, handleSubmit, reset, control } = useForm<ConflictDeclarationFormData>({
    defaultValues: {
      recurrenceStartDate: new Date()
    }
  });

  // Custom validation for date
  const validateDateTime = (value: Date) => {
    if (!value) return "Date is required";
    const selectedDate = new Date(value);

    // Check if selected date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected.getTime() < today.getTime()) {
      return "Please select a current or future date";
    }
    return true;
  };
  const [showHistory, setShowHistory] = useState(false);
  const { getValue } = useLanguage();
  const onSubmit = async (data: ConflictDeclarationFormData) => {
    try {
      const startDate = new Date(data.recurrenceStartDate);

      // Combine selected date with current time for proper UTC conversion
      const now = new Date();
      const dateWithCurrentTime = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
      );

      const payload = {
        descriptionText: data.descriptionText,
        recurrence: Number(data.recurrence),
        notificationMessage: data.notificationMessage,
        period: startDate.getDate() <= 10 ? 0 : startDate.getDate() <= 20 ? 1 : 2, // First, Middle, Last
        month: startDate.getMonth() + 1, // 1-12
        recurrenceStartDate: dateWithCurrentTime.toISOString(),
      };
      await ConflictDeclarationService.createConflictDeclaration(payload);
      toast.success('Conflict Declaration added successfully');

      reset(); // reset form after submission
    } catch (error) {
      toast.error((error as Error).message || 'Error adding Conflict Declaration');
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className=" bg-white rounded  ">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2> {getValue("Conflict_Declaration_Settings")}</h2>
            <p>{getValue("Add_New_Conflict_Declaration_Settings")} </p>
          </div>
          <Button style={{ backgroundColor: '#ff5000', borderColor: '#ff5555' }} onClick={() => setShowHistory(true)}> {getValue("View_History")}</Button>
        </div>

        <div className="form-group mb-4">
          <label>{getValue("Conflict_Declaration_Text")}</label>
          <Controller
            name="descriptionText"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder={getValue("Enter_Conflict_Declaration_Text")}
                className="form-control"
              />
            )}
          />
        </div>

        <Row className="mb-4">
          <Col md={6}>
            <div className="form-group">
              <label>{getValue("Recurrence")}</label>
              <input type="number" className="form-control" {...register('recurrence', { required: true, min: 1 })} />
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group">
              <label>{getValue("Recurrence_Start_Date")}</label>
              <DatePickerController
                name="recurrenceStartDate"
                control={control}
                dateFormat="dd/MM/yyyy"
                showIcon
                hasDefault={true}
                required
                toggleCalendarOnIconClick
                icon={<SvgCalendaricon />}
                minDate={new Date()}
                rules={{
                  validate: validateDateTime
                }}
              />
            </div>
          </Col>
        </Row>

        <div className="form-group mb-4">
          <label> {getValue("Notification_Message")}</label>
          <textarea className="form-control" {...register('notificationMessage', { required: true })} placeholder={getValue("Enter_Notification_Message")} />
        </div>

        <div className="text-end">
          <Button type="submit" style={{ backgroundColor: '#773DBD', borderColor: '##773DBD' }}>{getValue("save")} </Button>
        </div>
      </form>
      {showHistory && (
        <ConflictHistoryModal show={showHistory} handleClose={() => setShowHistory(false)} />
      )}
    </>
  );
};

export default ConflictDeclaration;


