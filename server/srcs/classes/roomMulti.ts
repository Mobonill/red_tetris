import { Player } from "./player.js";
import { PIECE_TYPES, PieceType } from "./types.js";
import { Pieces } from "./pieces.js";

export class RoomMulti {
  readonly id: string;
  players: Player[];
  
  // Instead of a single bag, this is an ever-expanding master sequence of pieces
  private pieceSequence: PieceType[];

  constructor(id: string) {
    this.id = id;
    this.players = [];
    this.pieceSequence = this._generateBag(); // Initialize with the first 7 pieces
  }

  // Standard 7-bag randomizer (unchanged from your solo version)
  private _generateBag(): PieceType[] {
    const piecesTab = [...PIECE_TYPES];

    for (let i = piecesTab.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = piecesTab[i];
      piecesTab[i] = piecesTab[j];
      piecesTab[j] = temp;
    }
    return piecesTab;
  }

  // Fetch a piece at a specific index. 
  // If a player reaches the end of the known sequence, we generate another bag for everyone.
  getPieceAt(index: number): PieceType {
    while (index >= this.pieceSequence.length) {
      this.pieceSequence.push(...this._generateBag());
    }
    return this.pieceSequence[index];
  }

  // Pass the player in so we know whose piece index to check and increment
  spawnPieceForPlayer(player: Player): Pieces {
    // Assuming you add a `pieceIndex` number property to your Player class!
    const type = this.getPieceAt(player.pieceIndex);
    
    console.log(`Next piece for ${player.name}:`, type);
    
    player.pieceIndex++; // Move this specific player forward in the sequence
    
    return Pieces.fromType(type);
  }
}