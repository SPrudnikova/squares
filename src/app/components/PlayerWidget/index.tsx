import * as React from 'react';

import * as style from './index.css';
import { PlayerModel } from 'app/models';

export interface PlayerWidgetProps {
  player: PlayerModel;
  showScore?: boolean;
}

const PlayerWidget = ({ player, showScore }: PlayerWidgetProps) => {
  const score = showScore ? <span>: {player.maxSequenceLength}</span> : null;

  return (
    <div className={style.playerWidget_container}>
      <div className={style.playerWidget_icon} style={{backgroundColor: player.color.code}}/>
      <span>{player.name}</span>
      {score}
    </div>
  );
};

export { PlayerWidget };
