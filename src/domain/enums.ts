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

// ITEM LIFECYCLE
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
// BOOKING LIFECYCLE
export enum BookingState {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  PICKED_UP = 'picked_up',
  RETURNED = 'returned',
  CANCELLED = 'cancelled',   // 👈 ADD THIS
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

// FIT COMPATIBILITY
export enum FitCompatibility {
  GOOD = 'good',
  WARNING = 'warning',
  HIGH_RISK = 'high_risk',
} 
export enum DemandStatus {
  ACTIVE = 'active',
  FULFILLED = 'fulfilled',
  EXPIRED = 'expired',
}
