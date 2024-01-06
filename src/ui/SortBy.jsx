import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = function (e) {
    const value = e.target.value;

    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  };
  const sortBy = searchParams.get("sortBy") || "";

  return (
    <Select
      onChange={handleChange}
      $type="white"
      options={options}
      value={sortBy}
    />
  );
}

export default SortBy;
