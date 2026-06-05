-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('Evaluator', 'Moderator');
CREATE TYPE paper_workflow_status AS ENUM (
  'Pending_E1_E2',
  'Needs_Reconciliation',
  'Completed'
);

-- 2. Create Tables
CREATE TABLE public.exam_blueprints (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  structures JSONB NOT NULL, -- Holds question keys and max marks: [{"id": "q1", "max_score": 10}, ...]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.papers (
  id TEXT PRIMARY KEY,
  anonymous_id TEXT UNIQUE NOT NULL,
  pdf_url TEXT NOT NULL,
  blueprint_id TEXT REFERENCES public.exam_blueprints(id) ON DELETE CASCADE NOT NULL,
  status paper_workflow_status DEFAULT 'Pending_E1_E2'::paper_workflow_status NOT NULL,
  final_score NUMERIC(5, 2) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id TEXT REFERENCES public.papers(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL, -- Maps to User ID
  user_role user_role NOT NULL,
  question_scores JSONB NOT NULL, -- Format: {"q1": 8.5, "q2": 4.0}
  total_score NUMERIC(5, 2) NOT NULL,
  evaluation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Double-Blind constraint: One evaluator can submit only one review per paper
  CONSTRAINT unique_paper_user_evaluation UNIQUE (paper_id, user_id),
  
  -- Score constraint: Total score cannot be negative
  CONSTRAINT chk_total_score_non_negative CHECK (total_score >= 0.0)
);

-- 3. PostgreSQL Variance Engine Function
CREATE OR REPLACE FUNCTION public.verify_variance_and_route()
RETURNS TRIGGER AS $$
DECLARE
  eval_count INT;
  score1 NUMERIC(5, 2);
  score2 NUMERIC(5, 2);
  score_diff NUMERIC(5, 2);
  avg_score NUMERIC(5, 2);
BEGIN
  -- Step A: Count existing evaluations matching the target paper
  SELECT COUNT(*) INTO eval_count
  FROM public.evaluations
  WHERE paper_id = NEW.paper_id;

  -- Step B: If there is only 1 evaluation, keep status as Pending_E1_E2
  IF eval_count = 1 THEN
    UPDATE public.papers
    SET status = 'Pending_E1_E2'::paper_workflow_status
    WHERE id = NEW.paper_id;

  -- Step C & D: If exactly 2 evaluations, compare scores and route
  ELSIF eval_count = 2 THEN
    -- Fetch both scores
    SELECT total_score INTO score1 
    FROM public.evaluations 
    WHERE paper_id = NEW.paper_id 
    ORDER BY created_at ASC 
    LIMIT 1;

    SELECT total_score INTO score2 
    FROM public.evaluations 
    WHERE paper_id = NEW.paper_id 
    ORDER BY created_at ASC 
    OFFSET 1 
    LIMIT 1;

    score_diff := ABS(score1 - score2);

    -- Step E: Check variance bounds
    IF score_diff >= 5.00 THEN
      UPDATE public.papers
      SET status = 'Needs_Reconciliation'::paper_workflow_status
      WHERE id = NEW.paper_id;
    ELSE
      avg_score := (score1 + score2) / 2.0;
      UPDATE public.papers
      SET status = 'Completed'::paper_workflow_status,
          final_score = avg_score
      WHERE id = NEW.paper_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Mock Seed Data
-- 4.1 Exam Blueprint Seed
INSERT INTO public.exam_blueprints (id, title, structures)
VALUES (
  'blueprint_math_101', 
  'Math Final Term', 
  '[{"id": "q1", "max_score": 10.0}, {"id": "q2", "max_score": 10.0}]'::jsonb
);

-- 4.2 Mock Evaluator Users (inserted into Supabase auth.users schema)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
VALUES 
  (
    'a0e0a9f3-8d2a-4a6c-9411-cf0b5d52c1e1', 
    'eval1@examval.edu', 
    '$2a$10$abcdefghijklmnopqrstuv', 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Evaluator One","role":"Evaluator"}', 
    'authenticated', 
    'authenticated'
  ),
  (
    'b0e0a9f3-8d2a-4a6c-9411-cf0b5d52c1e2', 
    'eval2@examval.edu', 
    '$2a$10$abcdefghijklmnopqrstuv', 
    now(), 
    '{"provider":"email","providers":["email"]}', 
    '{"name":"Evaluator Two","role":"Evaluator"}', 
    'authenticated', 
    'authenticated'
  );

-- 4.3 Mock Student Exam Papers
INSERT INTO public.papers (id, anonymous_id, pdf_url, blueprint_id, status, final_score)
VALUES 
  (
    'paper_001', 
    'STUDENT-X8A-98C', 
    'https://example.com/papers/paper_001.pdf', 
    'blueprint_math_101', 
    'Pending_E1_E2'::paper_workflow_status, 
    NULL
  ),
  (
    'paper_002', 
    'STUDENT-F7B-43F', 
    'https://example.com/papers/paper_002.pdf', 
    'blueprint_math_101', 
    'Pending_E1_E2'::paper_workflow_status, 
    NULL
  );

-- 5. Automated Table Trigger binding
CREATE TRIGGER trg_variance_check
  AFTER INSERT ON public.evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.verify_variance_and_route();

