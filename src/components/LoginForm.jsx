import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from './FormInput';

/**
 * Login form.
 * onSubmit receives { email, password } and should return a Promise.
 * Throw an Error with a `.message` inside onSubmit to surface a form-level error.
 */
export default function LoginForm({ onSubmit, onSwitchToRegister, entrance }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  function validate() {
    const errors = {};
    if (!email.trim() || !email.includes('@')) errors.email = 'Please enter a valid email or phone number.';
    if (!password) errors.password = 'Your password must contain between 4 and 60 characters.';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      triggerShake();
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setFormError(err?.message || 'Sign-in failed. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  }

  function triggerShake() {
    setShake(false);
    requestAnimationFrame(() => setShake(true));
  }

  return (
    <div
      className={`nf-card ${entrance ? 'nf-card--entrance' : ''} ${shake ? 'nf-card--shake' : ''}`}
      onAnimationEnd={() => setShake(false)}
    >
      <p className="nf-eyebrow">Welcome back</p>
      <h1 className="nf-card__title">Sign In</h1>

      {formError && <div className="nf-alert">{formError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          id="login-email"
          type="text"
          label="Email or phone number"
          icon="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={fieldErrors.email}
          valid={email.includes('@')}
          animationDelay="0ms"
        />
        <FormInput
          id="login-password"
          type="password"
          label="Password"
          icon="lock"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={fieldErrors.password}
          showToggle
          animationDelay="70ms"
        />

        <button type="submit" className="nf-btn-primary" disabled={loading}>
          <span className="nf-btn-primary__shine" />
          {loading ? <span className="nf-spinner" /> : 'Sign In'}
        </button>

        <div className="nf-row-between">
          <label className="nf-remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="nf-link-muted">Need help?</Link>
        </div>
      </form>

      <p className="nf-signup-line">
        New here? <button type="button" className="nf-link" onClick={onSwitchToRegister}>Create an account now</button>.
      </p>

      <p className="nf-legal">
        This page is protected by reCAPTCHA to ensure you're not a bot.{' '}
        <a href="#" className="nf-link-muted">Learn more.</a>
      </p>
    </div>
  );
}
