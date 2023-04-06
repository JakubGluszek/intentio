import { Checkbox } from "@mantine/core";

interface Props {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const BooleanView: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-row items-center card p-1.5">
      <label className="w-full text-sm" htmlFor={props.label}>
        {props.label}
      </label>
      <Checkbox
        id={props.label}
        size="sm"
        defaultChecked={props.checked}
        onChange={(value) => props.onChange(value.currentTarget.checked)}
        styles={{
          icon: { color: "rgb(var(--primary-color)) !important" },
          root: { height: "20px" },
        }}
        classNames={{
          input:
            "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
        }}
        tabIndex={-2}
      />
    </div>
  );
};

export default BooleanView;
