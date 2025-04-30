
-- Create a storage bucket for service request images
insert into storage.buckets (id, name, public)
values ('service_images', 'Service Request Images', true);

-- Set up security policies for the service_images bucket
create policy "Anyone can view service images"
  on storage.objects for select
  using ( bucket_id = 'service_images' );

create policy "Authenticated users can upload service images"
  on storage.objects for insert
  with check (
    bucket_id = 'service_images' 
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own service images"
  on storage.objects for update
  using (
    bucket_id = 'service_images'
    and auth.uid() = owner
  );

create policy "Users can delete their own service images"
  on storage.objects for delete
  using (
    bucket_id = 'service_images'
    and auth.uid() = owner
  );
