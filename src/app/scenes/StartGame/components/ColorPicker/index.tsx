import * as React from 'react';

import * as style from './index.css';
import { PLAYER_COLORS } from 'app/constants/playerColors';
import { ColorModel } from 'app/models';

export interface ColorPickerProps {
  selectedColors: StringObject;
  activeColor: ColorModel;
  handleColorChange: (color: ColorModel) => void;
}

const ColorPicker = ({ activeColor, selectedColors, handleColorChange }: ColorPickerProps) => {

  const chooseColor = (color: ColorModel) => () => {
    handleColorChange(color);
  };

  const isActiveColor = (color: string): boolean => {
    return activeColor.code === color;
  };

  const filteredColors = PLAYER_COLORS.filter((color: ColorModel) => !selectedColors[color.name]);
  return (
    <div className={style.colorPicker_container}>
      {
        filteredColors.map((color: ColorModel) => {
          return <div
            key={color.code}
            className={[style.colorPicker_item, isActiveColor(color.code) ? style.colorPicker_activeItem : ''].join(' ')}
            style={{ backgroundColor: color.code }}
            onClick={chooseColor(color)}/>
        })
      }
    </div>
  );
};

export { ColorPicker };
