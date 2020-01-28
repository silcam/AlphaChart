import React from "react";

type MenuItem = [string, () => void];

interface IProps {
  items: MenuItem[];
}

export default function DropDownMenu(props: IProps) {
  return (
    <table
      className="padded-cells menu"
      style={{
        width: "max-content",
        fontSize: "initial",
        fontWeight: "normal"
      }}
    >
      <tbody>
        {props.items.map((item, index) => (
          <tr key={index}>
            <td onClick={item[1]}>{item[0]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
