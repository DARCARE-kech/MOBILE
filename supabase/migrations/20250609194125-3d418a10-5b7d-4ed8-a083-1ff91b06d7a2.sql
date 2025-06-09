
-- Add number_of_people column to space_reservations table
ALTER TABLE public.space_reservations 
ADD COLUMN number_of_people integer NOT NULL DEFAULT 1;

-- Add form schema entries for the three specific spaces
-- Fitness Center
INSERT INTO public.space_form_schema (space_id, field_name, label, input_type, required, options)
VALUES (
  'c9646da3-c19d-44ec-b178-ecc2958ce1a2',
  'number_of_people',
  'Number of People',
  'number',
  true,
  '{"min": 1, "max": 20, "placeholder": "Enter number of people"}'
);

-- Swimming Pool  
INSERT INTO public.space_form_schema (space_id, field_name, label, input_type, required, options)
VALUES (
  'd081df15-3648-428d-abdf-40d5c68bd0f8',
  'number_of_people', 
  'Number of People',
  'number',
  true,
  '{"min": 1, "max": 20, "placeholder": "Enter number of people"}'
);

-- Padel Court
INSERT INTO public.space_form_schema (space_id, field_name, label, input_type, required, options) 
VALUES (
  '2358081e-da63-4099-a1de-b9ad75a99a53',
  'number_of_people',
  'Number of People', 
  'number',
  true,
  '{"min": 1, "max": 20, "placeholder": "Enter number of people"}'
);
