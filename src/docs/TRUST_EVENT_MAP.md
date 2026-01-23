# Trust Event Map

CLEAN_RETURN
- Triggered after successful return with no damage
- Reference: booking_id

REPEATED_GOOD
- Triggered after N clean returns in last X days
- Reference: user_id

LATE_RETURN
- Triggered when return exceeds allowed window
- Reference: booking_id

DAMAGE_REPORTED
- Triggered when damage is confirmed via rules
- Reference: booking_id
