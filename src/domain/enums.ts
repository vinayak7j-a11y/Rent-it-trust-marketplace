// USER

export enum UserRole {
  RENTER = 'renter',
  OWNER = 'owner',
  SHOP = 'shop',
  AGENT = 'agent',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  LIMITED = 'limited',
  BANNED = 'banned',
}

export enum TrustTier {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum Language {
  EN = 'en',
  HI = 'hi',
}

// ITEM

export enum ItemState {
  INTENT = 'intent',
  AT_HUB = 'at_hub',
  VERIFIED = 'verified',
  LISTED = 'listed',
  BOOKED = 'booked',
  IN_USE = 'in_use',
  RETURNED = 'returned',
  COOLDOWN = 'cooldown',
}

// BOOKING

export enum BookingState {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  PICKED_UP = 'picked_up',
  RETURNED = 'returned',
  CLOSED = 'closed',
}

// DAMAGE

export enum DamageType {
  MINOR_STAIN = 'minor_stain',
  FABRIC_PULL = 'fabric_pull',
  TEAR = 'tear',
  MISSING_ITEM = 'missing_item',
  IRREVERSIBLE_DAMAGE = 'irreversible_damage',
}
