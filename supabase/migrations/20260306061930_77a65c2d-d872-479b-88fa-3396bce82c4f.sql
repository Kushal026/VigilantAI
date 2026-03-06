
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'analyst', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create login_logs table
CREATE TABLE public.login_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  ip_address TEXT,
  device_info TEXT,
  browser TEXT,
  os TEXT,
  location TEXT,
  country TEXT,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  success BOOLEAN NOT NULL DEFAULT true,
  failure_reason TEXT,
  login_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view login logs" ON public.login_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert login logs" ON public.login_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  anomaly_type TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  ip_address TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (true);

-- Create risk_scores table
CREATE TABLE public.risk_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  anomaly_label TEXT NOT NULL DEFAULT 'normal' CHECK (anomaly_label IN ('normal', 'suspicious', 'high_risk')),
  explanation TEXT,
  factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view risk scores" ON public.risk_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert risk scores" ON public.risk_scores FOR INSERT TO authenticated WITH CHECK (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_login_logs_user_id ON public.login_logs(user_id);
CREATE INDEX idx_login_logs_login_at ON public.login_logs(login_at);
CREATE INDEX idx_login_logs_success ON public.login_logs(success);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);
CREATE INDEX idx_risk_scores_user_id ON public.risk_scores(user_id);
CREATE INDEX idx_risk_scores_created_at ON public.risk_scores(created_at);
