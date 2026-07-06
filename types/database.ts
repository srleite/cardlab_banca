
export type AppRole = "admin" | "shop" | "user";
export type GameType = "magic" | "pokemon" | "onepiece";
export type CardCondition = "M" | "NM" | "SP" | "MP" | "HP" | "DMG";
export type AuctionStatus =
  | "draft"
  | "active"
  | "ended"
  | "cancelled"
  | "awarded";

export type Profile = {
  id: string;
  display_name: string;
  shop_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRole = {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_at: string;
};

export type Auction = {
  id: string;
  shop_id: string;
  game: GameType;
  card_name: string;
  description: string | null;
  condition: CardCondition;
  image_url: string;
  starting_price: number;
  current_bid: number | null;
  status: AuctionStatus;
  ends_at: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; display_name: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, "id" | "assigned_at"> &
          Partial<Pick<UserRole, "id" | "assigned_at">>;
        Update: Partial<UserRole>;
        Relationships: [];
      };
      auctions: {
        Row: Auction;
        Insert: Omit<
          Auction,
          "id" | "created_at" | "updated_at" | "current_bid"
        > &
          Partial<
            Pick<Auction, "id" | "created_at" | "updated_at" | "current_bid">
          >;
        Update: Partial<Auction>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      has_role: {
        Args: { uid: string; target_role: AppRole };
        Returns: boolean;
      };
    };
  };
};
