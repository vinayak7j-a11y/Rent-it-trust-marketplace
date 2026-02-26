-- Enforce only one active demand per user

CREATE UNIQUE INDEX "unique_active_demand_per_user"
ON "DemandRequest" ("userId")
WHERE "status" = 'active';