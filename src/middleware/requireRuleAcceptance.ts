import { Request, Response, NextFunction } from 'express';
import { hasAcceptedActiveRule } from '../services/rules/ruleAuthorityService';

export async function requireRuleAcceptance(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const accepted = await hasAcceptedActiveRule(user.id, user.language);

  if (!accepted) {
    return res.status(403).json({
      error: 'RULE_ACCEPTANCE_REQUIRED',
    });
  }

  next();
}
