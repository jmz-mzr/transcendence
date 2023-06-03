import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '@/game/room.service';
import { GameRoom, GameState, Player } from './types/game.types';
import { SocketUserService } from '@/socket/user/socket.service';
import { GameGateway } from './game.gateway';
import { Game } from '@prisma/client';

@WebSocketGateway()
export class RoomGateway {
  constructor(
    private roomService: RoomService,
    private socketUserService: SocketUserService,
    private gameGateway: GameGateway,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findGame')
  async onFindGame(
    @ConnectedSocket() client: Socket,
  ): Promise<void | WsResponse<string | Player[]>> {
    // TODO:
    // in front wait for two players - if not in room within 10s,
    // then error and redirect to game index
    // otherwise create socket room for players and spectators

    this.roomService.addToPlayerQueue(client);
    const res = await this.roomService.findMatch(client);
    if (!res) return;
    if (res?.error) return { event: 'findError', data: res.error };
    if (res?.players) {
      const gameId = await this.roomService.getOrCreateGame(
        res.players[0].id,
        res.players[1].id,
      );

      if (!gameId) return { event: 'findError', data: 'Game creation error' };
      this.server
        .timeout(10000)
        .to(res.players[0].socketId)
        .to(res.players[1].socketId)
        .volatile.emit('foundGame', (err: unknown, _resp: string) => {
          if (err) {
            this.server
              .to(res.players![0].socketId)
              .to(res.players![1].socketId)
              .volatile.emit(
                'joinTimeout',
                "Your opponent is taking a shit. Let's find someone else",
              );
            this.roomService.deleteGame(gameId);
          } else {
            this.server
              .to(res.players![0].socketId)
              .to(res.players![1].socketId)
              .volatile.emit('joinGame', gameId);
          }
        });
    }
    return;
  }

  @SubscribeMessage('stopFindGame')
  onStopFindGame(@ConnectedSocket() client: Socket): void {
    console.log('Stoooooooooooooooooooooooooooooooooooop');
    this.roomService.removeFromPlayerQueue(client);
  }

  @SubscribeMessage('joinGame')
  async onJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: number,
  ): Promise<boolean | WsResponse<string>> {
    // TODO:
    // Check if game exists, otherwise gameError
    // Add client to room
    // Check if player (if so return true to isPlayer)
    // When two players are in game, start timer
    // When leave before game start, delete game ? Or button to leave ? Or prompt confirm ?
    // If game left by a player, count him as loser and X as score (-1 in DB)
    // When game over, update DB and check achievements
    // When all have left room, delete game if hasn't started ?

    // Also:
    // Deal with 'join-room' and 'leave-room' in case of disconnect/reconnect
    // in the middle of a game ? Or through the front useEffect?

    console.log({ gameId });
    const user = this.socketUserService.getSocketUser(client);
    const game = await this.roomService.getGame(gameId);

    if (!user) return { event: 'gameError', data: 'User not found' };
    if (!game) return { event: 'gameError', data: "This game doesn't exist" };
    this.roomService.joinRoom(client, user.id, game);
    if (this.roomService.playersReady(game)) {
      const gameRoom: GameRoom | undefined = this.roomService.getRoom(gameId);

      if (!gameRoom)
        return { event: 'gameError', data: "This room doesn't exist" };
      if (gameRoom.game.status === GameState.WAITING) {
        gameRoom.game.status = GameState.INGAME;
        this.gameGateway.startGame(gameRoom.game);
      }
    }
    // setTimeout(
    //   () => this.server.to(String(gameId)).emit('startCountdown'),
    //   1500,
    // );
    if (user.id === game.playerOneId || user.id === game.playerTwoId)
      return true;
    return false;
  }

  @SubscribeMessage('joinLocalGame')
  async onJoinLocalGame(
    @ConnectedSocket() client: Socket,
  ): Promise<number | WsResponse<string>> {
    // TODO:
    // Create UUID for local game
    // Add client to room
    // Check if player (if so return true to isPlayer)
    // When leave before game start, delete game ? Or button to leave ? Or prompt confirm ?
    // When all have left room, delete game if hasn't started ?
    // Also:
    // Deal with 'join-room' and 'leave-room' in case of disconnect/reconnect
    // in the middle of a game ? Or through the front useEffect?

    const user = this.socketUserService.getSocketUser(client);

    if (!user) return { event: 'gameError', data: 'User not found' };

    const gameId = await this.roomService.createUniqueGameId();
    const game: Game = {
      id: gameId,
      playerOneId: user.id,
      playerOneScore: 0,
      playerTwoId: user.id,
      playerTwoScore: 0,
      createdAt: new Date(),
      launchedAt: null,
      finishedAt: null,
      status: GameState.WAITING,
    };

    this.roomService.joinRoom(client, user.id, game);

    const gameRoom: GameRoom | undefined = this.roomService.getRoom(gameId);

    if (!gameRoom)
      return { event: 'gameError', data: "This room doesn't exist" };
    if (gameRoom.game.status === GameState.WAITING) {
      gameRoom.game.status = GameState.INGAME;
      this.gameGateway.startGame(gameRoom.game);
    }
    return gameId;
  }

  @SubscribeMessage('leaveGame')
  async onLeaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: number,
  ): Promise<void> {
    console.log(gameId);
    const user = this.socketUserService.getSocketUser(client);
    const game = await this.roomService.getGame(gameId);

    if (!user) return;
    if (!game) return;
    this.roomService.leaveRoom(client, user.id, gameId);
    if (user.id === game.playerOneId || user.id === game.playerTwoId)
      setTimeout(() => this.roomService.leaveGame(game, user.id), 3000);
  }
}
