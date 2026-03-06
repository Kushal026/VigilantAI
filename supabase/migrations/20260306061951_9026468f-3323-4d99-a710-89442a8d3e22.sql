
-- Tighten login_logs INSERT to only allow inserting for own user_id or via admin
DROP POLICY "Authenticated users can insert login logs" ON public.login_logs;
CREATE POLICY "Users can insert own login logs" ON public.login_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Tighten alerts INSERT/UPDATE to admin/analyst only
DROP POLICY "Authenticated users can insert alerts" ON public.alerts;
DROP POLICY "Authenticated users can update alerts" ON public.alerts;
CREATE POLICY "Admins and analysts can insert alerts" ON public.alerts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst'));
CREATE POLICY "Admins and analysts can update alerts" ON public.alerts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst'));

-- Tighten risk_scores INSERT to admin/analyst only
DROP POLICY "Authenticated users can insert risk scores" ON public.risk_scores;
CREATE POLICY "Admins and analysts can insert risk scores" ON public.risk_scores FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst'));
