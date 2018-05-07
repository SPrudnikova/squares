import * as React from 'react';

import * as style from './index.css';
import { FieldCellModel } from 'app/models';

export interface RowProps {
  row: FieldCellModel[];
  onCellClick: (cell: FieldCellModel) => void;
}

const FieldRow = ({ row, onCellClick }: RowProps) => {
  return (
    <tr>
      {
        row.map((cell: FieldCellModel): JSX.Element => {
          return (
            <td
              key={cell.coords}
              style={{backgroundColor: cell.player ? cell.player.color.code : 'transparent'}}
              className={style.game_fieldCell}
              onClick={() => onCellClick(cell)}/>
          )
        })
      }
    </tr>
  );
};

export { FieldRow };
