import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSettings } from "./useSettings";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import { useUpadteSetting } from "./useUpdateSetting";
import { useDarkMode } from "../../contexts/DarkModeContex";
function UpdateSettingsForm() {
  const { isLoading, settings = {}, error } = useSettings();

  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings;

  const { isUpdating, updateSetting } = useUpadteSetting();
  const { isRegularUser } = useDarkMode();

  if (isLoading) return <Spinner />;

  if (error) toast.error("There was problem in loading setting");

  const handaleUpdateSetting = function (e, field) {
    const { value } = e.target;
    // console.log(value, settings[field]);
    if (Number(value) === settings[field]) return;
    updateSetting({ [field]: value });
  };

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          disabled={isUpdating || isRegularUser}
          defaultValue={minBookingLength}
          onBlur={(e) => handaleUpdateSetting(e, "minBookingLength")}
          type="number"
          id="min-nights"
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          disabled={isUpdating || isRegularUser}
          defaultValue={maxBookingLength}
          onBlur={(e) => handaleUpdateSetting(e, "maxBookingLength")}
          type="number"
          id="max-nights"
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          disabled={isUpdating || isRegularUser}
          defaultValue={maxGuestsPerBooking}
          onBlur={(e) => handaleUpdateSetting(e, "maxGuestsPerBooking")}
          type="number"
          id="max-guests"
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          disabled={isUpdating || isRegularUser}
          defaultValue={breakfastPrice}
          onBlur={(e) => handaleUpdateSetting(e, "breakfastPrice")}
          type="number"
          id="breakfast-price"
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
