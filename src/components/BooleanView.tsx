import { Card } from "@/ui";
import { Checkbox } from "@mantine/core";

interface Props {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const BooleanView: React.FC<Props> = (props) => {
  return (
    <Card className="flex flex-row items-center">
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
    </Card>
  );
};

export default BooleanView;
