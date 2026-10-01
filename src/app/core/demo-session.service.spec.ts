import { DEMO_PROFILE, DemoSession } from './demo-session.service';

describe('DemoSession', () => {
  it('starts without a user and rejects invalid credentials', () => {
    const session = new DemoSession();
    expect(session.active()).toBeFalse();
    expect(session.signIn('other@example.com', 'wrong')).toBeFalse();
    expect(session.profile()).toBeNull();
  });

  it('uses the same identity for credential login and direct demo access', () => {
    const session = new DemoSession();
    expect(session.signIn(' DEMO@FINFLOW.COM ', 'FinFlowDemo!')).toBeTrue();
    expect(session.profile()).toEqual(DEMO_PROFILE);
    session.end();
    expect(session.active()).toBeFalse();
    session.start();
    expect(session.profile()?.name).toBe('Demo User');
    expect(session.profile()?.initials).toBe('DU');
  });
});
