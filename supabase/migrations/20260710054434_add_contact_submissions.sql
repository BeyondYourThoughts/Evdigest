/*
# Contact Submissions Table

1. New Tables
- `contact_submissions` — stores contact form, advertise enquiry, and write-for-us pitches
  - id (uuid PK), name, email, subject, message, form_type (default 'contact'),
    submitted_at

2. Security
- RLS enabled.
- TO anon, authenticated — public content site, no sign-in.
- INSERT-only for anon (no select/update/delete to protect submissions).
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  form_type text NOT NULL DEFAULT 'contact',
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_submissions;
CREATE POLICY "anon_insert_contact" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
