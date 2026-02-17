// USER ROLES
export enum UserRole {
  RENTER = 'renter',
  OWNER = 'owner',
  SHOP = 'shop',
  AGENT = 'agent',
  ADMIN = 'admin',
}

// USER STATUS
export enum UserStatus {
  ACTIVE = 'active',
  LIMITED = 'limited',
  BANNED = 'banned',
}

// TRUST TIERS
export enum TrustTier {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// LANGUAGE
export enum Language {
  EN = 'en',
  HI = 'hi',
}

// ITEM STATES
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

// BOOKING STATES
export enum BookingState {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  PICKED_UP = 'picked_up',
  RETURNED = 'returned',
  CLOSED = 'closed',
}

// DAMAGE TYPES
export enum DamageType {
  MINOR_STAIN = 'minor_stain',
  FABRIC_PULL = 'fabric_pull',
  TEAR = 'tear',
  MISSING_ITEM = 'missing_item',
  IRREVERSIBLE_DAMAGE = 'irreversible_damage',
}

// TRUST EVENTS
export enum TrustEventType {
  CLEAN_RETURN = 'clean_return',
  LATE_RETURN = 'late_return',
  DAMAGE_REPORTED = 'damage_reported',
  REPEATED_GOOD = 'repeated_good',
}

// FIT COMPATIBILITY
export enum FitCompatibility {
  GOOD = 'good',
  WARNING = 'warning',
  HIGH_RISK = 'high_risk',
}
