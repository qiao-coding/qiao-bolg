import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('GitHub sign in entry', () => {
  it('uses the server action signIn helper instead of the client helper in a form action', () => {
    const source = readFileSync('src/components/features/auth/Github_signIn.tsx', 'utf8');

    expect(source).toContain('import { signIn } from "../../../../auth"');
    expect(source).toContain('redirectTo }: { redirectTo: string }');
    expect(source).toContain('"use server"');
    expect(source).toContain('await signIn("github", { redirectTo })');
    expect(source).not.toContain('next-auth/react');
  });

  it('trusts the deployment host for OAuth callback requests', () => {
    const source = readFileSync('auth.ts', 'utf8');

    expect(source).toContain('trustHost: true');
  });
});
