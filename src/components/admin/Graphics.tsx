/* eslint-disable @next/next/no-img-element -- Payload renders these outside next/image's loader config. */

/** MIL Digital logo on the admin login and create-account screens. */
export function Logo() {
  return (
    <span className="mil-admin-logo">
      <img src="/brand/mil-mark.png" alt="" width={1200} height={733} />
      <span>
        <strong>MIL Digital</strong>
        <small>Content manager</small>
      </span>
    </span>
  );
}

/** MIL logomark in the admin header. */
export function Icon() {
  return <img src="/brand/mil-mark.png" alt="MIL Digital" width={1200} height={733} className="mil-admin-icon" />;
}
