describe('RateLimitService', () => {
  let service: RateLimitService;

  beforeEach(() => {
    service = new RateLimitService({
      rateLimit: {
        enabled: true,
        defaultLimit: 2,
        defaultWindowMs: 1000,
      },
    });
  });

  it('should allow first request', () => {
    expect(service.isAllowed('user-1')).toBe(true);
  });

  it('should block after limit', () => {
    service.isAllowed('user-1'); // 1
    service.isAllowed('user-1'); // 2

    expect(service.isAllowed('user-1')).toBe(false); // 3 → blocked
  });

  it('should reset after window', async () => {
    service.isAllowed('user-1');
    service.isAllowed('user-1');

    await new Promise((r) => setTimeout(r, 1100));

    expect(service.isAllowed('user-1')).toBe(true); // reset
  });
});
