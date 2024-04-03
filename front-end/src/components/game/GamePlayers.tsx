import dashStyles from '@/styles/dash.module.css';
import gameStyles from '@/styles/game.module.css';
import { PlayerCard } from '@/components/game/types/game.type';
import Link from 'next/link';

interface GamePlayersProps {
  players: {
    left: PlayerCard;
    right: PlayerCard;
  };
}

export const GamePlayers = ({ players }: GamePlayersProps): JSX.Element => {
  return (
    <div className={gameStyles.ctn__game_players}>
      <Link href={`/profile/${players.left.id}`}>
        <div className={gameStyles.ctn__game_player}>
          <picture>
            <img
              className={dashStyles.img__prof}
              src={players.left.profilePicture}
              alt="Left player picture"
            />
          </picture>
          <h2 className={gameStyles.result_h2}>{players.left.username}</h2>
        </div>
      </Link>
      <span style={{ margin: '0 5vw' }}> </span>
      <Link href={`/profile/${players.right.id}`}>
        <div className={gameStyles.ctn__game_player}>
          <h2 className={gameStyles.result_h2}>{players.right.username}</h2>
          <picture>
            <img
              className={dashStyles.img__prof}
              src={players.right.profilePicture}
              alt="Right player picture"
            />
          </picture>
        </div>
      </Link>
    </div>
  );
};
